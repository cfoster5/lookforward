import React from "react";
import { Text } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

export function DiscoverListLabel({ text }: { text: string }) {
  return (
    <Text
      style={[
        iOSUIKit.subheadEmphasized,
        {
          color: iOSColors.gray,
          textAlign: "center",
          marginTop: 16,
        },
      ]}
    >
      {text}
    </Text>
  );
}
