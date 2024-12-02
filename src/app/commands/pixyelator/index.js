function blobToImageElement(blob) {
  const url = URL.createObjectURL(blob);
  const img = document.createElement("img");
  img.src = url;

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = () => reject(img);
  });
}

function dataURLToImageElement(dataUrl) {
  const img = new Image();
  img.src = dataUrl;

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
}

function imageUrlToImageElement(imageUrl) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = () => reject(img);
  });
}

function arrayBufferToImageElement(arrayBuffer) {
  const blob = new Blob([arrayBuffer], { type: "image/png" });
  blobToImageElement(blob);
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Canvas to Blob conversion failed"));
      }
    }, "image/png");
  });
}

function canvasToDataURL(canvas) {
  return canvas.toDataURL("image/png");
}

function canvasToArrayBuffer(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob.arrayBuffer());
      } else {
        reject(new Error("Canvas to Blob conversion failed"));
      }
    });
  });
}

function convertToImageElement(image) {
  switch (true) {
    case image instanceof HTMLImageElement:
      return image;
    case image instanceof Blob:
      return blobToImageElement(image);
    case typeof image === "string" && image.startsWith("data:"):
      return dataURLToImageElement(image);
    case typeof image === "string":
      return imageUrlToImageElement(image);
    case image instanceof ArrayBuffer:
      return arrayBufferToImageElement(image);
    default:
      console.error("Unsupported image type");
      return;
  }
}

function convertToOutputType(canvas, OutputType) {
  switch (OutputType) {
    case "blob":
      return canvasToBlob(canvas);
    case "dataURL":
      return canvasToDataURL(canvas);
    case "arrayBuffer":
      return canvasToArrayBuffer(canvas);
    default:
      return canvas;
  }
}

export class Pixyelator {
  static toElement(imgInput, xPixels, yPixels, OutputType, maxWorkers) {
    return this.fromElement(imgInput, xPixels, yPixels, OutputType, maxWorkers);
  }

  static toBlob(imgInput, xPixels, yPixels, maxWorkers) {
    return this.fromElement(imgInput, xPixels, yPixels, "blob", maxWorkers);
  }

  static toDataURL(imgInput, xPixels, yPixels, maxWorkers) {
    return this.fromElement(imgInput, xPixels, yPixels, "dataURL", maxWorkers);
  }

  static toArrayBuffer(imgInput, xPixels, yPixels, maxWorkers) {
    return this.fromElement(
      imgInput,
      xPixels,
      yPixels,
      "arrayBuffer",
      maxWorkers
    );
  }

  static async fromElement(
    imgInput,
    xPixels,
    yPixels,
    OutputType,
    maxWorkers = null
  ) {
    const imgElement = await convertToImageElement(imgInput);

    if (!imgElement) {
      return;
    }

    const width = imgElement.naturalWidth;
    const height = imgElement.naturalHeight;

    const displayCanvas = await this._pixelateElement(
      imgElement,
      width,
      height,
      xPixels,
      yPixels,
      maxWorkers
    );
    return convertToOutputType(displayCanvas, OutputType);
  }

  static _pixelateElement(
    element,
    width,
    height,
    xPixels,
    yPixels,
    maxWorkers
  ) {
    return new Promise((resolve) => {
      if (xPixels > width || yPixels > height) {
        console.error("Number of pixels exceeds the dimensions of the image.");
        return;
      }

      const displayCanvas = document.createElement("canvas");
      const displayCtx = displayCanvas.getContext("2d");

      displayCanvas.width = width;
      displayCanvas.height = height;

      const shouldAllocateByRows = xPixels > yPixels;

      const widthRemainderPixels = width % xPixels;
      const heightRemainderPixels = height % yPixels;

      let individualSectionWidths = Array.from({ length: xPixels }, () =>
        Math.floor(width / xPixels)
      );

      for (let i = 0; i < widthRemainderPixels; i++) {
        individualSectionWidths[
          Math.floor(i * (xPixels / widthRemainderPixels))
        ]++;
      }

      let individualSectionHeights = Array.from({ length: yPixels }, () =>
        Math.floor(height / yPixels)
      );

      for (let i = 0; i < heightRemainderPixels; i++) {
        individualSectionHeights[
          Math.floor(i * (yPixels / heightRemainderPixels))
        ]++;
      }

      if (!maxWorkers) {
        maxWorkers = navigator.hardwareConcurrency;
      }

      const workerArray = [];

      const tasks = [];
      let resolvedTasks = 0;

      const outerValues = shouldAllocateByRows
        ? individualSectionHeights
        : individualSectionWidths;

      const innerValues = shouldAllocateByRows
        ? individualSectionWidths
        : individualSectionHeights;

      let outerDimension = 0;

      outerValues.forEach((outerValue) => {
        tasks.push([outerValue, outerDimension]);
        outerDimension += outerValue;
      });

      const maxProcesses = Math.min(tasks.length, maxWorkers);

      for (let i = 0; i < maxProcesses; i++) {
        nextQueue();
      }

      function processInnerSlice(
        outerValue,
        outerDimension,
        innerWorker = null
      ) {
        const [sliceX, sliceY, sliceWidth, sliceHeight] = shouldAllocateByRows
          ? [0, outerDimension, width, outerValue]
          : [outerDimension, 0, outerValue, height];
        return new Promise((resolve, reject) => {
          createImageBitmap(
            element,
            sliceX,
            sliceY,
            sliceWidth,
            sliceHeight
          ).then((imageSliceBitmap) => {
            if (!innerWorker) {
              innerWorker = new Worker(
                new URL("innerWorker.js", import.meta.url)
              );
              workerArray.push(innerWorker);
            }

            innerWorker.postMessage([
              imageSliceBitmap,
              width,
              height,
              outerValue,
              innerValues,
              shouldAllocateByRows,
            ]);

            innerWorker.onmessage = (e) => {
              resolve(e.data);
              nextQueue(innerWorker);
            };
            innerWorker.onerror = (err) => {
              reject(err);
              nextQueue(innerWorker);
            };
          });
        });
      }

      function nextQueue(innerWorker = null) {
        if (tasks.length > 0) {
          const [outerValue, outerDimension] = tasks.shift();

          return processInnerSlice(
            outerValue,
            outerDimension,
            innerWorker
          ).then((result) => {
            const [x, y] = shouldAllocateByRows
              ? [0, outerDimension]
              : [outerDimension, 0];

            displayCtx.drawImage(result, x, y);
            resolvedTasks++;
            if (resolvedTasks === outerValues.length) {
              resolve(displayCanvas);
              workerArray.forEach((worker) => worker.terminate());
            }
          });
        }
      }
    });
  }
}
