import { useEffect } from "react";
import Purchases from "react-native-purchases";

import { useStore } from "@/stores/store";

export function useRevenueCat() {
  const { user, setIsPro } = useStore();
  useEffect(() => {
    /* Enable debug logs before calling `setup`. */
    if (__DEV__) Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);
    else Purchases.setLogLevel(Purchases.LOG_LEVEL.INFO);

    // Initialize the RevenueCat Purchases SDK.
    Purchases.configure({
      apiKey: "appl_qxPtMlTGjvHkhlNlnKlOenNikGN",
      appUserID: user?.uid,
    });

    Purchases.addCustomerInfoUpdateListener((info) => {
      setIsPro(!!info.entitlements.active.pro);
      // handle any changes to customerInfo
    });
  }, [user, setIsPro]);
}
