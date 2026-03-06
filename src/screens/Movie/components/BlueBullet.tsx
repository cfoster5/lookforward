import { View } from "react-native";

import { colors } from "@/theme/colors";

export function BlueBullet() {
  return (
    <View
      style={{
        width: 5,
        height: 5,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: colors.systemBlue,
        alignSelf: "center",
      }}
    />
  );
}
