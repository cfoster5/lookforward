import { getAnalytics } from "@react-native-firebase/analytics";
import { useEffect } from "react";

export function useFirebaseAnalyticsCheck() {
  useEffect(() => {
    const disableAnalyticsInDev = async () => {
      if (__DEV__) {
        await getAnalytics().setAnalyticsCollectionEnabled(false);
        console.log("Firebase Analytics disabled in dev/simulator");
      }
    };
    disableAnalyticsInDev();
  }, []);
}
