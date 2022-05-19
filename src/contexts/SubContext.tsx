import { createContext } from "react";

import { FirestoreMovie } from "../interfaces/firebase";

const SubContext = createContext<{ movieSubs: FirestoreMovie[]; games: any }>({
  movieSubs: [],
  games: [],
});

export default SubContext;
