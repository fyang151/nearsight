import { ReactEventHandler, useEffect } from "react";
import { Pixyelator } from "../commands/pixyelator";

interface SettingsProps {
  xPixels: number;
  yPixels: number;
  setXPixels: (xPixels: number) => void;
  setYPixels: (yPixels: number) => void;
}

const Settings = ({
  xPixels,
  yPixels,
  setXPixels,
  setYPixels,
}: SettingsProps) => {
  useEffect(() => {
    const pixelateImage = async (image: any) => {
      await Pixyelator.convert({
        imgInput: image,
        xPixels: xPixels,
        yPixels: yPixels,
        customCanvasId: "demo",
      });
    };

    pixelateImage("/joe.webp");
  }, [xPixels, yPixels]);

  const handleSetBothPixels = (event: any) => {
    const value = Number(event.target.value);
    setXPixels(value);
    setYPixels(value);
  };

  return (
    <div className="flex flex-col justify-center w-[60vh] h-[80vh] rounded-md bg-white p-4 z-2">
      <div className="m-4">
        <p>set Both: {xPixels}</p>
        <input
          type="range"
          min="1"
          max="24"
          value={xPixels == yPixels ? xPixels : 0}
          onChange={handleSetBothPixels}
        />
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
      </div>
      <canvas id="demo"></canvas>
    </div>
  );
};

export default Settings;
