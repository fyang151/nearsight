import { Pixyelator } from "../commands/pixyelator";

export const getPixelatedImage = async (
  image: string,
  xPixels: number,
  yPixels: number,
  isGrayScale: boolean
) => {
  const pixelatedChampionNew = await Pixyelator.toDataURL({
    imgInput: image,
    xPixels: xPixels,
    yPixels: yPixels,
    isGrayScale: isGrayScale,
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
