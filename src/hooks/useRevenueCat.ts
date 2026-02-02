import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import Purchases, { CustomerInfo } from "react-native-purchases";

import { useAuthStore } from "@/stores";

export function useRevenueCat() {
  const router = useRouter();
  const posthog = usePostHog();
  const { user, setIsPro, isPro, hasSeenWidgetPromotion } = useAuthStore();
  const previousIsPro = useRef(isPro);
  useEffect(() => {
    /* Enable debug logs before calling `setup`. */
    if (__DEV__) Purchases.setLogLevel(Purchases.LOG_LEVEL.ERROR);
    else Purchases.setLogLevel(Purchases.LOG_LEVEL.INFO);

    // Initialize the RevenueCat Purchases SDK.
    Purchases.configure({
      apiKey: "appl_qxPtMlTGjvHkhlNlnKlOenNikGN",
      appUserID: user?.uid,
    });

    // Set email if available (for customer support and communication)
    if (user?.email) Purchases.setEmail(user.email);

    if (posthog) {
      if (user?.uid) posthog.identify(user.uid);
      const distinctId = posthog.getDistinctId?.();
      if (distinctId) Purchases.setAttributes({ $posthogUserId: distinctId });
    }

    const customerInfoUpdated = (info: CustomerInfo) => {
      setIsPro(!!info.entitlements.active.pro);
      // handle any changes to customerInfo
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);
    return () => {
      // Clean up the listener when the component unmounts
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdated);
    };
  }, [user, setIsPro, posthog]);

  // Detect Pro unlock and navigate to widget promotion sheet
  useEffect(() => {
    // Check if user just became Pro (transition from false to true)
    const justUnlockedPro = !previousIsPro.current && isPro;

    if (justUnlockedPro && !hasSeenWidgetPromotion && Platform.OS === "ios") {
      // Navigate to widget promotion screen
      router.push("/(tabs)/(settings)/widget-promotion");
    }

    // Update the previous value for next check
    previousIsPro.current = isPro;
  }, [isPro, hasSeenWidgetPromotion, router]);
}
