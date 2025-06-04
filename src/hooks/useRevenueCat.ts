import { useEffect } from "react";
import Purchases, { CustomerInfo } from "react-native-purchases";

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

    const customerInfoUpdated = (info: CustomerInfo) => {
      setIsPro(!!info.entitlements.active.pro);
      // handle any changes to customerInfo
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);
    return () => {
      // Clean up the listener when the component unmounts
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdated);
    };
  }, [user, setIsPro]);
}
