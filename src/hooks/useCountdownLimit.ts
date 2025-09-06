import { useCallback } from "react";

import { useStore } from "@/stores/store";

const freeItemLimit = 5;

export function useCountdownLimit() {
  const { isPro, movieSubs, gameSubs, peopleSubs, proModalRef } = useStore();

  /**
   * Call this when the user tries to add a new countdown.
   * @returns `true` if under the free limit (or isPro); `false` otherwise.
   */
  const checkLimit = useCallback(
    (collection: "movies" | "gameReleases" | "people"): boolean => {
      // calculate total subscriptions across all collections
      const totalSubs = movieSubs.length + gameSubs.length + peopleSubs.length;

      // if not Pro and at-or-over the free limit, show modal and block
      if (!isPro && totalSubs >= freeItemLimit) {
        proModalRef.current?.present();
        return false;
      }

      // otherwise allow the add to proceed
      return true;
    },
    [isPro, movieSubs, gameSubs, peopleSubs, proModalRef],
  );

  return checkLimit;
}
