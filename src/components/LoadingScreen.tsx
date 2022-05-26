import React from "react";
import { ActivityIndicator, View } from "react-native";

export function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
