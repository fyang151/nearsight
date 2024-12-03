"use client";

import { useState, useEffect } from "react";

import { useGame } from "../hooks/useGame";

import { Champion } from "../components/Champion";

const ChampionGuesser = () => {
  const { champion, newChampion, loading } = useGame();

  const [guess, setGuess] = useState("");

  const [xPixels, setXPixels] = useState(3);
  const [yPixels, setYPixels] = useState(3);

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
      console.log("this fired");
      setGuess("");
      newChampion();
    }
  }, [guess]);

  return (
    <div>
      <div>
        <h1>guesser component</h1>
        <button onClick={newChampion}>skip</button>
        <br />

        {loading ? (
          <p>loading...</p>
        ) : (
          <Champion
            championIcon={champion?.icon}
            xPixels={xPixels}
            yPixels={yPixels}
          />
        )}
      </div>

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
