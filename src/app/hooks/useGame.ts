import { useState, useEffect } from "react";

import championIcons from "../data/championIcons";
import champions from "../data/champions.json";

import { Pixyelator } from "../commands/pixyelator";

type ChampionIcons = {
  [key: string]: {
    default: { src: string };
  };
};

type Champion = {
  info: any;
  icon: string;
};

export const useGame = () => {
  const [champion, setChampion] = useState<Champion | undefined>(undefined);

  const [championQueue, setChampionQueue] = useState<Champion[]>([]);
  const [isNextQueue, setIsNextQueue] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);

  const pixelateImage = async (
    image: any,
    xPixels: number,
    yPixels: number
  ) => {
    // just a placeholder for now
    const pixelatedChampionNew = await Pixyelator.toDataURL(
      image,
      xPixels,
      yPixels
    );
    return pixelatedChampionNew;
  };

  const loadChampion = async () => {
    const championsArray = Object.values(champions.data);
    const randomChampionKey = Math.floor(Math.random() * championsArray.length);

    const currentChampion = championsArray[randomChampionKey];

    const selectedChampionIcon = (championIcons as ChampionIcons)[
      currentChampion.id
    ].default.src;
    const pixelatedChampionIcon = await pixelateImage(
      selectedChampionIcon,
      3,
      3
    );

    const newChampion = {
      info: currentChampion,
      icon: pixelatedChampionIcon,
    };

    setChampionQueue((prev) => [...prev, newChampion]);
  };

  useEffect(() => {
    if (championQueue.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [championQueue]);

  const preloadChampions = async () => {
    for (let i = 0; i < 5; i++) {
      await loadChampion();
    }
  };

  useEffect(() => {
    preloadChampions();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (isNextQueue && championQueue.length > 0) {
        const nextChampion = championQueue.shift();

        setChampionQueue([...championQueue]);
        setChampion(nextChampion);

        loadChampion();
        setIsNextQueue(false);
      }
    }
  }, [loading, isNextQueue, championQueue]);

  const newChampion = () => {
    setIsNextQueue(true);
  };

  const resetChamps = () => {
    setChampionQueue([]);
    preloadChampions();
    setIsNextQueue(true);
  };

  return {
    champion,
    newChampion,
    loading,
    resetChamps,
  };
};
