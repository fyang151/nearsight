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
    console.log("championQueue", championQueue);
    if (championQueue.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [championQueue]);

  useEffect(() => {
    const preloadChampions = async () => {
      for (let i = 0; i < 5; i++) {
        await loadChampion();
      }
    };
    preloadChampions();
  }, []);

  useEffect(() => {
    console.log("loading", loading);

    if (!loading) {
      if (isNextQueue) {
        const nextChampion = championQueue.shift();

        setChampionQueue([...championQueue]);
        setChampion(nextChampion);

        loadChampion();
        setIsNextQueue(false);
      }
    } else {
      console.log("we are loading up in thsi bitch you cant do that");
    }
  }, [loading, isNextQueue]);

  const newChampion = () => {
    setIsNextQueue(true);
  };

  return {
    champion,
    newChampion,
    loading,
  };
};
