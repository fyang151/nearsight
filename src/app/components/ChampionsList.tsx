"use client";

import { useState, useEffect, useRef } from "react";
import { useListGame } from "../hooks/useListGame";
import { normalizeString } from "./utils/guess-utils";

import Settings from "./Settings";

import championIcons from "../data/championIcons";
import { ChampionIcons } from "../types/champion";

import styles from "./ChampionGuesser.module.css";

interface ChampionListProps {
  xPixelsFromUrl?: number;
  yPixelsFromUrl?: number;
  isGrayScaleFromUrl?: boolean;
  sideBarPositionIndexFromUrl?: number;
}

const ChampionList = ({
  xPixelsFromUrl,
  yPixelsFromUrl,
  isGrayScaleFromUrl,
  sideBarPositionIndexFromUrl,
}: ChampionListProps) => {
  const xPixels = xPixelsFromUrl || 4;
  const yPixels = yPixelsFromUrl || 4;
  const isGrayScale = isGrayScaleFromUrl || false;

  const [adjustedXPixels, setAdjustedXPixels] = useState(xPixels);
  const [adjustedYPixels, setAdjustedYPixels] = useState(yPixels);
  const [bothPixels, setBothPixels] = useState<number>(xPixels);

  const [score, setScore] = useState(0);

  const [adjustedIsGrayScale, setAdjustedIsGrayScale] = useState<boolean>(
    isGrayScaleFromUrl || false
  );

  const [showSettings, setShowSettings] = useState(false);

  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [gameEnd, setGameEnd] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [finalTime, setFinalTime] = useState(0);

  const [sideBarPositionIndex, setSideBarPositionIndex] = useState<number>(
    Number(sideBarPositionIndexFromUrl) || 2
  );

  const {
    pixelatedChampions,
    initialLoading,
    currentChampionIndex,
    setCurrentChampionIndex,
    currentChampion,
    championsLength,
    handleCorrectGuess,
  } = useListGame({
    xPixels: xPixels,
    yPixels: yPixels,
    isGrayScale: isGrayScale,
  });

  const [gridColumns, setGridColumns] = useState<number | null>(null);

  const gridRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const updateGridColumns = () => {
      if (gridRef.current) {
        const gridStyle = window.getComputedStyle(gridRef.current);
        const newGridColumns = gridStyle.gridTemplateColumns.split(" ").length;
        setGridColumns(newGridColumns);
      }
    };

    updateGridColumns();

    window.addEventListener("resize", updateGridColumns);
    return () => {
      window.removeEventListener("resize", updateGridColumns);
    };
  }, [pixelatedChampions]);

  const leftChampion = () => {
    if (currentChampionIndex > 0) {
      setCurrentChampionIndex((prev) => prev - 1);
    }
  };

  const downChampion = () => {
    if (
      gridColumns &&
      currentChampionIndex + gridColumns < pixelatedChampions.length
    ) {
      setCurrentChampionIndex((prev) => prev + gridColumns);
    }
  };

  const upChampion = () => {
    if (gridColumns && currentChampionIndex - gridColumns >= 0) {
      setCurrentChampionIndex((prev) => prev - gridColumns);
    }
  };

  const rightChampion = () => {
    if (currentChampionIndex + 1 < pixelatedChampions.length) {
      setCurrentChampionIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const navigateChampion = (event: KeyboardEvent) => {
      if (gridColumns) {
        if (event.key === "ArrowLeft") {
          leftChampion();
        }
        if (event.key === "ArrowDown") {
          downChampion();
        }
        if (event.key === "ArrowUp") {
          upChampion();
        }
        if (event.key === "ArrowRight") {
          rightChampion();
        }
      }
    };
    window.addEventListener("keydown", navigateChampion);
    return () => {
      window.removeEventListener("keydown", navigateChampion);
    };
  }, [gridColumns, currentChampionIndex, pixelatedChampions]);

  const selectedChampionRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (selectedChampionRef.current) {
      selectedChampionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentChampionIndex]);

  useEffect(() => {
    if (timerStarted) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 10);
    }
  }, [timerStarted]);

  const [sad, becomeSad] = useState<boolean>(false);

  const [guessInputValue, setGuessInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGuess = (guessValue: string) => {
    setTimerStarted(true);
    setGuessInputValue(guessValue);
    if (
      currentChampion &&
      (normalizeString(guessValue) ===
        normalizeString(currentChampion.info.name) ||
        normalizeString(guessValue) ===
          normalizeString(currentChampion.info.id))
    ) {
      setGuessInputValue("");
      handleCorrectGuess();
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        if (newScore === championsLength) {
          setFinalTime(time);
          setGameEnd(true);
        }
        return newScore;
      });
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (
      adjustedXPixels !== xPixels ||
      adjustedYPixels !== yPixels ||
      adjustedIsGrayScale !== isGrayScale
    ) {
      resetChamps();
    }
  };

  const resetChamps = () => {
    const searchParams = new URLSearchParams();
    searchParams.set("xPixels", adjustedXPixels.toString());
    searchParams.set("yPixels", adjustedYPixels.toString());
    searchParams.set("isGrayScale", Number(adjustedIsGrayScale).toString());
    searchParams.set("sideBarPosition", String(sideBarPositionIndex));
    window.location.href = "/list?" + searchParams.toString();
  };

  const handleGiveUp = () => {
    becomeSad(true);
  };

  if (gameEnd) {
    return (
      <div className="w-full h-[80vh] flex flex-col justify-center items-center gap-10 text-3xl">
        Congratulations! You just guessed all {championsLength} champions in{" "}
        {finalTime / 100} seconds.
        <div className="flex flex-row gap-4 items-center">
          Play again?
          <img
            src="/arrow-counterclockwise.svg"
            className="w-10 h-10 cursor-pointer"
            onClick={() => resetChamps()}
          />
        </div>
        <div className="flex flex-col gap-2 text-lg">
          <div>
            Resolution: {xPixels}x{yPixels}
          </div>
          <div>Gray Scale: {isGrayScale ? "Yes" : "No"}</div>
        </div>
      </div>
    );
  }

  const ChampionListView = () => {
    return (
      <div className="flex-[7] h-full">
        {initialLoading || pixelatedChampions.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <span className={styles.loader} />
          </div>
        ) : (
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1 w-full"
            ref={gridRef}
          >
            {pixelatedChampions.map((pixelatedChampion, index) => {
              return (
                <li
                  key={pixelatedChampion.info.id}
                  onClick={() => setCurrentChampionIndex(index)}
                  className={`cursor-pointer ${
                    currentChampion?.info.id === pixelatedChampion.info.id
                      ? "border-2 border-white"
                      : ""
                  }`}
                  ref={
                    currentChampionIndex === index ? selectedChampionRef : null
                  }
                >
                  <img
                    src={pixelatedChampion.icon}
                    className="w-full h-full"
                    style={{ imageRendering: "pixelated" }}
                    draggable="false"
                    onMouseEnter={(e) => {
                      if (sad) {
                        e.currentTarget.src = (championIcons as ChampionIcons)[
                          pixelatedChampion.info.id
                        ].default.src;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.src = pixelatedChampion.icon;
                    }}
                    alt={pixelatedChampion.info.name}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  const SideBar = () => {
    return !sad ? (
      <>
        <div className="flex flex-row justify-between w-full p-2 font-light text-2xl">
          <div>
            {score} / {pixelatedChampions.length + score}
          </div>
          <div className="flex flex-row gap-4 items-center relative">
            <img
              src="/flag.svg"
              className="w-6 h-6 cursor-pointer"
              onClick={handleGiveUp}
            />
            <img
              src="/arrow-counterclockwise.svg"
              className="w-6 h-6 cursor-pointer"
              onClick={resetChamps}
            />
            <img
              src="/gear.svg"
              className="w-6 h-6 cursor-pointer"
              onClick={toggleSettings}
            />
          </div>
        </div>
        <div className="flex">
          {sideBarPositionIndex === 0 || sideBarPositionIndex === 2 ? (
            <img
              src={currentChampion?.icon}
              className="w-[calc(min(100%,100vh-300px))] h-full"
              style={{ imageRendering: "pixelated" }}
              draggable="false"
            />
          ) : null}
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="text-lg">{time / 100}</div>
        </div>
        <form>
          <input
            type="text"
            value={guessInputValue}
            onChange={(event) => handleGuess(event.target.value)}
            className="text-5xl focus:outline-none w-full"
            ref={inputRef}
          />
        </form>
      </>
    ) : (
      <div className="flex flex-col gap-8">
        <div className="text-6xl">You gave up!</div>
        <div className="text-2xl">
          Hover over any champion to see the unblurred image.
        </div>
        <div className="flex w-full justify-center">
          <img
            src="/arrow-counterclockwise.svg"
            className="w-10 h-10 cursor-pointer"
            onClick={resetChamps}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full gap-4 w-[85vw] min-h-screen">
      <ChampionListView />
      <div className="flex-[3] h-full">
        <SideBar />
      </div>
    </div>
  );
};

export default ChampionList;
