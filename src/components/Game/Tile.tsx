import { useEffect, useState } from "react";
import { useGameStore } from "../../store";
import type { Difficulty, TileCondition } from "../../types/Game";
import { generateTileId } from "../../utils/tile";

type Props = {
  difficulty: Difficulty;
  index: number;
  tileValue: number; // value is kept as number, if it's a bomb, value is over 100
  tileState: TileCondition;
  onClick: (index: number, isDoubleClick?: boolean) => void;
  onRightClick: (index: number) => void;
};

const Tile = ({
  index,
  difficulty,
  tileValue,
  tileState,
  onClick,
  onRightClick,
}: Props) => {
  const {
    selectedTiles: { tiles, action },
  } = useGameStore();

  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    tiles.includes(index) && action === "flash"
      ? setIsFlashing(true)
      : setIsFlashing(false);

    return () => {
      setIsFlashing(false);
    };
  }, [tiles]);

  const getTileClasses = (condition: TileCondition) => {
    switch (condition) {
      case "opened":
        return "bg-grid-primary border-2 border-grid-shadow flex justify-center items-center";

      case "flagged":
        return "bg-grid-primary border-3 border-t-grid-highlight border-l-grid-highlight border-b-grid-shadow border-r-grid-shadow flex justify-center items-center";

      default:
        return "bg-grid-primary border-3 border-t-grid-highlight border-l-grid-highlight border-b-grid-shadow border-r-grid-shadow flex justify-center items-center cursor-pointer hover:bg-grid-highlight active:bg-grid-primary";
    }
  };

  return (
    <div
      id={generateTileId(difficulty, index)}
      className={
        getTileClasses(tileState) + (isFlashing ? " border-2! border-grid-shadow!" : "")
      }
      onClick={() => onClick(index)}
      onDoubleClick={() => onClick(index, true)}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(index);
      }}
      style={{
        width: "32px",
        height: "32px",
        boxSizing: "border-box",
      }}
    >
      {tileState === "flagged" ? (
        <img
          src={`/gifs/flag.gif`}
          className="w-[20px] h-[20px] mx-auto"
          alt="flag_animation"
        />
      ) : (
        <p
          className={`text-xs font-bold ${
            tileValue === 100 ? "text-red-500" : ""
          }`}
        >
          {tileState === "opened" && tileValue > 0 && tileValue}
        </p>
      )}
    </div>
  );
};

export default Tile;
