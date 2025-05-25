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
    action: "flash" | "reveal" | "explode" | "false-flag" | null;
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
    openTile: (index: number, isDoubleClick?: boolean) => void;
    explodeBomb: (index: number) => void;
    crawlBomb: () => void;
  };
}

export const useGameStore = create<GameState>((set, get) => ({
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
          bombCount: getDifficultyBomb(difficulty),
          flagCount: 0,
          selectedTiles: { tiles: [], action: null },
          difficulty: difficulty,
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
          flagCount:
            tile.state === "flagged"
              ? state.flagCount - 1
              : state.flagCount + 1,
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

            if (tile.value === 100 && tile.state !== "flagged") {
              get().actions.explodeBomb(p);
            }

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
        const tileMapArray = Array.from(state.tileMap.values());

        const closedOrFlaggedTiles = tileMapArray.filter(
          (tile) => tile.state === "closed" || tile.state === "flagged"
        );
        const openedBombs = tileMapArray.filter(
          (tile) => tile.value === 100 && tile.state === "opened"
        );

        const hasWon =
          closedOrFlaggedTiles.length === state.bombCount &&
          openedBombs.length === 0;

        if (!hasWon) {
          return {};
        }

        const updatedMap = new Map(state.tileMap);
        let additionalFlags = 0;

        updatedMap.forEach((tile, index) => {
          if (tile.value === 100 && tile.state !== "flagged") {
            updatedMap.set(index, { ...tile, state: "flagged" });
            additionalFlags++;
          }
        });

        return {
          isGameDone: true,
          tileMap: updatedMap,
          flagCount: state.flagCount + additionalFlags,
        };
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
    openTile: (index: number, isDoubleClick?: boolean) => {
      const tile = get().tileMap.get(index);

      // validate tile
      const isTileInvalid =
        !tile || tile.state === "flagged" || get().isGameDone;
      const isClickBlocked = tile?.state === "opened" && !isDoubleClick;
      if (isTileInvalid || isClickBlocked || get().isGameLost) return;

      // open the tile
      useGameStore.setState((state) => {
        const newMap = new Map(state.tileMap);
        const tile = newMap.get(index);
        if (tile) newMap.set(index, { ...tile, state: "opened" });
        return { tileMap: newMap };
      });

      // check if first click
      const isFirstClick =
        [...get().tileMap.values()].filter((tile) => tile.state === "opened")
          .length === 1;
      if (isFirstClick) {
        get().actions.toggleTimer();
      }

      // check if bomb
      if (tile.value === 100) {
        get().actions.explodeBomb(index);
        return;
      }

      // check if value is 0, crawl the perimeter
      if (tile.value === 0) {
        get().actions.crawlTile(tile.perimeter);
      }

      // check if double click, open the perimeter
      if (isDoubleClick) {
        let flaggedTiles = 0;
        for (const p of tile.perimeter) {
          const perimeterTile = get().tileMap.get(p);
          if (perimeterTile?.state === "flagged") flaggedTiles++;
        }

        if (flaggedTiles < tile.value || tile.value === 0) {
          get().actions.flashTiles(tile.perimeter);
          return;
        }

        get().actions.crawlTile(tile.perimeter, isDoubleClick);
      }

      // verify win condition every tile click
      get().actions.verifyWin();
    },
    explodeBomb: (index: number) => {
      const tileMapArray = Array.from(get().tileMap.values());

      const falseFlaggedTiles = tileMapArray
        .filter((tile) => tile.value !== 100 && tile.state === "flagged")
        .map((tile) => tile.index);

      useGameStore.setState({ isGameLost: true });
      set({
        selectedTiles: {
          tiles: [index, ...falseFlaggedTiles],
          action: "explode",
        },
      });
    },
    crawlBomb: () => {
      const tileMapArray = Array.from(get().tileMap.values());
      const bombTiles = tileMapArray.filter(
        (tile) => tile.value === 100 && tile.state === "closed"
      );

      useGameStore.setState((state) => {
        const newMap = new Map(state.tileMap);
        bombTiles.forEach((tile) => {
          newMap.set(tile.index, { ...tile, state: "opened" });
        });
        return { tileMap: newMap };
      });
    },
  },
}));

export const useGameActions = () => useGameStore((state) => state.actions);
