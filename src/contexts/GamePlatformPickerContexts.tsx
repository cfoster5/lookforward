import { createContext } from "react";
import { IGDB } from "../../types";

const GameContext = createContext({
  game: null,
  setGame: (game: IGDB.Game.Game | null) => {}
});

export default GameContext;
