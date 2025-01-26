import Header from "../components/Header";
import ChampionList from "../components/ChampionsList";

type SearchParams = {
  xPixels?: string;
  yPixels?: string;
  isGrayScale?: string;
};

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-full">
        <ChampionList
          xPixelsFromUrl={Number(searchParams.xPixels) || 8}
          yPixelsFromUrl={Number(searchParams.yPixels) || 8}
          isGrayScaleFromUrl={searchParams.isGrayScale === "true"}
        />
      </div>
    </>
  );
}
