import { useState } from "react";
import type { Difficulty, TileCondition } from "../../types/Game";
import { generateTileId } from "../../utils/tile";

type Props = {
  difficulty: Difficulty;
  index: number;
  tileValue: number; // value is kept as number, if it's a bomb, value is over 100
};

const Tile = ({ index, difficulty, tileValue }: Props) => {
  const [tileCondition, setTileCondition] = useState<TileCondition>("closed");

  const handleTileClick = () => {
    if (tileCondition === "opened") return;

    if (tileValue === 100) {
      alert("HAHAHA YOU LOSE!");
    }

    setTileCondition("opened");
  };

  const getTileClasses = (condition: TileCondition) => {
    switch (condition) {
      case "opened":
        return "bg-grid-primary border-2 border-grid-shadow flex justify-center items-center";

      default:
        return "bg-grid-primary border-2 border-t-grid-highlight border-l-grid-highlight border-b-grid-shadow border-r-grid-shadow flex justify-center items-center cursor-pointer hover:bg-grid-highlight active:bg-grid-primary";
    }
  };

  return (
    <div
      id={generateTileId(difficulty, index)}
      className={getTileClasses(tileCondition)}
      onClick={handleTileClick}
      style={{
        width: "32px",
        height: "32px",
        boxSizing: "border-box",
      }}
    >
      <p
        className={`text-xs font-bold ${
          tileValue === 100 ? "text-red-500" : ""
        }`}
      >
        {tileCondition === "closed"
          ? generateTileId(difficulty, index)
          : tileValue}
      </p>
    </div>
  );
};

export default Tile;
