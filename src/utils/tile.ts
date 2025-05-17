import type { Difficulty } from "../types/Game";

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const generateTileId = (difficulty: Difficulty, index: number) => {
  return (
    alphabet.charAt(Math.floor(index / getDifficultyDimension(difficulty)[0])) +
    ((index % getDifficultyDimension(difficulty)[0]) + 1)
  );
};

export const getDifficultyDimension = (difficulty: Difficulty): number[] => {
  switch (difficulty) {
    case "beginner":
      return [9, 9];
    case "intermediate":
      return [16, 16];
    case "expert":
      return [30, 16];
  }
};

export const getPerimeterValues = (
  index: number,
  difficulty: Difficulty
): Set<number> => {
  const [width, height] = getDifficultyDimension(difficulty);
  const perimeterTiles: Set<number> = new Set();

  const row = Math.floor(index / width);
  const col = index % width;

  // define neighbors
  const directions = [
    // top
    [-1, -1],
    [-1, 0],
    [-1, 1],
    // left and right
    [0, -1],
    [0, 1],
    // bottom
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  directions.forEach(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;

    // edge check
    if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
      const newIndex = newRow * width + newCol;
      perimeterTiles.add(newIndex);
    }
  });

  return perimeterTiles;
};

export const getBombsInPerimeter = (
  perimeter: Set<number>,
  bombs: Set<number>
) => {
  let count = 0;
  perimeter.forEach((index) => bombs.has(index) && count++);
  return count;
};
