import { View } from "react-native";

import { Colors } from "@/constants/Colors";

export function BlueBullet() {
  return (
    <View
      style={{
        width: 5,
        height: 5,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: Colors.blue,
        alignSelf: "center",
      }}
    />
  );
}
