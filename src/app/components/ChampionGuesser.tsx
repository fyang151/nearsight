"use client";

import { useState, useEffect, useRef } from "react";
import { useGame } from "../hooks/useGame";

import Settings from "./Settings";

import styles from "./ChampionGuesser.module.css";

const ChampionGuesser = () => {
  const [guess, setGuess] = useState("");

  const [xPixels, setXPixels] = useState(4);
  const [yPixels, setYPixels] = useState(4);
  const [bothPixels, setBothPixels] = useState<number>(4);

  const [isGrayScale, setIsGrayScale] = useState<boolean>(false);

  const [score, setScore] = useState(0);

  const [showSettings, setShowSettings] = useState(false);

  const { champion, newChampion, loading, resetChamps } = useGame({
    xPixels,
    yPixels,
    isGrayScale,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const normalizeString = (str: string) => {
    return str.replace(/[^a-z0-9]/gi, "").toLowerCase();
  };

  useEffect(() => {
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
  }, [guess]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (!showSettings) {
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleFocus);
    return () => {
      document.removeEventListener("click", handleFocus);
    };
  }, [showSettings]);

  useEffect(() => {
    handleFocus();
  }, []);

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
    <div className="flex justify-center items-center gap-4 w-[90vw] h-[calc(95vh-52px)]">
      <div className="w-[calc(min(90vw-350px,95vh-52px))] h-[calc(min(90vw-350px,95vh-52px))]">
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
      <div className="w-[350px] h-full">
        <div className="flex flex-row justify-between w-full p-2 font-light text-2xl">
          <div>SCORE: {score}</div>
          <div className="flex flex-row gap-4 items-center relative">
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
        </div>
        <div className="italic text-7xl">Who is this champion?</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={guess || ""}
            onChange={(event) => setGuess(event.target.value)}
            ref={inputRef}
            className="mt-8 text-5xl focus:outline-none w-full"
          />
        </form>
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
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChampionGuesser;
