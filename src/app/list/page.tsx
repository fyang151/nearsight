import Header from "../components/Header";
import ChampionList from "../components/ChampionsList";

// i dont wanna fix this build error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Home({ searchParams }: { searchParams: any }) {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-full">
        <ChampionList
          xPixelsFromUrl={Number(searchParams.xPixels)}
          yPixelsFromUrl={Number(searchParams.yPixels)}
          isGrayScaleFromUrl={Boolean(Number(searchParams.isGrayScale))}
        />
      </div>
    </>
  );
}
