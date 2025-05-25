import "./App.css";
import GameWindow from "./components/Game/GameWindow";

function App() {
  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center justify-center p-4">
      <main className="w-full h-full  rounded-lg p-6 flex justify-center items-center">
        <GameWindow />
      </main>

      <footer className="w-full h-[64px] text-sm text-black flex justify-center items-center gap-[8px]">
        Crafted by Abiyyu Rohman <span>|</span>
        <a href="https://www.linkedin.com/in/abiyyu-rohman-227982181/" target="_blank">
          #100ProjectsForJapan
        </a>
      </footer>
    </div>
  );
}

export default App;
