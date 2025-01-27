import { Pixyelator } from "../commands/pixyelator";

export const getPixelatedImage = async (
  image: string,
  xPixels: number,
  yPixels: number,
  isGrayScale: boolean,
  maxWorkers: number
) => {
  const pixelatedChampionNew = await Pixyelator.toDataURL({
    imgInput: image,
    xPixels: xPixels,
    yPixels: yPixels,
    isGrayScale: isGrayScale,
    maxWorkers: maxWorkers,
  });
  return pixelatedChampionNew;
};

export const pixelateToCanvas = async (
  image: string,
  xPixels: number,
  yPixels: number,
  isGrayScale: boolean
) => {
  await Pixyelator.convert({
    imgInput: image,
    xPixels: xPixels,
    yPixels: yPixels,
    customCanvasId: "demo",
    isGrayScale: isGrayScale,
  });
};
