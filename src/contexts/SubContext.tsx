import { createContext } from "react";

import { FirestoreGame, FirestoreMovie } from "../interfaces/firebase";

const SubContext = createContext<{
  movieSubs: FirestoreMovie[];
  games: FirestoreGame[];
}>({
  movieSubs: [],
  games: [],
});

export default SubContext;
