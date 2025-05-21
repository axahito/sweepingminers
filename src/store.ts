import { create } from "zustand";
import type { Difficulty, TileData } from "./types/Game";
import {
  getBombsInPerimeter,
  getDifficultyBomb,
  getDifficultyDimension,
  getPerimeterValues,
} from "./utils/tile";

interface GameState {
  difficulty: Difficulty;
  gridSize: number[];
  isGameLost: boolean;
  isGameDone: boolean;
  isTimerRunning: boolean;
  timer: number;
  tileMap: Map<number, TileData>;
  bombCount: number;
  flagCount: number;
  selectedTiles: {
    tiles: number[];
    action: "flash" | "reveal" | null;
  };
  actions: {
    generateGrid: (difficulty: Difficulty) => {
      tileMap: Map<number, TileData>;
    };
    resetGame: (difficulty: Difficulty) => void;
    flagTile: (index: number) => void;
    crawlTile: (perimeter: number[], isDoubleClick?: boolean) => void;
    verifyWin: () => void;
    flashTiles: (tileIndices: number[]) => void;
    toggleTimer: () => void;
  };
}

export const useGameStore = create<GameState>((set) => ({
  difficulty: "beginner",
  gridSize: getDifficultyDimension("beginner"),
  isGameLost: false,
  isGameDone: false,
  isTimerRunning: false,
  timer: 0,
  tileMap: new Map<number, TileData>(),
  bombCount: getDifficultyBomb("beginner"),
  flagCount: 0,
  selectedTiles: {
    tiles: [],
    action: null,
  },

  actions: {
    generateGrid: (difficulty: Difficulty) => {
      const newGridSize = getDifficultyDimension(difficulty);
      useGameStore.setState({ gridSize: newGridSize });
      const totalTiles = newGridSize[0] * newGridSize[1];

      const bombIndices = new Set<number>();

      while (bombIndices.size < getDifficultyBomb(difficulty)) {
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
      return {
        tileMap: tiles,
        isGameDone: false,
        isGameLost: false,
        bombCount: getDifficultyBomb(difficulty),
        flagCount: 0,
      };
    },
    resetGame: (difficulty: Difficulty) => {
      set((state) => {
        const newGrid = state.actions.generateGrid(difficulty);

        return {
          isGameLost: false,
          isGameDone: false,
          ...newGrid,
          isTimerRunning: false,
          timer: 0,
          bombCount: getDifficultyBomb(state.difficulty),
          flagCount: 0,
        };
      });
    },
    flagTile: (index: number) => {
      set((state) => {
        if (state.isGameDone || state.isGameLost) return {};

        const tile = state.tileMap.get(index);
        if (!tile || tile.state === "opened") return {};

        const newMap = new Map(state.tileMap);
        newMap.set(index, {
          ...tile,
          state: tile.state === "flagged" ? "closed" : "flagged",
        });

        // check if first click
        const isFirstClick = ![...state.tileMap.values()].some(
          (tile) => tile.state === "opened"
        );

        return {
          tileMap: newMap,
          flagCount: state.flagCount + 1,
          ...(isFirstClick && { isTimerRunning: true }),
        };
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

        const newMap = new Map(state.tileMap);
        const closedTiles = Array.from(state.tileMap.values()).filter(
          (tile) => tile.state === "closed" || tile.state === "flagged"
        );

        if (closedTiles.length === state.bombCount) {
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
    flashTiles: (tileIndices: number[]) => {
      set({ selectedTiles: { tiles: tileIndices, action: "flash" } });

      setTimeout(() => {
        set({ selectedTiles: { tiles: [], action: null } });
      }, 100);
    },
    clearSelection: () => {
      set({ selectedTiles: { tiles: [], action: null } });
    },
    toggleTimer: () => {
      set((state) => ({
        isTimerRunning: !state.isTimerRunning,
      }));
    },
  },
}));

export const useGameActions = () => useGameStore((state) => state.actions);
