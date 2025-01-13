// TODO: refactor to avoid repeat logic in game hooks

import { useState, useEffect } from "react";

import championIcons from "../data/championIcons";
import champions from "../data/champions.json";

import { getPixelatedImage } from "../utils/pixelateImage";
import { useGameProps } from "../types/champion";

export const useListGame = ({
  xPixels,
  yPixels,
  isGrayScale,
}: useGameProps) => {
  const [pixelatedChampions, setPixelatedChampions] = useState<string[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const iconItemList = Object.values(championIcons);

    const addPixelatedChampion = (icon: string) => {
      return getPixelatedImage(icon, xPixels, yPixels, isGrayScale);
    };

    Promise.all(
      iconItemList.map((iconItem) => addPixelatedChampion(iconItem.default.src))
    ).then((pixelatedImages) => {
      setPixelatedChampions(pixelatedImages);
      setLoading(false);
    });
  });

  return { pixelatedChampions, loading };
};

const shuffle = <T>(arr: T[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
