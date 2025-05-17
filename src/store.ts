import { create } from "zustand";
import type { Difficulty } from "./types/Game";
import { getDifficultyDimension } from "./utils/tile";

interface GameState {
  difficulty: Difficulty;
  gridSize: number[];
  isGameLost: boolean;
  isGameDone: boolean;
}

export const useGameStore = create<GameState>((set) => ({
  difficulty: "beginner",
  gridSize: getDifficultyDimension("beginner"),
  isGameLost: false,
  isGameDone: false,

  // update state through here
  setState: (newState: Partial<GameState>) =>
    set((state) => ({ ...state, ...newState })),
}));
