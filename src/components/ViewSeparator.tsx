import { Color } from "expo-router";
import { View } from "react-native";

export const ViewSeparator = () => (
  <View style={{ backgroundColor: Color.ios.secondarySystemGroupedBackground }}>
    <View
      style={{
        backgroundColor: Color.ios.separator,
        height: 1,
        marginHorizontal: 16,
      }}
    />
  </View>
);
