import { Pixyelator } from "pixyelator";

export const getPixelatedImage = async ({
  image,
  xPixels,
  yPixels,
  isGrayScale,
  maxWorkers,
}: {
  image: string;
  xPixels: number;
  yPixels: number;
  isGrayScale: boolean;
  maxWorkers?: number;
}) => {
  const pixyelator = await Pixyelator.fromImage(image, { maxWorkers });
  const pixelatedChampionNew = pixyelator.pixelate(xPixels, yPixels, {
    grayscale: isGrayScale,
  });
  return await pixelatedChampionNew.toDataURL();
};

export const pixelateToCanvas = async ({
  image,
  xPixels,
  yPixels,
  isGrayScale,
  maxWorkers,
  targetCanvas,
}: {
  image: string;
  xPixels: number;
  yPixels: number;
  isGrayScale: boolean;
  maxWorkers?: number;
  targetCanvas?: HTMLCanvasElement;
}) => {
  const pixyelator = await Pixyelator.fromImage(image, {
    maxWorkers,
    targetCanvas,
  });
  const pixelatedChampionNew = pixyelator.pixelate(xPixels, yPixels, {
    grayscale: isGrayScale,
  });
  return await pixelatedChampionNew.toCanvas();
};
