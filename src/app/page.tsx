import ChampionGuesser from "./components/ChampionGuesser";

export default function Home() {
  return (
    <>
      <h1 className="p-2 text-3xl">Nearsight.cc</h1>
      <div className="flex justify-center">
        <ChampionGuesser />
      </div>
    </>
  );
}
