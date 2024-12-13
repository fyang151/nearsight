import { useState, useEffect } from "react";
import { Pixyelator } from "../commands/pixyelator";

interface SettingsProps {
  xPixels: number;
  yPixels: number;
  setXPixels: (xPixels: number) => void;
  setYPixels: (yPixels: number) => void;
}

const getPixelationValue = (x: number) => {
  return Math.floor(0.000000123 * Math.pow(x, 3) + 1);
};

const Settings = ({
  xPixels,
  yPixels,
  setXPixels,
  setYPixels,
}: SettingsProps) => {
  const [testValue, setTestValue] = useState(0);

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
    // <div className="bg-white rounded-md flex flex-col justify-center w-[60vh] h-[80vh] p-4">
    <div className="flex justify-center w-full h-full gap-4 p-4">
      <div>
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
        <p>test: {getPixelationValue(testValue)}</p>
        <input
          type="range"
          min="0"
          max="1000"
          value={testValue}
          onChange={(event) => setTestValue(Number(event.target.value))}
        />
      </div>
      {/* <div className="w-full h-full bg-purple-900">hi</div> */}
      <canvas id="demo"></canvas>
    </div>
  );
};

export default Settings;
