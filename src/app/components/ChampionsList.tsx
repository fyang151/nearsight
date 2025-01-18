"use client";
import { useState, useEffect, useRef } from "react";
import { useListGame } from "../hooks/useListGame";
import { normalizeString } from "./utils/guess-utils";

const ChampionList = () => {
  const {
    pixelatedChampions,
    initialLoading,
    setCurrentChampionIndex,
    currentChampion,
    handleCorrectGuess,
  } = useListGame({
    xPixels: 4,
    yPixels: 4,
    isGrayScale: false,
  });

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

  return (
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
          <div>SCORE: 10</div>
          <div className="flex flex-row gap-4 items-center relative">
            <img
              src="/arrow-counterclockwise.svg"
              className="w-6 h-6 cursor-pointer"
            />
            <button>
              <img src="/gear.svg" className="w-6 h-6 cursor-pointer" />
            </button>
          </div>
        </div>
        <div className="flex">
          <img
            src={currentChampion?.icon}
            className="w-full h-full"
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
  );
};

export default ChampionList;
