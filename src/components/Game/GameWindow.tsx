import { useEffect } from "react";
import type { Difficulty } from "../../types/Game";
import Tile from "./Tile";
import { useGameActions, useGameStore } from "../../store";
import Emoji from "../Emoji";
import Timer from "../Counter/Timer";
import Counter from "../Counter/Counter";

const GameWindow = () => {
  const { difficulty, gridSize, isGameLost, tileMap } = useGameStore();
  const { generateGrid, flagTile, verifyWin, openTile, crawlBomb, resetGame } =
    useGameActions();

  // const handleTileClick = (index: number, isDoubleClick: boolean = false) => {
  //   const tile = tileMap.get(index);

  //   // validate tile
  //   const isTileInvalid = !tile || tile.state === "flagged" || isGameDone;
  //   const isClickBlocked = tile?.state === "opened" && !isDoubleClick;
  //   if (isTileInvalid || isClickBlocked || isGameLost) return;

  //   // open the tile
  //   useGameStore.setState((state) => {
  //     const newMap = new Map(state.tileMap);
  //     const tile = newMap.get(index);
  //     if (tile) newMap.set(index, { ...tile, state: "opened" });
  //     return { tileMap: newMap };
  //   });

  //   // check if first click
  //   const isFirstClick = ![...tileMap.values()].some(
  //     (tile) => tile.state === "opened"
  //   );
  //   if (isFirstClick) {
  //     toggleTimer();
  //   }

  //   // check if bomb
  //   if (tile.value === 100) {
  //     useGameStore.setState({ isGameLost: true });
  //     return;
  //   }

  //   // check if value is 0, crawl the perimeter
  //   if (tile.value === 0) {
  //     crawlTile(tile.perimeter);
  //   }

  //   // check if double click, open the perimeter
  //   if (isDoubleClick) {
  //     let flaggedTiles = 0;
  //     for (const p of tile.perimeter) {
  //       const perimeterTile = tileMap.get(p);
  //       if (perimeterTile?.state === "flagged") flaggedTiles++;
  //     }

  //     if (flaggedTiles < tile.value || tile.value === 0) {
  //       flashTiles(tile.perimeter);
  //       return;
  //     }

  //     crawlTile(tile.perimeter, isDoubleClick);
  //   }

  //   // verify win condition every tile click
  //   verifyWin();
  // };

  const handleTileClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const tileElement = (e.target as HTMLDivElement).closest(".tile");
    if (!tileElement || !(tileElement instanceof HTMLElement)) return;

    const index = Number(tileElement.dataset.index);

    openTile(index, false);

    // verify win condition every tile click
    verifyWin();
  };

  const handleTileDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const tileElement = (e.target as HTMLDivElement).closest(".tile");
    if (!tileElement || !(tileElement instanceof HTMLElement)) return;

    const index = Number(tileElement.dataset.index);

    openTile(index, true);

    // verify win condition every tile click
    verifyWin();
  };

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const tileElement = (e.target as HTMLDivElement).closest(".tile");
    if (!tileElement || !(tileElement instanceof HTMLElement)) return;

    const index = Number(tileElement.dataset.index);

    flagTile(index);
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
    useGameStore.setState(generateGrid(difficulty));
  }, [difficulty]);

  useEffect(() => {
    const initiateLose = () => {
      crawlBomb();
    };

    isGameLost && initiateLose();
  }, [isGameLost]);

  return (
    <div className="bg-grid-primary p-[16px] border-3 border-t-grid-highlight border-l-grid-highlight border-b-grid-shadow border-r-grid-shadow flex flex-col gap-[16px]">
      {/* heads up display */}
      <div className="w-full h-[72px] border-3 border-b-grid-highlight border-r-grid-highlight border-t-grid-shadow border-l-grid-shadow flex items-center justify-center relative px-[4px]">
        <Counter />

        <Emoji />

        <Timer />
      </div>

      {/* debugging only */}
      <select
        name="difficulty"
        id="difficulty"
        onChange={(e) =>
          // useGameStore.setState({ difficulty: e.target.value as Difficulty })
          resetGame(e.target.value as Difficulty)
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
          onClick={handleTileClick}
          onDoubleClick={handleTileDoubleClick}
          onContextMenu={handleRightClick}
        >
          {Array.from(tileMap).map(([_key, tile], index) => {
            return (
              <Tile
                key={index}
                difficulty={difficulty}
                index={index}
                tileValue={tile.value}
                tileState={tile.state}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameWindow;
