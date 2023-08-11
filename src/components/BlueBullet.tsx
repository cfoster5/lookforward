import { PlatformColor, View } from "react-native";

export function BlueBullet() {
  return (
    <View
      style={{
        width: 5,
        height: 5,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: PlatformColor("systemBlue"),
        alignSelf: "center",
      }}
    />
  );
}
