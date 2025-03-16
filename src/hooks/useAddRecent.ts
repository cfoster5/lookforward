import { useEffect } from "react";
import { Recent } from "@/types";
import { useRecentMoviesStore } from "@/stores/recents";

const useAddRecent = (
  key: "recentMovies" | "recentPeople" | "recentGames",
  recentItem: Recent,
) => {
  const { addRecent } = useRecentMoviesStore();

  useEffect(() => {
    if (recentItem.img_path !== undefined) {
      // On first render, before API call, img_path is undefined
      // After API call succeeds, img_path is no longer undefined but may be empty string
      addRecent(key, recentItem);
    }
  }, [addRecent, key, recentItem]);
};

export default useAddRecent;
