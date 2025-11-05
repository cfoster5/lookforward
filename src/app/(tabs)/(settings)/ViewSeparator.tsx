import * as Colors from "@bacons/apple-colors";
import { View } from "react-native";

export const ViewSeparator = () => (
  <View style={{ backgroundColor: Colors.secondarySystemGroupedBackground }}>
    <View
      style={{
        backgroundColor: Colors.separator,
        height: 1,
        marginHorizontal: 16,
      }}
    />
  </View>
);
