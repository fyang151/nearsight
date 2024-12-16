"use client";

import { useState, useEffect, useRef } from "react";
import { useGame } from "../hooks/useGame";

import Settings from "./Settings";

const ChampionGuesser = () => {
  const [guess, setGuess] = useState("");

  const [xPixels, setXPixels] = useState(3);
  const [yPixels, setYPixels] = useState(3);

  const [score, setScore] = useState(0);

  const [showSettings, setShowSettings] = useState(false);

  const { champion, newChampion, loading, resetChamps } = useGame({
    xPixels,
    yPixels,
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  const normalizeString = (str: string) => {
    return str.replace(/[^a-z0-9\s]/gi, "").toLowerCase();
  };

  useEffect(() => {
    if (
      !loading &&
      champion &&
      normalizeString(champion.info.name) === guess.toLowerCase()
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
    <div className="flex flex-row w-[80vw] gap-4">
      {/* <div className="h-[calc(100vh-56px)]"> */}
      <div className="h-[90vh]">
        {loading ? (
          <div className="h-full max-w-[75vw] rounded-2xl">Loading</div>
        ) : (
          <img
            src={champion?.icon}
            className="object-contain h-full max-w-[75vw] rounded-2xl"
            style={{ imageRendering: "pixelated" }}
            draggable="false"
          />
        )}
      </div>
      <div className="w-full">
        <div className="flex flex-row justify-between w-full p-2 font-light text-2xl">
          <div>SCORE: {score}</div>
          <div className="flex flex-row gap-4 items-center relative">
            <img
              src="/arrow-counterclockwise.svg"
              onClick={reset}
              className="w-6 h-6 cursor-pointer"
            />
            <button popoverTarget="settings">
              <img
                src="/gear.svg"
                onClick={toggleSettings}
                className="w-6 h-6 cursor-pointer"
              />
            </button>
          </div>
        </div>
        <div className="italic text-6xl">Who is this champion?</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={guess || ""}
            onChange={(event) => setGuess(event.target.value)}
            ref={inputRef}
            className="mt-8 text-5xl focus:outline-none w-full"
          />
        </form>
        {showSettings && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-1"
            onClick={toggleSettings}
          ></div>
        )}
        {/* Learn how to center a div, or you might write code that looks like this too. */}
        <div
          popover="auto"
          id="settings"
          className="rounded-md w-[120vh] h-[80vh]"
        >
          <Settings
            xPixels={xPixels}
            yPixels={yPixels}
            setXPixels={setXPixels}
            setYPixels={setYPixels}
          />
        </div>
      </div>
    </div>
  );
};

export default ChampionGuesser;
