"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useListGame } from "../hooks/useListGame";
import { normalizeString } from "./utils/guess-utils";

import Settings from "./Settings";

interface ChampionListProps {
  xPixelsFromUrl?: number;
  yPixelsFromUrl?: number;
  isGrayScaleFromUrl?: boolean;
}

const ChampionList = ({
  xPixelsFromUrl,
  yPixelsFromUrl,
  isGrayScaleFromUrl,
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

  const {
    pixelatedChampions,
    initialLoading,
    setCurrentChampionIndex,
    currentChampion,
    handleCorrectGuess,
  } = useListGame({
    xPixels: xPixels,
    yPixels: yPixels,
    isGrayScale: isGrayScale,
  });

  const champsLength = useMemo(() => {
    return pixelatedChampions.length;
  }, [pixelatedChampions]);

  const [guessInputValue, setGuessInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGuess = (guessValue: string) => {
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
      setScore((prevScore) => prevScore + 1);
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
    window.location.href = "/list?" + searchParams.toString();
  };

  return (
    <>
      <div className="flex h-full gap-4 w-[85vw] mt-4">
        <div className="w-[70%]">
          {initialLoading ? (
            <div>loading...</div>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-1 w-full">
              {pixelatedChampions.map((pixelatedChampion, index) => {
                return (
                  <li
                    key={pixelatedChampion.info.id}
                    onClick={() => setCurrentChampionIndex(index)}
                    className="cursor-pointer"
                  >
                    <img
                      src={pixelatedChampion.icon}
                      className="w-full h-full"
                      style={{ imageRendering: "pixelated" }}
                      draggable="false"
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="w-[200px] md:w-[calc(max(30%,350px))] h-full sticky top-0">
          {/* <div className="italic text-4xl md:text-6xl m-4">
          Who is this champion?
        </div> */}
          <div className="flex flex-row justify-between w-full p-2 font-light text-2xl">
            <div>
              {score} / {champsLength}
            </div>
            <div className="flex flex-row gap-4 items-center relative">
              <img
                src="/arrow-counterclockwise.svg"
                className="w-6 h-6 cursor-pointer"
                onClick={() => resetChamps()}
              />
              <button>
                <img
                  src="/gear.svg"
                  className="w-6 h-6 cursor-pointer"
                  onClick={toggleSettings}
                />
              </button>
            </div>
          </div>
          <div className="flex">
            <img
              src={currentChampion?.icon}
              className="w-full h-full"
              style={{ imageRendering: "pixelated" }}
              draggable="false"
            />
          </div>
          <form>
            <input
              type="text"
              value={guessInputValue}
              onChange={(event) => handleGuess(event.target.value)}
              className="mt-8 text-5xl focus:outline-none w-full"
              ref={inputRef}
            />
          </form>
        </div>
      </div>
      {showSettings && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center"
          onClick={toggleSettings}
        >
          <div
            id="settings"
            className="rounded-md w-[120vh] h-[80vh] bg-white p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Settings
              xPixels={adjustedXPixels}
              yPixels={adjustedYPixels}
              setXPixels={setAdjustedXPixels}
              setYPixels={setAdjustedYPixels}
              bothPixels={bothPixels}
              setBothPixels={setBothPixels}
              isGrayScale={adjustedIsGrayScale}
              setIsGrayScale={setAdjustedIsGrayScale}
              toggleSettings={toggleSettings}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChampionList;
