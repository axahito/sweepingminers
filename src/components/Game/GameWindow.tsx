import { useEffect, useState } from "react";
import type { Difficulty } from "../../types/Game";
import Tile from "./Tile";
import {
  getDifficultyDimension,
  getSurroundingTilesValues,
} from "../../utils/tile";

type TileData = {
  index: number;
  value: number;
};

const GameWindow = () => {
  // TODO: put this in context so everyone has access
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [gridSize, setGridSize] = useState<number[]>([0, 0]);
  // const [bombIndices, setBombIndices] = useState<Set<number>>(new Set()); // TODO: put this in context
  const [tileData, setTileData] = useState<Set<TileData>>(new Set());

  useEffect(() => {
    const newGridSize = getDifficultyDimension(difficulty);
    setGridSize(newGridSize);
    const totalTiles = newGridSize[0] * newGridSize[1];
    const numOfBombs =
      {
        beginner: 10,
        intermediate: 40,
        expert: 99,
      }[difficulty] || 0;

    const bombIndices = new Set<number>();
    while (bombIndices.size < numOfBombs) {
      bombIndices.add(Math.floor(Math.random() * totalTiles));
    }

    const newTileData = new Set<TileData>();
    for (let i = 0; i < totalTiles; i++) {
      const isBomb = bombIndices.has(i);
      newTileData.add({
        index: i,
        value: isBomb ? 100 : 0,
      });
    }

    for (const tile of newTileData) {
      if (tile.value !== 100) {
        const perimeter = getSurroundingTilesValues(tile.index, difficulty);
        const intersection = new Set<number>();

        for (const num of bombIndices) {
          if (perimeter.has(num)) intersection.add(num);
        }

        tile.value = intersection.size;
      }
    }

    setTileData(newTileData);
    // setBombIndices(bombIndices);

    return () => {
      setGridSize([0, 0]);
    };
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
          {Array.from(tileData).map((tile, index) => {
            return (
              <Tile
                key={index}
                difficulty={difficulty}
                index={index}
                tileValue={tile.value}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameWindow;
