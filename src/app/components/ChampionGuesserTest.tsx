"use client";

import championIcons from "../data/championIcons";
import champions from "../data/champions.json";
import { Champion } from "../components/Champion";

type ChampionIcons = {
  [key: string]: {
    default: { src: string };
  };
};

import { useState, useEffect } from "react";

const ChampionGuesser = () => {
  const championsData = champions.data;
  const championsArray = Object.values(championsData);

  const [currentChampion, setCurrentChampion] = useState<any>(null);
  const [championIcon, setChampionIcon] = useState<any>(null);
  const [guess, setGuess] = useState("");

  const [xPixels, setXPixels] = useState(3);
  const [yPixels, setYPixels] = useState(3);

  const [maxXPixels, setMaxXPixels] = useState<number | undefined>(undefined);
  const [maxYPixels, setMaxYPixels] = useState<number | undefined>(undefined);

  const setRandomChampion = () => {
    const randomChampionKey = Math.floor(Math.random() * championsArray.length);
    const currentChampion = championsArray[randomChampionKey];
    const championIcon = (championIcons as any)[currentChampion.id].default.src;
    setCurrentChampion(currentChampion);
    setChampionIcon(championIcon);
  };

  const newChampion = () => {
    setRandomChampion();
    setGuess("");
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  const normalizeString = (str: string) => {
    return str.replace(/[^a-z0-9\s]/gi, "").toLowerCase();
  };

  useEffect(() => {
    if (
      currentChampion &&
      normalizeString(currentChampion.name) === guess.toLowerCase()
    ) {
      newChampion();
    }
  }, [guess]);

  useEffect(() => {
    setRandomChampion();
  }, []);

  console.log("currentChampion", currentChampion);

  return (
    <div>
      <h1>guesser component</h1>
      <Champion
        championIcon={championIcon}
        xPixels={xPixels}
        yPixels={yPixels}
      />
      <button onClick={setRandomChampion}>skip</button>
      <p>setXPixels: {xPixels}</p>
      <input
        type="range"
        min="1"
        max="24"
        value={xPixels}
        onChange={(event) => setXPixels(Number(event.target.value))}
      />
      <p>setYPixels: {yPixels}</p>
      <input
        type="range"
        min="1"
        max="24"
        value={yPixels}
        onChange={(event) => setYPixels(Number(event.target.value))}
      />
      <form onSubmit={handleSubmit}>
        <label>
          Guess the Champion!
          <input
            type="text"
            value={guess || ""}
            onChange={(event) => setGuess(event.target.value)}
          />
        </label>
      </form>
    </div>
  );
};

export default ChampionGuesser;
