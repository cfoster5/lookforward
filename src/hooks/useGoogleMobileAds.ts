import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
  PermissionStatus,
} from "expo-tracking-transparency";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";

import { useAppConfigStore } from "@/stores/appConfig";
import { useStore } from "@/stores/store";

export default function useGoogleMobileAds() {
  const { isPro } = useStore();
  const { setRequestNonPersonalizedAdsOnly } = useAppConfigStore();

  useEffect(() => {
    async function checkTrackingPermissions() {
      try {
        const { status } = await getTrackingPermissionsAsync();
        // If the status is undetermined, request permission and set the flag accordingly
        if (status === PermissionStatus.UNDETERMINED) {
          const { granted } = await requestTrackingPermissionsAsync();
          setRequestNonPersonalizedAdsOnly(!granted);
        }
        // If the status is denied, set the flag to true
        else if (status === PermissionStatus.DENIED) {
          setRequestNonPersonalizedAdsOnly(true);
        } else {
          // If the status is granted, set the flag to false
          setRequestNonPersonalizedAdsOnly(false);
        }
      } catch (error) {
        console.error("Error requesting tracking permissions:", error);
      }
    }
    if (!isPro) {
      // Request App Tracking Transparency permissions
      checkTrackingPermissions();
      mobileAds().initialize();
    }
  }, [isPro, setRequestNonPersonalizedAdsOnly]);
}
