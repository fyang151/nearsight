// these "constants" arent really constants, because we will need to do some processing on them below
let CHAMPION_PRELOAD_COUNT = 5;
let EXCLUDED_PREV_CHAMPION_COUNT = 3;

import { useState, useEffect } from "react";

import championIcons from "../data/championIcons";
import champions from "../data/champions.json";

import { getPixelatedImage } from "../utils/pixelateImage";
import { useGameProps, Champion, ChampionIcons } from "../types/champion";

CHAMPION_PRELOAD_COUNT = Math.min(
  Object.keys(champions).length,
  CHAMPION_PRELOAD_COUNT
);

EXCLUDED_PREV_CHAMPION_COUNT = Math.min(
  CHAMPION_PRELOAD_COUNT,
  EXCLUDED_PREV_CHAMPION_COUNT
);

console.info("CHAMPION_PRELOAD_COUNT: ", CHAMPION_PRELOAD_COUNT);
console.info("EXCLUDED_PREV_CHAMPION_COUNT: ", EXCLUDED_PREV_CHAMPION_COUNT);

const championsArray = Object.values(champions.data);

export const useRandomGame = ({
  xPixels,
  yPixels,
  isGrayScale,
}: useGameProps) => {
  const [champion, setChampion] = useState<Champion | undefined>(undefined);
  const [seenChampionIds, setSeenChampionIds] = useState<string[]>([]);

  const [championQueue, setChampionQueue] = useState<Champion[]>([]);
  const [isNextQueue, setIsNextQueue] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);

  const fetchIconById = (id: string) => {
    const championIcon = (championIcons as ChampionIcons)[id].default.src;
    return championIcon;
  };

  const loadChampion = async () => {
    const randomChampionKey = Math.floor(Math.random() * championsArray.length);

    const currentChampion = championsArray[randomChampionKey];

    const selectedChampionIcon = await fetchIconById(currentChampion.id);

    const pixelatedChampionIcon = await getPixelatedImage(
      selectedChampionIcon,
      xPixels,
      yPixels,
      isGrayScale
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
        const nextChampion = championQueue.shift();

        // sanity check
        if (nextChampion) {
          if (seenChampionIds.includes(nextChampion.info.id)) {
            loadChampion();
          } else {
            setChampionQueue([...championQueue]);
            setChampion(nextChampion);

            loadChampion();
            setIsNextQueue(false);

            if (seenChampionIds.length > EXCLUDED_PREV_CHAMPION_COUNT - 1) {
              setSeenChampionIds((prev) => [
                ...prev.slice(1),
                nextChampion.info.id,
              ]);
            } else {
              setSeenChampionIds((prev) => [...prev, nextChampion.info.id]);
            }
          }
        } else {
          loadChampion();
        }
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
    fetchIconById,
  };
};
