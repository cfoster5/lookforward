import { useEffect } from "react";

import { useRecentItemsStore } from "@/stores/recents";
import { Recent } from "@/types";

const useAddRecent = (
  key: "recentMovies" | "recentPeople" | "recentGames",
  recentItem: Recent,
) => {
  const { addRecent } = useRecentItemsStore();

  useEffect(() => {
    if (recentItem.img_path !== undefined) {
      // On first render, before API call, img_path is undefined
      // After API call succeeds, img_path is no longer undefined but may be empty string
      addRecent(key, recentItem);
    }
  }, [key, recentItem.id, recentItem.img_path, recentItem, addRecent]);
};

export default useAddRecent;
