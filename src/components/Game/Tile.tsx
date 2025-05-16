import type { Difficulty, TileCondition } from "../../types/Game";
import { generateTileId } from "../../utils/tile";

type Props = {
  difficulty: Difficulty;
  index: number;
  tileValue: number; // value is kept as number, if it's a bomb, value is over 100
  tileState: TileCondition;
  onClick: (index: number) => void;
};

const Tile = ({ index, difficulty, tileValue, tileState, onClick }: Props) => {
  // const [tileCondition, setTileCondition] = useState<TileCondition>("closed");

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
      className={getTileClasses(tileState)}
      onClick={() => onClick(index)}
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
        {tileState === "closed" ? generateTileId(difficulty, index) : tileValue}
      </p>
    </div>
  );
};

export default Tile;
