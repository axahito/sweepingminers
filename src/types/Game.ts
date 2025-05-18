export type Difficulty = "beginner" | "intermediate" | "expert";

export type TileCondition = "opened" | "flagged" | "closed";

export type TileData = {
  index: number;
  value: number;
  perimeter: number[];
  state: TileCondition;
};
