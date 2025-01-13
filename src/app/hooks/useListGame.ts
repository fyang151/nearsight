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
  const [pixelatedChampions, setPixelatedChampions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const iconItemList = shuffle(Object.values(championIcons));

    const addPixelatedChampion = async (icon: string) => {
      const pixelatedImage = await getPixelatedImage(
        icon,
        xPixels,
        yPixels,
        isGrayScale
      );
      setPixelatedChampions((prev) => [...prev, pixelatedImage]);
      if (loading) {
        setLoading(false);
      }
    };

    iconItemList.map((iconItem) => addPixelatedChampion(iconItem.default.src));
  }, []);

  useEffect(() => {
    if (pixelatedChampions.length >= 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [pixelatedChampions]);

  return { pixelatedChampions, loading };
};

const shuffle = <T>(arr: T[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
