import { Redirect } from "expo-router";

// NativeTabs doesn't support initialRouteName, so the default tab is determined
// by alphabetical directory order. This redirect ensures the Home tab (find)
// loads first instead of the Countdown tab.
export default function TabIndex() {
  return <Redirect href="/(tabs)/(find)" />;
}
