import {
  getProductsAsync,
  IAPItemDetails,
  IAPResponseCode,
} from "expo-in-app-purchases";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export function useGetPurchaseOptions(connected: boolean) {
  const [state, setState] = useState<{
    purchaseOptions: IAPItemDetails[] | undefined;
    loadingOptions: boolean;
  }>({
    purchaseOptions: [],
    loadingOptions: true,
  });

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await getProductsAsync([
          "com.lookforward.tip1",
          "com.lookforward.tip3",
          "com.lookforward.tip5",
        ]);
        if (response.responseCode === IAPResponseCode.OK) {
          setState({
            purchaseOptions: response.results,
            loadingOptions: false,
          });
        }
      } catch {
        console.log("connection error");
      }
    }
    if (Platform.OS === "ios" && connected) getProducts();
  }, [connected]);

  return state;
}
