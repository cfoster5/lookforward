import type { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { router } from "expo-router";

type NotificationContentType = "movie" | "game" | "person";

function isSupportedContentType(
  value: string | undefined,
): value is NotificationContentType {
  return value === "movie" || value === "game" || value === "person";
}

export function navigateFromNotification(
  message: FirebaseMessagingTypes.RemoteMessage | null,
) {
  const rawContentType = message?.data?.contentType;
  const rawContentId = message?.data?.contentId;

  if (typeof rawContentType !== "string" || typeof rawContentId !== "string") {
    return false;
  }

  const contentType = rawContentType;
  const contentId = rawContentId;

  if (!isSupportedContentType(contentType) || !contentId) return false;

  if (contentType === "movie") {
    router.push({
      pathname: "/(tabs)/(countdown)/movie/[id]",
      params: { id: contentId },
    });
    return true;
  }

  if (contentType === "person") {
    router.push({
      pathname: "/(tabs)/(countdown)/person/[id]",
      params: { id: contentId },
    });
    return true;
  }

  router.push({
    pathname: "/(tabs)/(countdown)/game/[id]",
    params: { id: contentId },
  });
  return true;
}
