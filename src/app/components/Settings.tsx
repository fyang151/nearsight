import { useState, useEffect } from "react";
import { Pixyelator } from "../commands/pixyelator";

import styles from "./Settings.module.css";

interface SettingsProps {
  xPixels: number;
  yPixels: number;
  setXPixels: (xPixels: number) => void;
  setYPixels: (yPixels: number) => void;
  isGrayScale: boolean;
  setIsGrayScale: (isGrayScale: boolean) => void;
}

const Settings = ({
  xPixels,
  yPixels,
  setXPixels,
  setYPixels,
  isGrayScale,
  setIsGrayScale,
}: SettingsProps) => {
  // pixels slider
  const [bothSliderDisabled, setBothSliderDisabled] = useState<boolean>(false);
  const [bothPixels, setBothPixels] = useState<number>(3);

  // we need this to seperate the input and actual value, because we allow users to input value outside of the range
  const [bothPixelsInput, setBothPixelsInput] = useState<string>(
    String(bothPixels)
  );
  const [xPixelsInput, setXPixelsInput] = useState<string>(String(xPixels));
  const [yPixelsInput, setYPixelsInput] = useState<string>(String(yPixels));

  const handleChangeX = (value: number) => {
    setBothSliderDisabled(true);
    setBothPixelsInput("-");
    changeX(value);
  };

  const changeX = (value: number) => {
    setXPixels(value);
    setXPixelsInput(String(value));
  };

  const handleChangeY = (value: number) => {
    setBothSliderDisabled(true);
    setBothPixelsInput("-");
    changeY(value);
  };

  const changeY = (value: number) => {
    setYPixels(value);
    setYPixelsInput(String(value));
  };

  const handleChangeBoth = (value: number) => {
    changeX(value);
    changeY(value);
    setBothPixels(value);
    setBothPixelsInput(String(value));
  };

  const handleChangeBothInput = (value: string) => {
    setBothPixelsInput(String(value));

    const numValue = Number(value);

    if (1 <= numValue && numValue <= 10) {
      handleChangeBoth(numValue);
    } else if (numValue < 1) {
      handleChangeBoth(1);
    } else if (numValue > 10) {
      handleChangeBoth(10);
    }

    setBothSliderDisabled(false);
  };

  const handleChangeXInput = (value: string) => {
    setXPixelsInput(value);

    const numValue = Number(value);

    if (1 <= numValue && numValue <= 10) {
      setXPixels(numValue);
    } else if (numValue < 1) {
      setXPixels(1);
    } else if (numValue > 10) {
      setXPixels(10);
    }

    setBothSliderDisabled(true);
  };

  const handleChangeYInput = (value: string) => {
    setYPixelsInput(value);

    const numValue = Number(value);

    if (1 <= numValue && numValue <= 10) {
      setYPixels(numValue);
    } else if (numValue < 1) {
      setYPixels(1);
    } else if (numValue > 10) {
      setYPixels(10);
    }

    setBothSliderDisabled(true);
  };

  // setting isGrayScale

  const handleIsGrayScaleChecked = () => {
    setIsGrayScale(!isGrayScale);
  };

  useEffect(() => {
    console.log("isGrayScale", isGrayScale);
    const pixelateImage = async (image: any) => {
      await Pixyelator.convert({
        imgInput: image,
        xPixels: xPixels,
        yPixels: yPixels,
        customCanvasId: "demo",
        isGrayScale: isGrayScale,
      });
    };

    pixelateImage("/mePlaceholder.jpg");
  }, [xPixels, yPixels, isGrayScale]);

  return (
    <div
      className={` ${styles.inputWrapper} flex justify-center w-full h-full gap-4 p-4 select-none`}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="flex">
          <h1
            className={`flex w-[80px] justify-end mr-4 ${
              bothSliderDisabled && "text-settings-accentDisabled"
            }`}
          >
            Both
          </h1>
          <input
            type="text"
            value={bothPixelsInput}
            onFocus={() => {
              setBothPixelsInput("");
            }}
            onBlur={() => {
              setBothPixelsInput(String(bothPixels));
            }}
            onChange={(event) => handleChangeBothInput(event.target.value)}
            className={`${bothSliderDisabled && styles.disabled}`}
          />
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={bothPixels}
          onFocus={() => {
            setBothSliderDisabled(false);
            setBothPixelsInput(String(bothPixels));
          }}
          onChange={(event) => handleChangeBoth(Number(event.target.value))}
          className={`${bothSliderDisabled && styles.disabled}`}
        />
        <div className="flex">
          <h1 className="flex w-[80px] justify-end mr-4 text-settings-accentOne">
            Horizontal
          </h1>
          <input
            type="text"
            value={xPixelsInput}
            onFocus={() => setXPixelsInput("")}
            onBlur={() => setXPixelsInput(String(xPixels))}
            onChange={(event) => handleChangeXInput(event.target.value)}
            className={styles.x}
          />
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={xPixels}
          onChange={(event) => handleChangeX(Number(event.target.value))}
          className={styles.x}
        />
        <div className="flex">
          <h1 className="flex w-[80px] justify-end mr-4 text-settings-accentTwo">
            Vertical
          </h1>
          <input
            type="text"
            value={yPixelsInput}
            onFocus={() => setYPixelsInput("")}
            onBlur={() => setYPixelsInput(String(yPixels))}
            onChange={(event) => handleChangeYInput(event.target.value)}
            className={styles.y}
          />
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={yPixels}
          onChange={(event) => handleChangeY(Number(event.target.value))}
          className={styles.y}
        />
        <label className="gap-4 flex mt-10">
          <input
            type="checkbox"
            checked={isGrayScale}
            onChange={handleIsGrayScaleChecked}
          />
          Grayscale
        </label>
      </div>
      <canvas id="demo" />
    </div>
  );
};

export default Settings;
