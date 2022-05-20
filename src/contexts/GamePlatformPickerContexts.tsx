import { createContext } from "react";

import { IGDB } from "../interfaces/igdb";

const GameContext = createContext<{
  game?: IGDB.Game.Game | null;
  setGame: (game: IGDB.Game.Game | null) => void;
}>({
  game: null,
  setGame: (game) => {},
});

export default GameContext;
