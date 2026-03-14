import * as StoreReview from "expo-store-review";

import { useAppConfigStore } from "@/stores/appConfig";
import { useSubscriptionStore } from "@/stores/subscription";

const REVIEW_COOLDOWN_DAYS = 60;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function isWithinCooldown() {
  const { lastRequestedReviewTimestamp } = useAppConfigStore.getState();
  const normalizedLastRequest =
    lastRequestedReviewTimestamp > 0 &&
    lastRequestedReviewTimestamp < 1_000_000_000_000
      ? lastRequestedReviewTimestamp * 1000
      : lastRequestedReviewTimestamp;

  const daysSinceLastRequest = normalizedLastRequest
    ? (Date.now() - normalizedLastRequest) / MS_PER_DAY
    : Infinity;

  return daysSinceLastRequest < REVIEW_COOLDOWN_DAYS;
}

function getTotalSubs() {
  const { movieSubs, gameSubs } = useSubscriptionStore.getState();
  return movieSubs.length + gameSubs.length;
}

async function requestAndRecord() {
  const isAvailable = await StoreReview.isAvailableAsync();
  if (!isAvailable) return;

  await StoreReview.requestReview();
  useAppConfigStore.getState().setHasRequestedReview();
}

export async function tryRequestReview() {
  if (isWithinCooldown()) return;

  const { searchCount } = useAppConfigStore.getState();
  const hasRealEngagement = getTotalSubs() >= 2 && searchCount >= 3;
  if (!hasRealEngagement) return;

  await requestAndRecord();
}

export async function tryRequestReviewFromNotification() {
  if (isWithinCooldown()) return;
  if (getTotalSubs() < 2) return;

  await requestAndRecord();
}
