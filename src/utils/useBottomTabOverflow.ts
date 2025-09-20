import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useBottomTabOverflow() {
  // const tabHeight = useBottomTabBarHeight();
  const tabHeight = 49;
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}
