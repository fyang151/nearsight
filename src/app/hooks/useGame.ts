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

interface useGameProps {
  xPixels: number;
  yPixels: number;
}

export const useGame = ({ xPixels, yPixels }: useGameProps) => {
  const [champion, setChampion] = useState<Champion | undefined>(undefined);

  const [championQueue, setChampionQueue] = useState<Champion[]>([]);
  const [isNextQueue, setIsNextQueue] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);

  const pixelateImage = async (image: any) => {
    const input = {
      imgInput: image,
      xPixels: xPixels,
      yPixels: yPixels,
    };

    const pixelatedChampionNew = await Pixyelator.toDataURL(input);
    return pixelatedChampionNew;
  };

  const loadChampion = async () => {
    const championsArray = Object.values(champions.data);
    const randomChampionKey = Math.floor(Math.random() * championsArray.length);

    const currentChampion = championsArray[randomChampionKey];

    const selectedChampionIcon = (championIcons as ChampionIcons)[
      currentChampion.id
    ].default.src;
    const pixelatedChampionIcon = await pixelateImage(selectedChampionIcon);

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
