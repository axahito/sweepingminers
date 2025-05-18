import { useEffect, useState } from "react";
import { useGameActions, useGameStore } from "../store";

const Emoji = () => {
  const { isGameLost, isGameDone, difficulty } = useGameStore();
  const { resetGame } = useGameActions();

  const [expression, setExpression] = useState("smile-idle");

  useEffect(() => {
    isGameLost && setExpression("lose-idle");
    isGameDone && setExpression("win-idle");

    return () => {
      setExpression("smile-idle");
    };
  }, [isGameLost, isGameDone, setExpression]);

  return (
    <button
      className="cursor-pointer group relative"
      onClick={(_e) => resetGame(difficulty)}
      onMouseUp={(e) => e.currentTarget.blur()}
      onMouseLeave={(e) => e.currentTarget.blur()}
    >
      <img
        src={`/gifs/${expression}.gif`}
        className="w-[50px] h-[50px] mx-auto transition-opacity group-hover:opacity-0"
        alt="indicator_animation"
      />

      <img
        src={
          isGameLost
            ? `/gifs/lose-hover.gif`
            : isGameDone
            ? "/gifs/win-hover.gif"
            : "/gifs/smile-hover.gif"
        }
        className="w-[50px] h-[50px] mx-auto opacity-0 transition-opacity group-hover:opacity-100 absolute top-0 left-0"
        alt="indicator_animation"
      />

      <img
        src={"/icons/onclick.png"}
        className="w-[50px] h-[50px] mx-auto opacity-0 transition-opacity group-focus:opacity-100 absolute top-0 left-0"
        alt="indicator_animation"
      />
    </button>
  );
};

export default Emoji;
