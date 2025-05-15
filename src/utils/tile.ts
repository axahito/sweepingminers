import type { Difficulty } from "../types/Game";

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const generateTileId = (difficulty: Difficulty, index: number) => {
  // console.log("INDEX", {
  //   index,
  //   calculated: Math.floor(index / getDifficultyDimension(difficulty)[0]),
  //   char: alphabet.charAt(
  //     Math.floor(index / getDifficultyDimension(difficulty)[0])
  //   ),
  // });
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

export const getSurroundingTilesValues = (
  index: number,
  difficulty: Difficulty
) => {
  const dimension = getDifficultyDimension(difficulty);
  const perimeterTiles: Set<number> = new Set();

  const hidariNeighbor = index % dimension[0] === 0 ? null : index - 1;
  const migiNeighbor =
    index % dimension[0] === dimension[0] - 1 ? null : index + 1;
  const ueNeighbor =
    Math.floor(index / dimension[0]) === 0
      ? []
      : [
          (Math.floor(index / dimension[0]) - 1) * dimension[0] +
            Math.floor(
              index - Math.floor(index / dimension[0]) * dimension[0]
            ) -
            1,
          (Math.floor(index / dimension[0]) - 1) * dimension[0] +
            Math.floor(index - Math.floor(index / dimension[0]) * dimension[0]),
          (Math.floor(index / dimension[0]) - 1) * dimension[0] +
            Math.floor(
              index - Math.floor(index / dimension[0]) * dimension[0]
            ) +
            1,
        ];
  const shitaNeighbor =
    Math.floor(index / dimension[0]) === dimension[0] - 1
      ? []
      : [
          (Math.floor(index / dimension[0]) + 1) * dimension[0] +
            Math.floor(
              index - Math.floor(index / dimension[0]) * dimension[0]
            ) -
            1,
          (Math.floor(index / dimension[0]) + 1) * dimension[0] +
            Math.floor(index - Math.floor(index / dimension[0]) * dimension[0]),
          (Math.floor(index / dimension[0]) + 1) * dimension[0] +
            Math.floor(
              index - Math.floor(index / dimension[0]) * dimension[0]
            ) +
            1,
        ];

  hidariNeighbor && perimeterTiles.add(hidariNeighbor);
  migiNeighbor && perimeterTiles.add(migiNeighbor);

  if (ueNeighbor.length > 0) {
    ueNeighbor.forEach((i) => {
      perimeterTiles.add(i);
    });
  }

  if (shitaNeighbor.length > 0) {
    shitaNeighbor.forEach((i) => {
      perimeterTiles.add(i);
    });
  }
  return perimeterTiles;
};
