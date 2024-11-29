import { Pixyelator } from "../commands/pixyelator";
import { useEffect, useState } from "react";

export const Champion = ({ championIcon, xPixels, yPixels }: any) => {
  const [pixelatedChampion, setPixelatedChampion] = useState<any>(null);

  useEffect(() => {
    if (championIcon) {
      const pixelateChampion = async (
        championIcon: any,
        xPixels: number,
        yPixels: number
      ) => {
        const pixelatedChampionNew = await Pixyelator.toDataURL(
          championIcon,
          xPixels,
          yPixels
        );
        setPixelatedChampion(pixelatedChampionNew);
      };
      pixelateChampion(championIcon, xPixels, yPixels);
    }
  }, [championIcon, xPixels, yPixels]);

  return <img src={pixelatedChampion} />;
};
