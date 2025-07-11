import Header from "./components/Header";
import ChampionGuesser from "./components/home/ChampionRandom";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <div className="min-h-screen">
        <Header currentPage="random" />
        <ChampionGuesser />
      </div>
      <Footer />
    </main>
  );
}
