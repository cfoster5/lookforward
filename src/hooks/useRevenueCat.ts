import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useEffect } from "react";
import Purchases from "react-native-purchases";

export function useRevenueCat(
  user: FirebaseAuthTypes.User | null,
  setIsPro: (isPro: boolean) => void,
) {
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
  }, [setIsPro, user]);
}
