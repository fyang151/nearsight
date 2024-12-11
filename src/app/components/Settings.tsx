import { Pixyelator } from "../commands/pixyelator";

interface SettingsProps {
  xPixels: number;
  yPixels: number;
  setXPixels: (xPixels: number) => void;
  setYPixels: (yPixels: number) => void;
}

const Settings = ({ xPixels, yPixels, setXPixels, setYPixels }: SettingsProps) => {
  const pixelateImage = async (image: any) => {
    await Pixyelator.toDataURL(image, xPixels, yPixels);
  };

  return (
    <>
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
    </>
  );
};

export default Settings;
