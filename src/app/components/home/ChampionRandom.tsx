"use client";

import { useState, useEffect, useRef } from "react";
import { useRandomGame } from "../../hooks/useRandomGame";
import { normalizeString } from "../utils/guess-utils";

import HomeSettings from "./HomeSettings";

import styles from "../Loader.module.css";

const Instructions = () => {
  return (
    <div>
      <p>
        New champions are automatically generated when you type the correct name
        or ID!
      </p>
    </div>
  );
};

const ChampionGuesser = () => {
  const [guess, setGuess] = useState("");

  const [xPixels, setXPixels] = useState(5);
  const [yPixels, setYPixels] = useState(5);
  const [bothPixels, setBothPixels] = useState<number>(5);

  const [isGrayScale, setIsGrayScale] = useState<boolean>(false);

  const [shouldSubmitWithSpace, setShouldSubmitWithSpace] = useState(false);

  const [showFullIcon, setShowFullIcon] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { champion, newChampion, loading, resetChamps, fetchIconById } =
    useRandomGame({
      xPixels,
      yPixels,
      isGrayScale,
    });

  useEffect(() => {
    setShowFullIcon(false);
    resetChamps();
  }, [xPixels, yPixels, isGrayScale]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleGlobalKeyDown = () => {
      const activeElement = document.activeElement;

      if (activeElement?.getAttribute("type") !== "text" && inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

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

  const handleCheckGuess = () => {
    if (
      !loading &&
      champion &&
      (normalizeString(champion.info.name) === normalizeString(guess) ||
        normalizeString(champion.info.id) === normalizeString(guess))
    ) {
      handleNewChampion();
    }
  };

  const handleNewChampion = () => {
    setGuess("");
    setShowFullIcon(false);
    newChampion();
  };

  return (
    <>
      {/* desktop view */}
      <div className="hidden sm:flex sm:flex-col sm:items-center">
        <div className="flex justify-center items-center gap-4 w-full h-[calc(95vh-52px)] overflow-hidden">
          <div className="w-[calc(min(90vw-350px,95vh-52px))] h-[calc(min(90vw-350px,95vh-52px))]">
            {loading ? (
              <div className="aspect-square flex items-center justify-center h-full">
                <span className={styles.loader} />
              </div>
            ) : (
              <img
                src={
                  showFullIcon
                    ? fetchIconById(champion?.info.id ?? "")
                    : champion?.icon
                }
                className="w-full h-full rounded-2xl"
                style={{ imageRendering: "pixelated" }}
                draggable="false"
              />
            )}
          </div>
          <div className="flex flex-col justify-between w-[350px] h-full overflow-x-visible">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <button
                  className="flex items-center"
                  onClick={handleNewChampion}
                >
                  <img src="/arrow-right.svg" className="w-8 h-8" />
                </button>
                <button
                  className="flex items-center"
                  onClick={() => setShowFullIcon(!showFullIcon)}
                >
                  <img src="/flag.svg" className="w-8 h-8" />
                </button>
              </div>
              <div className="italic text-7xl">Who is this champion?</div>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Type here..."
                  value={guess || ""}
                  onChange={(event) => setGuess(event.target.value)}
                  onKeyDown={handleKeyDown}
                  ref={inputRef}
                  className="text-5xl focus:outline-none w-full"
                />
              </form>
            </div>
            <Instructions />
          </div>
        </div>
        <div className="flex justify-center w-[80vw]">
          <HomeSettings
            xPixels={xPixels}
            yPixels={yPixels}
            setXPixels={setXPixels}
            setYPixels={setYPixels}
            isGrayScale={isGrayScale}
            setIsGrayScale={setIsGrayScale}
            bothPixels={bothPixels}
            setBothPixels={setBothPixels}
            shouldSubmitWithSpace={shouldSubmitWithSpace}
            setShouldSubmitWithSpace={setShouldSubmitWithSpace}
          />
        </div>
      </div>
      {/* mobile view */}
      <div className="flex flex-col sm:hidden justify-center p-4 gap-4">
        <div>
          <Instructions />
        </div>
        {/* what was i thinking when i wrote this */}
        <div className="w-[calc(min(90vw,90vh-226px-56px-40px))] h-[calc(min(90vw,90vh-226px-56px-40px))] flex relative">
          {loading ? (
            <div className="aspect-square flex items-center justify-center">
              <span className={styles.loader} />
            </div>
          ) : (
            <>
              <img
                src={
                  showFullIcon
                    ? fetchIconById(champion?.info.id ?? "")
                    : champion?.icon
                }
                className="w-full h-full rounded-2xl"
                style={{ imageRendering: "pixelated" }}
                draggable="false"
              />
              <form
                onSubmit={handleSubmit}
                className="absolute inset-0 flex items-center justify-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tap here to guess..."
                  value={guess || ""}
                  onChange={(event) => setGuess(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-xl p-2 focus:outline-none text-center text-ellipsis bg-transparent text-white placeholder-white/70 border-none w-full max-w-sm"
                  style={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  }}
                />
              </form>
            </>
          )}
        </div>
        <div className="flex justify-center items-center gap-16">
          <div
            className="flex items-center"
            onClick={() => setShowFullIcon(!showFullIcon)}
          >
            Reveal
            <img src="/flag.svg" className="w-8 h-8 cursor-pointer" />
          </div>
          <div className="flex items-center" onClick={handleNewChampion}>
            Next
            <img src="/arrow-right.svg" className="w-8 h-8 cursor-pointer" />
          </div>
        </div>
        <p className="sm:hidden">This site looks better on desktop.</p>
        <HomeSettings
          xPixels={xPixels}
          yPixels={yPixels}
          setXPixels={setXPixels}
          setYPixels={setYPixels}
          isGrayScale={isGrayScale}
          setIsGrayScale={setIsGrayScale}
          bothPixels={bothPixels}
          setBothPixels={setBothPixels}
          shouldSubmitWithSpace={shouldSubmitWithSpace}
          setShouldSubmitWithSpace={setShouldSubmitWithSpace}
        />
      </div>
    </>
  );
};

export default ChampionGuesser;
