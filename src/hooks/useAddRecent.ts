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
    // We don't want to addRecent changes, caused crashes due to infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, recentItem.id, recentItem.img_path]);
};

export default useAddRecent;
