import { Alert } from "react-native";
import RevenueCatUI, {
  PAYWALL_RESULT,
  type PresentPaywallParams,
} from "react-native-purchases-ui";

export async function presentPaywallWithRestoreAlert(
  params?: PresentPaywallParams,
) {
  const result = await RevenueCatUI.presentPaywall(params);

  if (result === PAYWALL_RESULT.RESTORED) {
    Alert.alert(
      "Purchases Restored",
      "Your purchase has been restored successfully.",
    );
  }

  return result;
}
