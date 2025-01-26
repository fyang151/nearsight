import { useState, useEffect } from "react";

import { pixelateToCanvas } from "../utils/pixelateImage";

import styles from "./Settings.module.css";

interface SettingsProps {
  xPixels: number;
  yPixels: number;
  setXPixels: (xPixels: number) => void;
  setYPixels: (yPixels: number) => void;
  isGrayScale: boolean;
  setIsGrayScale: (isGrayScale: boolean) => void;
  toggleSettings?: () => void;
  bothPixels: number;
  setBothPixels: (bothPixels: number) => void;
}

const Settings = ({
  xPixels,
  yPixels,
  setXPixels,
  setYPixels,
  isGrayScale,
  setIsGrayScale,
  toggleSettings,
  bothPixels,
  setBothPixels,
}: SettingsProps) => {
  const initialBothSliderDisabled = xPixels !== yPixels;
  const [bothSliderDisabled, setBothSliderDisabled] = useState<boolean>(
    initialBothSliderDisabled
  );

  // we need this to seperate the input and actual value, because we allow users to type in values outside of the range
  const [bothPixelsInput, setBothPixelsInput] = useState<string>(
    initialBothSliderDisabled ? "-" : String(bothPixels)
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
    pixelateToCanvas("/mePlaceholder.jpg", xPixels, yPixels, isGrayScale);
  }, [xPixels, yPixels, isGrayScale]);

  return (
    <div
      className={`${styles.inputWrapper} flex justify-center w-full h-full gap-4 p-4 select-none`}
    >
      <div className="relative flex flex-col items-start w-full justify-center">
        <img
          src="/back-arrow.svg"
          onClick={toggleSettings}
          className="absolute top-0 w-8 h-8 cursor-pointer"
        />
        <div className="flex flex-col w-full gap-4">
          <label className="gap-4 flex items-center">
            <input
              type="checkbox"
              checked={isGrayScale}
              onChange={handleIsGrayScaleChecked}
            />
            Grayscale
          </label>
          <div>
            <div className="flex">
              <h1 className="flex w-[80px] justify-end mr-4">Both</h1>
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
                className={`${
                  bothSliderDisabled ? styles.disabled : styles.both
                }`}
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
              className={`${
                bothSliderDisabled ? styles.disabled : styles.both
              }`}
            />
          </div>
          <div>
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
          </div>
          <div>
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
          </div>
        </div>
      </div>
      <canvas id="demo" className="w-full rounded-lg hidden sm:flex" />
    </div>
  );
};

export default Settings;
