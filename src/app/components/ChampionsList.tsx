"use client";
import { useState } from "react";
import { useListGame } from "../hooks/useListGame";

const ChampionList = () => {
  const { pixelatedChampions, loading } = useListGame({
    xPixels: 4,
    yPixels: 4,
    isGrayScale: false,
  });

  // meow is just to test what happens on rerender
  const [_, meow] = useState(null);

  return (
    <div>
      <button onClick={() => meow(null)}>hi</button>
      {loading ? (
        <div>loading...</div>
      ) : (
        <ul className="grid grid-cols-4">
          {pixelatedChampions.map((pixelatedChampion) => (
            <li key={pixelatedChampion}>
              <img src={pixelatedChampion} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChampionList;
