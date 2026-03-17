import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";
import { Platform } from "react-native";
import Purchases, { CustomerInfo } from "react-native-purchases";

import { useAuthStore } from "@/stores/auth";

export function useRevenueCat() {
  const user = useAuthStore((s) => s.user);
  const setIsPro = useAuthStore((s) => s.setIsPro);
  const posthog = usePostHog();

  useEffect(() => {
    /* Enable debug logs before calling `setup`. */
    if (__DEV__) Purchases.setLogLevel(Purchases.LOG_LEVEL.ERROR);
    else Purchases.setLogLevel(Purchases.LOG_LEVEL.INFO);

    // Initialize the RevenueCat Purchases SDK.
    Purchases.configure({
      apiKey: Platform.select({
        default: "appl_qxPtMlTGjvHkhlNlnKlOenNikGN",
        android: "goog_nxPkuSWhLpffngTZDurFvWSFtMl",
      }),
    });

    const customerInfoUpdated = (info: CustomerInfo) => {
      setIsPro(!!info.entitlements.active.pro);
      // handle any changes to customerInfo
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);
    return () => {
      // Clean up the listener when the component unmounts
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdated);
    };
  }, [setIsPro]);

  useEffect(() => {
    if (!user?.uid) return;

    Purchases.logIn(user.uid).catch((error) => {
      console.error("RevenueCat logIn failed:", error);
    });
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.email) return;

    Purchases.setEmail(user.email).catch((error) => {
      console.error("RevenueCat setEmail failed:", error);
    });
  }, [user?.email]);

  useEffect(() => {
    if (!posthog) return;

    if (user?.uid) posthog.identify(user.uid);

    const distinctId = posthog.getDistinctId?.();
    if (!distinctId) return;

    Purchases.setAttributes({ $posthogUserId: distinctId }).catch((error) => {
      console.error("RevenueCat setAttributes failed:", error);
    });
  }, [posthog, user?.uid]);
}
