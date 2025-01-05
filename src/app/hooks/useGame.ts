const CHAMPION_PRELOAD_COUNT = 40;
const EXCLUDED_RECENT_CHAMPIONS = 40;

import { useState, useEffect } from "react";

import championIcons from "../data/championIcons";
import champions from "../data/champions.json";

import { Pixyelator } from "../commands/pixyelator";

type ChampionInfo = any;

type ChampionIcons = {
  [key: string]: {
    default: { src: string };
  };
};

type Champion = {
  info: ChampionInfo;
  icon: string;
};

interface useGameProps {
  xPixels: number;
  yPixels: number;
  isGrayScale: boolean;
}

export const useGame = ({ xPixels, yPixels, isGrayScale }: useGameProps) => {
  const [champion, setChampion] = useState<Champion | undefined>(undefined);

  const [championQueue, setChampionQueue] = useState<Champion[]>([]);
  const [isNextQueue, setIsNextQueue] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);

  const championsArray = Object.values(champions.data);

  const pixelateImage = async (image: any) => {
    const input = {
      imgInput: image,
      xPixels: xPixels,
      yPixels: yPixels,
      isGrayScale: isGrayScale,
    };

    const pixelatedChampionNew = await Pixyelator.toDataURL(input);
    return pixelatedChampionNew;
  };

  const getNewChampionInfo = () => {
    const randomChampionKey = Math.floor(Math.random() * championsArray.length);
    const newChampion = championsArray[randomChampionKey];

    return newChampion;
  };

  const newChampionRecentlyLoaded = (newChampionInfo: ChampionInfo) => {
    const newChampionId = newChampionInfo.id;
    for (
      let i = 0;
      i < Math.min(EXCLUDED_RECENT_CHAMPIONS, CHAMPION_PRELOAD_COUNT);
      i++
    ) {
      const champion = championQueue[i];
      if (champion) {
        if (champion.info.id === newChampionId) {
          return true;
        }
      }
    }
    return false;
  };

  const loadNewChampionIcon = async (newChampionInfo: ChampionInfo) => {
    const selectedChampionIcon = (championIcons as ChampionIcons)[
      newChampionInfo.id
    ].default.src;
    const pixelatedChampionIcon = await pixelateImage(selectedChampionIcon);

    const newChampion = {
      info: newChampionInfo,
      icon: pixelatedChampionIcon,
    };

    return newChampion;
  };

  const loadChampion = async () => {
    let newChampionInfo = getNewChampionInfo();
    while (newChampionRecentlyLoaded(newChampionInfo)) {
      newChampionInfo = getNewChampionInfo();
    }
    const newChampion = await loadNewChampionIcon(newChampionInfo);

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
    for (let i = 0; i < CHAMPION_PRELOAD_COUNT; i++) {
      await loadChampion();
    }
  };

  useEffect(() => {
    preloadChampions();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (isNextQueue && championQueue.length > 0) {
        loadChampion();

        const nextChampion = championQueue.shift();

        setChampionQueue([...championQueue]);
        setChampion(nextChampion);

        setIsNextQueue(false);
      }
    }
  }, [loading, isNextQueue, championQueue]);

  useEffect(() => {
    console.log(
      "championQueue",
      championQueue.map((champion) => champion.info.id)
    );
  }, [championQueue]);

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
