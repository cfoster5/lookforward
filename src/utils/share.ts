import analytics from "@react-native-firebase/analytics";
import { Alert, Share } from "react-native";

import { tryCatch } from "./try-catch";

export const onShare = async (urlSegment: string, method: string) => {
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
    await analytics().logShare({
      content_type: "url",
      item_id: urlSegment,
      method,
    });
    return { action, activityType };
  }

  // dismissedAction or any other action
  return { action };
};
