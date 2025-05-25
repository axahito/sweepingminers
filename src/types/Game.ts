export type Difficulty = "beginner" | "intermediate" | "expert";

export type TileCondition = "opened" | "flagged" | "closed";

export type TileData = {
  index: number;
  value: number;
  perimeter: number[];
  state: TileCondition;
};

export type TileAction = {
  actionId: string;
  tiles: number[];
  action: TileActionType | null;
};

export type TileActionType = "flash" | "reveal" | "explode" | "false-flag";
