"use client";

// import { Pixyelator } from "../commands/pixyelator/index";
import championIcons from "../data/championIcons";
import champions from "../data/champions.json";

type ChampionIcons = {
  [key: string]: {
    default: { src: string };
  };
};

import { useState, useEffect } from "react"; // Incorrect casing

const ChampionGuesser = () => {
  const championsData = champions.data;
  const championsArray = Object.values(championsData);

  const [currentChampion, setCurrentChampion] = useState<any>(null);
  const [championIcon, setChampionIcon] = useState<any>(null);
  const [guess, setGuess] = useState("");

  const setRandomChampion = () => {
    const randomChampionKey = Math.floor(Math.random() * championsArray.length);
    const currentChampion = championsArray[randomChampionKey];
    const championIcon = (championIcons as any)[currentChampion.id].default.src;
    console.log("currentChampion", currentChampion);
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
      <img src={championIcon} />
      <button onClick={setRandomChampion}>skip</button>
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
