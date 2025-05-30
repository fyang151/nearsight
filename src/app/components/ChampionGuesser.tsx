"use client";

import { useState, useEffect, useRef } from "react";
import { useRandomGame } from "../hooks/useRandomGame";
import { normalizeString } from "./utils/guess-utils";

import Settings from "./Settings";

import styles from "./Loader.module.css";

const ChampionGuesser = () => {
  const [guess, setGuess] = useState("");

  const [xPixels, setXPixels] = useState(4);
  const [yPixels, setYPixels] = useState(4);
  const [bothPixels, setBothPixels] = useState<number>(4);

  const [isGrayScale, setIsGrayScale] = useState<boolean>(false);

  const [score, setScore] = useState(0);

  const [showSettings, setShowSettings] = useState(false);

  const { champion, newChampion, loading, resetChamps } = useRandomGame({
    xPixels,
    yPixels,
    isGrayScale,
  });

  const [shouldSubmitWithSpace, setShouldSubmitWithSpace] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (shouldSubmitWithSpace) {
      handleCheckGuess();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === " " && shouldSubmitWithSpace) {
      handleCheckGuess();
    }
  };

  useEffect(() => {
    if (!shouldSubmitWithSpace) {
      handleCheckGuess();
    }
  }, [guess, shouldSubmitWithSpace]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCheckGuess = () => {
    if (
      !loading &&
      champion &&
      (normalizeString(champion.info.name) === normalizeString(guess) ||
        normalizeString(champion.info.id) === normalizeString(guess))
    ) {
      setScore((prevScore) => prevScore + 1);
      setGuess("");
      newChampion();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleClick = () => {
      if (!showSettings) {
        inputRef.current?.focus();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showSettings]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showSettings) {
        toggleSettings();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSettings]);

  const reset = () => {
    setScore(0);
    resetChamps();
  };

  const toggleSettings = () => {
    setShowSettings((prev) => {
      const newValue = !prev;
      if (!newValue) {
        inputRef.current?.focus();
        reset();
      }
      return newValue;
    });
  };

  return (
    <>
      {/* desktop view */}
      <div className="hidden sm:flex justify-center">
        <div className="flex justify-center items-center gap-4 w-[90vw] h-[calc(95vh-52px)]">
          <div className="w-[calc(min(90vw-350px,95vh-52px))] h-[calc(min(90vw-350px,95vh-52px))]">
            {loading ? (
              <div className="aspect-square flex items-center justify-center h-full">
                <span className={styles.loader} />
              </div>
            ) : (
              <img
                src={champion?.icon}
                className="w-full h-full rounded-2xl"
                style={{ imageRendering: "pixelated" }}
                draggable="false"
              />
            )}
          </div>
          <div className="w-[350px] h-full">
            <div className="flex flex-row justify-between w-full p-2 font-light text-2xl">
              <div>SCORE: {score}</div>
              <div className="flex flex-row gap-4 items-center relative">
                <img
                  src="/arrow-counterclockwise.svg"
                  onClick={reset}
                  className="cursor-pointer"
                />
                <button>
                  <img
                    src="/gear.svg"
                    onClick={toggleSettings}
                    className="cursor-pointer"
                  />
                </button>
              </div>
            </div>
            <div className="italic text-7xl">Who is this champion?</div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={guess || ""}
                onChange={(event) => setGuess(event.target.value)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                className="mt-8 text-5xl focus:outline-none w-full"
              />
            </form>
          </div>
        </div>
      </div>
      {/* mobile view */}
      <div className="flex flex-col sm:hidden justify-center">
        <div className="flex flex-col justify-between items-center h-[calc(100vh-226px)]">
          <span />
          <div className="w-[calc(min(100vw,100vh-226px-56px-40px))] h-[calc(min(100vw,100vh-226px-56px-40px))] flex">
            {loading ? (
              <div className="aspect-square flex items-center justify-center">
                <span className={styles.loader} />
              </div>
            ) : (
              <img
                src={champion?.icon}
                className="w-full h-full rounded-2xl"
                style={{ imageRendering: "pixelated" }}
                draggable="false"
              />
            )}
          </div>
          <div className="flex w-[60vw] h-[60px] justify-around items-center">
            <div>SCORE: {score}</div>
            <img
              src="/arrow-counterclockwise.svg"
              onClick={reset}
              className="w-6 h-6 cursor-pointer"
            />
            <button>
              <img
                src="/gear.svg"
                onClick={toggleSettings}
                className="w-6 h-6 cursor-pointer"
              />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Who is this champion...."
              value={guess || ""}
              onChange={(event) => setGuess(event.target.value)}
              onKeyDown={handleKeyDown}
              className="text-4xl p-2 focus:outline-none w-full text-center"
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
              xPixels={xPixels}
              yPixels={yPixels}
              setXPixels={setXPixels}
              setYPixels={setYPixels}
              isGrayScale={isGrayScale}
              setIsGrayScale={setIsGrayScale}
              toggleSettings={toggleSettings}
              bothPixels={bothPixels}
              setBothPixels={setBothPixels}
              shouldSubmitWithSpace={shouldSubmitWithSpace}
              setShouldSubmitWithSpace={setShouldSubmitWithSpace}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChampionGuesser;
