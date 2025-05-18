import { useEffect } from "react";
import type { Difficulty } from "../../types/Game";
import Tile from "./Tile";
import { useGameActions, useGameStore } from "../../store";

const GameWindow = () => {
  // TODO: put this in context so everyone has access
  // const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  // const [isGameLost, setIsGameLost] = useState(false);
  // const [gridSize, setGridSize] = useState<number[]>([0, 0]);
  const { difficulty, gridSize, isGameLost, isGameDone, tileMap } =
    useGameStore();
  const { generateGrid, flagTile, crawlTile, resetGame } = useGameActions();

  const handleTileClick = (index: number, isDoubleClick: boolean = false) => {
    const tile = tileMap.get(index);

    const isTileInvalid = !tile || tile.state === "flagged" || isGameDone;

    const isClickBlocked = tile?.state === "opened" && !isDoubleClick;

    console.log("INVALID", { isTileInvalid, isClickBlocked, isGameLost });

    if (isTileInvalid || isClickBlocked || isGameLost) return;

    useGameStore.setState((state) => {
      const newMap = new Map(state.tileMap);
      const tile = newMap.get(index);
      if (tile) newMap.set(index, { ...tile, state: "opened" });
      return { tileMap: newMap };
    });

    if (tile.value === 100) {
      useGameStore.setState({ isGameLost: true });
      return;
    }

    if (tile.value === 0) {
      crawlTile(tile.perimeter);
    }

    if (isDoubleClick) {
      let flaggedTiles = 0;
      for (const p of tile.perimeter) {
        const perimeterTile = tileMap.get(p);
        if (perimeterTile?.state === "flagged") flaggedTiles++;
      }

      if (flaggedTiles < tile.value || tile.value === 0) {
        alert("CANNOT DOUBLE CLICK");
        return;
      }

      crawlTile(tile.perimeter, isDoubleClick);
    }
  };

  // const handleTileCrawl = (perimeter: number[], isDoubleClick?: boolean) => {
  //   if (isDoubleClick) {
  //     setTileMap((prev) => {
  //       const newMap = new Map(prev);
  //       const visited = new Set<number>();

  //       const crawlZero = (crawledPerimeter: number[]) => {
  //         // crawl the perimeter
  //         for (const p of crawledPerimeter) {
  //           if (visited.has(p)) continue;

  //           const tile = newMap.get(p);
  //           if (!tile) continue;

  //           if (tile.value !== 100 && tile.state === "closed") {
  //             visited.add(p);
  //             newMap.set(p, { ...tile, state: "opened" });

  //             if (tile.value === 0) {
  //               // recursively crawl the perimeter if tile value is 0
  //               crawlZero(tile.perimeter);
  //             }
  //           }
  //         }
  //       };

  //       // crawl the perimeter
  //       for (const p of perimeter) {
  //         const tile = newMap.get(p);
  //         if (!tile) continue;

  //         if (tile.value === 100 && tile.state !== "flagged")
  //           useGameStore.setState({ isGameLost: true });

  //         if (tile.state !== "flagged") {
  //           visited.add(p);
  //           newMap.set(p, { ...tile, state: "opened" });
  //         }

  //         if (tile.value === 0) {
  //           // recursively crawl the perimeter if tile value is 0
  //           crawlZero(tile.perimeter);
  //         }
  //       }

  //       return newMap;
  //     });
  //   } else {
  //     setTileMap((prev) => {
  //       if (isGameLost) return prev;

  //       const newMap = new Map(prev);
  //       const visited = new Set<number>();

  //       const crawlZero = (crawledPerimeter: number[]) => {
  //         // crawl the perimeter
  //         for (const p of crawledPerimeter) {
  //           if (visited.has(p)) continue;

  //           const tile = newMap.get(p);
  //           if (!tile) continue;

  //           if (tile.value !== 100 && tile.state === "closed") {
  //             visited.add(p);
  //             newMap.set(p, { ...tile, state: "opened" });

  //             if (tile.value === 0) {
  //               // recursively crawl the perimeter if tile value is 0
  //               crawlZero(tile.perimeter);
  //             }
  //           }
  //         }
  //       };

  //       crawlZero(perimeter);
  //       return newMap;
  //     });
  //   }
  // };

  // const handleTileRightClick = (index: number) => {
  //   const tile = tileMap.get(index);

  //   if (!tile || tile?.state === "opened") return;

  //   useGameStore.setState({
  //     tileMap: new Map(useGameStore.getState().tileMap).set(index, {
  //       ...tileMap.get(index)!,
  //       state: "flagged",
  //     }),
  //   });

  //   // setTileMap((prev) => {
  //   //   const newMap = new Map(prev);
  //   //   const tile = newMap.get(index);
  //   //   if (tile)
  //   //     newMap.set(index, {
  //   //       ...tile,
  //   //       state: tile.state === "flagged" ? "closed" : "flagged",
  //   //     });
  //   //   return newMap;
  //   // });
  // };

  // const handleBombCrawler = () => {};

  useEffect(() => {
    // const newGridSize = getDifficultyDimension(difficulty);
    // useGameStore.setState({ gridSize: newGridSize });
    // const totalTiles = newGridSize[0] * newGridSize[1];
    // const bombIndices = new Set<number>();
    // const bombCount =
    //   { beginner: 10, intermediate: 40, expert: 99 }[difficulty] || 0;
    // while (bombIndices.size < bombCount) {
    //   bombIndices.add(Math.floor(Math.random() * totalTiles));
    // }
    // const tiles = new Map<number, TileData>();
    // for (let i = 0; i < totalTiles; i++) {
    //   const isBomb = bombIndices.has(i);
    //   const perimeter = getPerimeterValues(i, difficulty);
    //   tiles.set(i, {
    //     index: i,
    //     value: isBomb ? 100 : getBombsInPerimeter(perimeter, bombIndices),
    //     perimeter: Array.from(perimeter),
    //     state: "closed",
    //   });
    // }
    // setTileMap(tiles);

    useGameStore.setState(generateGrid(difficulty));
  }, [difficulty]);

  useEffect(() => {
    isGameLost &&
      setTimeout(() => {
        alert("HAHAHA YOU LOSE!");
      }, 100);

    // return () => {
    //   useGameStore.setState({ isGameLost: false });
    // };
  }, [isGameLost]);

  return (
    <div className="bg-grid-primary p-[16px] border-3 border-t-grid-highlight border-l-grid-highlight border-b-grid-shadow border-r-grid-shadow flex flex-col gap-[16px]">
      {/* heads up display */}
      <div className="w-full h-[72px] border-3 border-b-grid-highlight border-r-grid-highlight border-t-grid-shadow border-l-grid-shadow flex items-center justify-center">
        <button className="cursor-pointer" onClick={resetGame}>
          <img
            src="/gifs/smile-idle.gif"
            className="w-[50px] h-[50px] mx-auto"
            alt="Smile animation"
          />
        </button>
      </div>

      {/* debugging only */}
      <select
        name="difficulty"
        id="difficulty"
        onChange={(e) =>
          useGameStore.setState({ difficulty: e.target.value as Difficulty })
        }
        className="text-black"
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
                onRightClick={flagTile}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameWindow;
