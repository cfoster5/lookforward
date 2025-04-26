import analytics from "@react-native-firebase/analytics";
import { useEffect } from "react";

export function useFirebaseAnalyticsCheck() {
  useEffect(() => {
    const disableAnalyticsInDev = async () => {
      if (__DEV__) {
        await analytics().setAnalyticsCollectionEnabled(false);
        console.log("Firebase Analytics disabled in dev/simulator");
      }
    };
    disableAnalyticsInDev();
  }, []);
}
