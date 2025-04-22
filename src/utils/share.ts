import { Alert, Share } from "react-native";

import { tryCatch } from "./try-catch";

export const onShare = async (title: string, urlSegment: string) => {
  const { data, error } = await tryCatch(
    Share.share({ url: `https://getlookforward.app/${urlSegment}` }),
  );

  if (error) {
    Alert.alert(error.message);
    return { error };
  }

  const { action, activityType } = data;
  if (action === Share.sharedAction) {
    // optionally do something with activityType
    return { action, activityType };
  }

  // dismissedAction or any other action
  return { action };
};
