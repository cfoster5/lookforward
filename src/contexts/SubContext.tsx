import { createContext } from "react";

import { Firebase } from "../interfaces/firebase";

const SubContext = createContext<{ movieSubs: Firebase.Movie[]; games: any }>({
  movieSubs: [],
  games: [],
});

export default SubContext;
