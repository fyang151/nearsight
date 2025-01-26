// TODO: refactor to avoid repeat logic in game hooks

import { useState, useEffect } from "react";

import championIcons from "../data/championIcons";
import champions from "../data/champions.json";
// import champions from "../data/testChampions.json";

import { getPixelatedImage } from "../utils/pixelateImage";
import {
  useGameProps,
  ChampionIcons,
  ChampionInfo,
  Champion,
} from "../types/champion";

export const useListGame = ({
  xPixels,
  yPixels,
  isGrayScale,
}: useGameProps) => {
  const [pixelatedChampions, setPixelatedChampions] = useState<Champion[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const championsData = Object.values(champions.data);

  useEffect(() => {
    const championsArray = shuffle(championsData);

    const addPixelatedChampion = async (icon: string, info: ChampionInfo) => {
      const pixelatedImage = await getPixelatedImage(
        icon,
        xPixels,
        yPixels,
        isGrayScale
      );
      const pixelatedChampion = {
        info: info,
        icon: pixelatedImage,
      };
      setPixelatedChampions((prev) => [...prev, pixelatedChampion]);
    };
    championsArray.map((champion) =>
      addPixelatedChampion(
        (championIcons as ChampionIcons)[champion.id].default.src,
        champion
      )
    );
  }, []);

  useEffect(() => {
    if (pixelatedChampions.length >= 0) {
      setInitialLoading(false);
    } else {
      setInitialLoading(true);
    }
  }, [pixelatedChampions]);

  // handle getting the champion down here
  const [currentChampionIndex, setCurrentChampionIndex] = useState<number>(0);

  const [currentChampion, setCurrentChampion] = useState<Champion>();

  const handleCorrectGuess = () => {
    if (currentChampionIndex === pixelatedChampions.length - 1) {
      setCurrentChampionIndex((prev) => prev - 1);
    }
    setPixelatedChampions((prev) =>
      prev.filter((_, index) => index !== currentChampionIndex)
    );
  };

  useEffect(() => {
    setCurrentChampion(pixelatedChampions[currentChampionIndex]);
  }, [currentChampionIndex, pixelatedChampions]);

  return {
    pixelatedChampions,
    initialLoading,
    setCurrentChampionIndex,
    currentChampion,
    handleCorrectGuess,
  };
};

const shuffle = <T>(arr: T[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
