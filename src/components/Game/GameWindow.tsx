import { useEffect, useState } from "react";
import type { Difficulty, TileCondition } from "../../types/Game";
import Tile from "./Tile";
import {
  getBombsInPerimeter,
  getDifficultyDimension,
  getSurroundingTilesValues,
} from "../../utils/tile";

type TileData = {
  index: number;
  value: number;
  perimeter: number[];
  state: TileCondition;
};

const GameWindow = () => {
  // TODO: put this in context so everyone has access
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [gridSize, setGridSize] = useState<number[]>([0, 0]);
  // const [bombIndices, setBombIndices] = useState<Set<number>>(new Set()); // TODO: put this in context
  const [tileMap, setTileMap] = useState<Map<number, TileData>>(new Map());

  const handleTileClick = (index: number) => {
    const tile = tileMap.get(index);

    if (!tile || tile?.state === "opened") return;

    if (tile.value === 100) {
      alert("HAHAHA YOU LOSE!");
    }

    setTileMap((prev) => {
      const newMap = new Map(prev);
      const tile = newMap.get(index);
      if (tile) newMap.set(index, { ...tile, state: "opened" });
      return newMap;
    });
  };

  useEffect(() => {
    const newGridSize = getDifficultyDimension(difficulty);
    setGridSize(newGridSize);
    const totalTiles = newGridSize[0] * newGridSize[1];

    const bombIndices = new Set<number>();
    const bombCount =
      { beginner: 10, intermediate: 40, expert: 99 }[difficulty] || 0;

    while (bombIndices.size < bombCount) {
      bombIndices.add(Math.floor(Math.random() * totalTiles));
    }

    const tiles = new Map<number, TileData>();

    for (let i = 0; i < totalTiles; i++) {
      const isBomb = bombIndices.has(i);
      const perimeter = getSurroundingTilesValues(i, difficulty);

      tiles.set(i, {
        index: i,
        value: isBomb ? 100 : getBombsInPerimeter(perimeter, bombIndices),
        perimeter: Array.from(perimeter),
        state: "closed",
      });
    }

    setTileMap(tiles);
  }, [difficulty]);

  return (
    <div className="bg-grid-primary p-[16px] border-3 border-t-grid-highlight border-l-grid-highlight border-b-grid-shadow border-r-grid-shadow flex flex-col gap-[16px]">
      {/* heads up display */}
      <div className="w-full h-[72px] border-3 border-b-grid-highlight border-r-grid-highlight border-t-grid-shadow border-l-grid-shadow"></div>

      {/* debugging only */}
      <select
        name="difficulty"
        id="difficulty"
        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="expert">Expert</option>
      </select>

      {/* grid */}
      <div
        className={`border-2 border-b-grid-highlight border-r-grid-highlight border-t-grid-shadow border-l-grid-shadow`}
      >
        <div
          className={`grid place-items-center`}
          style={{
            gridTemplateColumns: `repeat(${gridSize[0]}, 31px)`,
            gridTemplateRows: `repeat(${gridSize[1]}, 31px)`,
          }}
        >
          {Array.from(tileMap).map(([_key, tile], index) => {
            return (
              <Tile
                key={index}
                difficulty={difficulty}
                index={index}
                tileValue={tile.value}
                tileState={tile.state}
                onClick={handleTileClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameWindow;
