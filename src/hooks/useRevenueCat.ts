import { useEffect } from "react";
import Purchases, { CustomerInfo } from "react-native-purchases";

import { useAuthStore } from "@/stores";

export function useRevenueCat() {
  const { user, setIsPro } = useAuthStore();
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
    if (user?.email) {
      Purchases.setEmail(user.email);
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
  }, [user, setIsPro]);
}
