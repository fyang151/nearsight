import Header from "../components/Header";
import ChampionList from "../components/ChampionsList";
import Footer from "../components/Footer";

type SearchParams = {
  xPixels?: string;
  yPixels?: string;
  isGrayScale?: string;
  sideBarPosition?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <>
      <Header currentPage="list" />
      <div className="flex justify-center items-center h-full">
        <ChampionList
          xPixelsFromUrl={Number(params.xPixels)}
          yPixelsFromUrl={Number(params.yPixels)}
          isGrayScaleFromUrl={Boolean(Number(params.isGrayScale))}
          sideBarPositionFromUrl={params.sideBarPosition}
        />
      </div>
      <Footer />
    </>
  );
}
