import {
  getAnalytics,
  setAnalyticsCollectionEnabled,
} from "@react-native-firebase/analytics";
import { useEffect } from "react";

export function useFirebaseAnalyticsCheck() {
  useEffect(() => {
    const disableAnalyticsInDev = async () => {
      if (__DEV__) {
        const analytics = getAnalytics();
        await setAnalyticsCollectionEnabled(analytics, false);
        console.log("Firebase Analytics disabled in dev/simulator");
      }
    };
    disableAnalyticsInDev();
  }, []);
}
