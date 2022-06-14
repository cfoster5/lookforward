import React from "react";
import { ActivityIndicator, useWindowDimensions, View } from "react-native";

export function LoadingScreen() {
  const { width, height } = useWindowDimensions();
  return (
    <View
      style={{
        position: "absolute",
        top: height / 2 - 36 / 2,
        left: width / 2 - 36 / 2,
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}
