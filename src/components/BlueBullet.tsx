import { View } from "react-native";
import * as Colors from "@bacons/apple-colors";

export function BlueBullet() {
  return (
    <View
      style={{
        width: 5,
        height: 5,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: Colors.systemBlue,
        alignSelf: "center",
      }}
    />
  );
}
