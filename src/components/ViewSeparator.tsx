import { View } from "react-native";

import { colors } from "@/theme/colors";

export const ViewSeparator = () => (
  <View style={{ backgroundColor: colors.secondarySystemGroupedBackground }}>
    <View
      style={{
        backgroundColor: colors.separator,
        height: 1,
        marginHorizontal: 16,
      }}
    />
  </View>
);
