import { createContext } from "react";

import { Firebase } from "../interfaces/firebase";

const SubContext = createContext<{ movies: Firebase.Movie[]; games: any }>({
  movies: [],
  games: [],
});

export default SubContext;
