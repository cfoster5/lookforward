import * as StoreReview from "expo-store-review";

import { useAppConfigStore } from "@/stores/appConfig";
import { useSubscriptionStore } from "@/stores/subscription";

const REVIEW_COOLDOWN_DAYS = 60;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export async function tryRequestReview() {
  const { lastRequestedReviewTimestamp, searchCount, setHasRequestedReview } =
    useAppConfigStore.getState();
  const { movieSubs, gameSubs } = useSubscriptionStore.getState();
  const totalSubs = movieSubs.length + gameSubs.length;
  const normalizedLastRequest =
    lastRequestedReviewTimestamp > 0 &&
    lastRequestedReviewTimestamp < 1_000_000_000_000
      ? lastRequestedReviewTimestamp * 1000
      : lastRequestedReviewTimestamp;

  const daysSinceLastRequest = normalizedLastRequest
    ? (Date.now() - normalizedLastRequest) / MS_PER_DAY
    : Infinity;

  if (daysSinceLastRequest < REVIEW_COOLDOWN_DAYS) return;

  const hasRealEngagement = totalSubs >= 2 && searchCount >= 3;
  if (!hasRealEngagement) return;

  const isAvailable = await StoreReview.isAvailableAsync();
  if (!isAvailable) return;

  await StoreReview.requestReview();
  setHasRequestedReview();
}
