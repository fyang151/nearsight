onmessage = (e) => {
  const getSingleRGBA = (rgbaData) => {
    const length = rgbaData.length;
    const valueOccurence = length / 4;

    let i = 0;
    let r = 0,
      g = 0,
      b = 0,
      a = 0;

    while (i < length) {
      [r, g, b, a] = [
        r + rgbaData[i],
        g + rgbaData[i + 1],
        b + rgbaData[i + 2],
        a + rgbaData[i + 3],
      ];
      i += 4;
    }

    r = Math.floor(r / valueOccurence);
    g = Math.floor(g / valueOccurence);
    b = Math.floor(b / valueOccurence);
    a = Math.floor(a / valueOccurence);

    return [r, g, b, a];
  };

  const [
    imageBitmap,
    width,
    height,
    outerValue,
    innerValues,
    shouldAllocateByRows,
  ] = e.data;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  });
  ctx.drawImage(imageBitmap, 0, 0);

  let innerDimension = 0;

  for (const innerValue of innerValues) {
    const [x, y, sectionWidth, sectionHeight] = shouldAllocateByRows
      ? [innerDimension, 0, innerValue, outerValue]
      : [0, innerDimension, outerValue, innerValue];

    const imageData = ctx.getImageData(x, y, sectionWidth, sectionHeight);

    const [r, g, b, a] = getSingleRGBA(imageData.data);

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.fillRect(x, y, sectionWidth, sectionHeight);

    innerDimension += innerValue;
  }

  const resultBitmap = canvas.transferToImageBitmap();
  self.postMessage(resultBitmap, [resultBitmap]);
};
