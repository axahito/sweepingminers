import { create } from "zustand";
import type { Difficulty, TileData } from "./types/Game";
import {
  getBombsInPerimeter,
  getDifficultyDimension,
  getPerimeterValues,
} from "./utils/tile";

interface GameState {
  difficulty: Difficulty;
  gridSize: number[];
  isGameLost: boolean;
  isGameDone: boolean;
  tileMap: Map<number, TileData>;
  actions: {
    generateGrid: (difficulty: Difficulty) => {
      tileMap: Map<number, TileData>;
    };
    resetGame: (difficulty: Difficulty) => void;
    flagTile: (index: number) => void;
    crawlTile: (perimeter: number[], isDoubleClick?: boolean) => void;
    verifyWin: () => void;
  };
}

export const useGameStore = create<GameState>((set) => ({
  difficulty: "beginner",
  gridSize: getDifficultyDimension("beginner"),
  isGameLost: false,
  isGameDone: false,
  tileMap: new Map<number, TileData>(),

  // update state through here
  setState: (newState: Partial<GameState>) =>
    set((state) => ({ ...state, ...newState })),

  actions: {
    generateGrid: (difficulty: Difficulty) => {
      const newGridSize = getDifficultyDimension(difficulty);
      useGameStore.setState({ gridSize: newGridSize });
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
        const perimeter = getPerimeterValues(i, difficulty);

        tiles.set(i, {
          index: i,
          value: isBomb ? 100 : getBombsInPerimeter(perimeter, bombIndices),
          perimeter: Array.from(perimeter),
          state: "closed",
        });
      }

      // setTileMap(tiles);
      return { tileMap: tiles, isGameDone: false, isGameLost: false };
    },
    resetGame: (difficulty: Difficulty) => {
      set((state) => {
        const newGrid = state.actions.generateGrid(difficulty);

        return { isGameLost: false, isGameDone: false, ...newGrid };
      });
    },
    flagTile: (index: number) => {
      set((state) => {
        const tile = state.tileMap.get(index);
        if (!tile || tile.state === "opened") return {}; // No changes

        const newMap = new Map(state.tileMap);
        newMap.set(index, {
          ...tile,
          state: tile.state === "flagged" ? "closed" : "flagged",
        });

        return { tileMap: newMap };
      });
    },
    crawlTile: (perimeter: number[], isDoubleClick?: boolean) => {
      if (isDoubleClick) {
        set((state) => {
          const newMap = new Map(state.tileMap);
          const visited = new Set<number>();

          const crawlZero = (crawledPerimeter: number[]) => {
            // crawl the perimeter
            for (const p of crawledPerimeter) {
              if (visited.has(p)) continue;

              const tile = newMap.get(p);
              if (!tile) continue;

              if (tile.value !== 100 && tile.state === "closed") {
                visited.add(p);
                newMap.set(p, { ...tile, state: "opened" });

                if (tile.value === 0) {
                  // recursively crawl the perimeter if tile value is 0
                  crawlZero(tile.perimeter);
                }
              }
            }
          };

          // crawl the perimeter
          for (const p of perimeter) {
            const tile = newMap.get(p);
            if (!tile) continue;

            if (tile.value === 100 && tile.state !== "flagged")
              useGameStore.setState({ isGameLost: true });

            if (tile.state !== "flagged") {
              visited.add(p);
              newMap.set(p, { ...tile, state: "opened" });
            }

            if (tile.value === 0) {
              // recursively crawl the perimeter if tile value is 0
              crawlZero(tile.perimeter);
            }
          }

          return { tileMap: newMap };
        });
      } else {
        set((state) => {
          if (state.isGameLost) return { tileMap: state.tileMap };

          const newMap = new Map(state.tileMap);
          const visited = new Set<number>();

          const crawlZero = (crawledPerimeter: number[]) => {
            // crawl the perimeter
            for (const p of crawledPerimeter) {
              if (visited.has(p)) continue;

              const tile = newMap.get(p);
              if (!tile) continue;

              if (tile.value !== 100 && tile.state === "closed") {
                visited.add(p);
                newMap.set(p, { ...tile, state: "opened" });

                if (tile.value === 0) {
                  // recursively crawl the perimeter if tile value is 0
                  crawlZero(tile.perimeter);
                }
              }
            }
          };

          crawlZero(perimeter);
          return { tileMap: newMap };
        });
      }
    },
    verifyWin: () => {
      set((state) => {
        let isWin = false;
        let bombCount = 0;

        const newMap = new Map(state.tileMap);
        const closedTiles = Array.from(state.tileMap.values()).filter(
          (tile) => tile.state === "closed" || tile.state === "flagged"
        );

        switch (state.difficulty) {
          case "intermediate":
            bombCount = 40;
            break;

          case "expert":
            bombCount = 99;
            break;

          default:
            bombCount = 10;
            break;
        }

        if (closedTiles.length === bombCount) {
          isWin = true;

          newMap.forEach((tile, index) => {
            if (tile.value === 100) {
              newMap.set(index, { ...tile, state: "flagged" });
            }
          });
        }

        return { isGameDone: isWin, tileMap: newMap };
      });
    },
  },
}));

export const useGameActions = () => useGameStore((state) => state.actions);
