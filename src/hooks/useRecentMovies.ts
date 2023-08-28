import { useCallback, useEffect, useState } from "react";
import { useMMKVString } from "react-native-mmkv";

import { Recent } from "@/types";

export function useRecentMovies() {
  const [storedMovies] = useMMKVString("recent.movies");

  // const composeRecentMovies = useCallback(
  //   () => (storedMovies ? (JSON.parse(storedMovies) as Recent[]) : []),
  //   [storedMovies]
  // );

  // return composeRecentMovies();

  const [recentMovies, setRecentMovies] = useState<Recent[]>([]);
  useEffect(() => {
    setRecentMovies(storedMovies ? (JSON.parse(storedMovies) as Recent[]) : []);
  }, [storedMovies]);
  return recentMovies;
}
