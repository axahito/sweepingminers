import { useEffect, useState } from "react";
import { useGameStore } from "../../store";
import type { Difficulty, TileCondition } from "../../types/Game";
import { generateTileId } from "../../utils/tile";

type Props = {
  difficulty: Difficulty;
  index: number;
  tileValue: number; // value is kept as number, if it's a bomb, value is over 100
  tileState: TileCondition;
};

const Tile = ({ index, difficulty, tileValue, tileState }: Props) => {
  const {
    selectedTiles: { tiles, action },
  } = useGameStore();

  // const [isFlashing, setIsFlashing] = useState(false);
  const [doAction, setDoAction] = useState<
    "flash" | "reveal" | "explode" | null
  >(null);

  useEffect(() => {
    // tiles.includes(index) && action === "flash"
    //   ? setIsFlashing(true)
    //   : setIsFlashing(false);

    tiles.includes(index) && setDoAction(action);

    return () => {
      setDoAction(null);
    };
  }, [tiles]);

  // const getTileClasses = (condition: TileCondition) => {
  //   switch (condition) {
  //     case "opened":
  //       return "bg-grid-primary border-2 border-grid-shadow flex justify-center items-center";

  //     case "flagged":
  //       return "bg-grid-primary border-3 border-t-grid-highlight border-l-grid-highlight border-b-grid-shadow border-r-grid-shadow flex justify-center items-center";

  //     default:
  //       return "bg-grid-primary border-3 border-t-grid-highlight border-l-grid-highlight border-b-grid-shadow border-r-grid-shadow flex justify-center items-center cursor-pointer hover:bg-grid-highlight active:bg-grid-primary";
  //   }
  // };

  return (
    <div
      data-index={index}
      id={generateTileId(difficulty, index)}
      className={`${tileState} ${
        doAction === "flash" ? "border-2! border-grid-shadow!" : ""
      } ${doAction === "explode" ? "bg-[#cc0000]!" : ""} tile`}
      style={{
        width: "32px",
        height: "32px",
        boxSizing: "border-box",
      }}
    >
      {/* {tileState === "flagged" ? (
        <img
          src={`/gifs/flag.gif`}
          className="w-[24px] h-[24px] mx-auto"
          alt="flag_animation"
        />
      ) : tileState === "opened" && tileValue === 100 ? (
        <img
          src={`/gifs/mines.gif`}
          className="w-[32px] h-[24px] mx-auto"
          alt="mine_animation"
        />
      ) : (
        <p
          className={`text-xs font-bold ${
            tileValue === 100 ? "text-red-500" : ""
          }`}
        >
          {tileState === "opened" && tileValue > 0 && tileValue}
        </p>
      )} */}
      {tileState === "flagged" && (
        <img
          src={`/gifs/flag.gif`}
          className="w-[24px] h-[24px] mx-auto"
          alt="flag_animation"
        />
      )}

      {tileState === "opened" && tileValue === 100 && (
        <img
          src={`/gifs/mines.gif`}
          className="w-[32px] h-[24px] mx-auto"
          alt="mine_animation"
        />
      )}

      {tileState === "opened" && tileValue > 0 && (
        <div className={`w-[32px] h-[32px] number number-${tileValue}`} />
      )}
    </div>
  );
};

export default Tile;
