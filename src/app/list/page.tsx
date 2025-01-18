import Header from "../components/Header";
import ChampionList from "../components/ChampionsList";

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-full">
        <ChampionList />
      </div>
    </>
  );
}
