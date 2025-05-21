import { useGameStore } from "../../store";
import SevenSegments from "./SevenSegments";

const Counter = () => {
  const { bombCount, flagCount } = useGameStore();

  const getDigitData = (number: number) => {
    if (number < -99) {
      return {
        digits: [9, 9, 0],
        negativePosition: 2,
      };
    }

    const isNegative = number < 0;
    const absoluteNumber = Math.abs(number);
    const digits = String(absoluteNumber)
      .padStart(3, "0")
      .split("")
      .reverse()
      .map(Number);

    let negativePosition: number | null = null;
    if (isNegative) {
      if (absoluteNumber >= 10) {
        negativePosition = 2;
      } else {
        negativePosition = 1;
      }
    }

    return {
      digits,
      negativePosition,
    };
  };

  const { digits, negativePosition } = getDigitData(bombCount - flagCount);

  return (
    <div className="mr-auto flex gap-[4px] bg-black p-[2px] border-2 border-t-grid-shadow border-l-grid-shadow border-b-grid-highlight border-r-grid-highlight">
      <SevenSegments
        value={digits[2]}
        override={negativePosition === 2 ? ["g"] : undefined}
      />
      <SevenSegments
        value={digits[1]}
        override={negativePosition === 1 ? ["g"] : undefined}
      />
      <SevenSegments value={digits[0]} />
    </div>
  );
};

export default Counter;
