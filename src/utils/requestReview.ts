import * as StoreReview from "expo-store-review";

import { useAppConfigStore } from "@/stores/appConfig";
import { useSubscriptionStore } from "@/stores/subscription";

/**
 * Requests an app store review if the user has 3+ subscriptions
 * and hasn't been asked before. Should be called after successfully
 * adding a subscription.
 */
export async function tryRequestReview() {
  const { hasRequestedReview, setHasRequestedReview } =
    useAppConfigStore.getState();
  const { movieSubs, gameSubs } = useSubscriptionStore.getState();

  const totalSubs = movieSubs.length + gameSubs.length;

  if (totalSubs >= 3 && !hasRequestedReview) {
    const isAvailable = await StoreReview.isAvailableAsync();
    if (isAvailable) {
      await StoreReview.requestReview();
      setHasRequestedReview();
    }
  }
}
