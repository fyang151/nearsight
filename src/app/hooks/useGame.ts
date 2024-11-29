import { useState, useEffect } from "react";

import championIcons from "../data/championIcons";
import champions from "../data/champions.json";

type ChampionIcons = {
  [key: string]: {
    default: { src: string };
  };
};

export const useGame = () => {
  const [currentChampion, setCurrentChampion] = useState<any>(undefined);
  const [championIcon, setChampionIcon] = useState<any>(undefined);

  const pixelateImage = (image: any) => {
    // just a placeholder for now
    return image;
  };

  const getRandomChampion = () => {
    const championsArray = Object.values(champions.data);
    const randomChampionKey = Math.floor(Math.random() * championsArray.length);
    const currentChampion = championsArray[randomChampionKey];
    const selectedChampionIcon = (championIcons as ChampionIcons)[
      currentChampion.id
    ].default.src;
    const pixelatedChampionIcon = pixelateImage(selectedChampionIcon);

    setChampionIcon(pixelatedChampionIcon);
    setCurrentChampion(currentChampion);
  };

  const newChampion = () => {
    getRandomChampion();
  };

  useEffect(() => {
    getRandomChampion();
  }, []);

  console.log("currentChampion", currentChampion);
  
  return {
    currentChampion,
    championIcon,
    newChampion,
  };
};
