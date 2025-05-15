import "./App.css";
import GameWindow from "./components/Game/GameWindow";

function App() {
  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <main className="w-full h-full bg-white rounded-lg p-6 flex justify-center items-center">
        <GameWindow />
      </main>
    </div>
  );
}

export default App;
