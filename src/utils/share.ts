import { Alert, Share } from "react-native";

export const onShare = async (title: string, urlSegment: string) => {
  try {
    const result = await Share.share({
      message: title,
      url: `lookforward://${urlSegment}`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    Alert.alert(error.message);
  }
};
