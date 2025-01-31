import Header from "./components/Header";
import ChampionGuesser from "./components/ChampionGuesser";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header currentPage="random" />
      <ChampionGuesser />
      <Footer />
    </main>
  );
}
