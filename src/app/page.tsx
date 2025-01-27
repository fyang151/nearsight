import Header from "./components/Header";
import ChampionGuesser from "./components/ChampionGuesser";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header currentPage="random" />
      <ChampionGuesser />
    </main>
  );
}
