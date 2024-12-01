import { useRef, useState, useEffect } from "react";

import championIcons from "../data/championIcons";
import champions from "../data/champions.json";

type ChampionIcons = {
  [key: string]: {
    default: { src: string };
  };
};

export const useGame = () => {
  const allChampions = Object.values(champions.data);

  const currentChampions = useRef<any>([]);

  const championDataRef = useRef<any>({
     championInfo: undefined,
    championIcon: undefined,
  });

  const pixelateImage = (image: any) => {
    // just a placeholder for now
    return image;
  };

  const getRandomChampion = () => {
    const randomChampionKey = Math.floor(Math.random() * allChampions.length);

    const newChampionInfo = allChampions[randomChampionKey];
    const newChampionIcon = (championIcons as ChampionIcons)[newChampionInfo.id]
      .default.src;
    const pixelatedChampionIcon = pixelateImage(newChampionIcon);

    var newChampionData = {
      championInfo: newChampionInfo,
      championIcon: pixelatedChampionIcon,
    };

    return newChampionData;
  };

  const getCurrentChampions = () => {
    for (let i = 0; i < 3; i++) {
      currentChampions.current.push(getRandomChampion());
    }
  };

  const newChampion = () => {
    if (currentChampions.current.length === 0) {
      getCurrentChampions();
    }
    championDataRef.current = currentChampions.current.shift();
  };

  console.log("currentChampions", currentChampions.current);

  useEffect(() => {
    newChampion();
  }, []);

  return {
    championData: championDataRef.current,
    newChampion,
  };
};
