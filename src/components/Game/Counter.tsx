import { useEffect } from "react";
import SevenSegments from "../SevenSegments";
import { useGameStore } from "../../store";

const Counter = () => {
  const { isGameDone, isGameLost, isTimerRunning, timer } = useGameStore();

  useEffect(() => {
    if (isGameDone || isGameLost || !isTimerRunning) return;

    const intervalId = setInterval(() => {
      useGameStore.setState((state) => ({ timer: state.timer + 1 }));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isGameDone, isGameLost, isTimerRunning]);

  const getDigits = (number: number): number[] => {
    return String(number).padStart(3, "0").split("").reverse().map(Number);
  };

  return (
    <div className="ml-auto flex gap-[4px] bg-black p-[2px] border-2 border-t-grid-shadow border-l-grid-shadow border-b-grid-highlight border-r-grid-highlight">
      <SevenSegments value={getDigits(timer)[2]} />
      <SevenSegments value={getDigits(timer)[1]} />
      <SevenSegments value={getDigits(timer)[0]} />
    </div>
  );
};

export default Counter;
