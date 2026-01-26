import type PostHog from "posthog-react-native";
import { Alert, Share } from "react-native";

import { tryCatch } from "./try-catch";

export const onShare = async (
  urlSegment: string,
  method: string,
  posthog?: PostHog | null,
) => {
  const { data, error } = await tryCatch(
    Share.share({ url: `https://getlookforward.app/${urlSegment}` }),
  );

  if (error) {
    Alert.alert(error.message);
    return { error };
  }

  const { action, activityType } = data;
  if (action === Share.sharedAction) {
    posthog?.capture("item_send", {
      content_type: "url",
      item_id: urlSegment,
      method,
    });
    return { action, activityType };
  }

  // dismissedAction or any other action
  return { action };
};
