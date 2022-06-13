import React from "react";
import { Pressable } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { Text as ThemedText } from "./Themed";

export function ExpandableText({
  pressHandler,
  isExpanded,
  text,
}: {
  pressHandler: any;
  isExpanded: boolean;
  text: string;
}) {
  return (
    <Pressable onPress={pressHandler}>
      <ThemedText
        style={[iOSUIKit.body, { paddingTop: 16 }]}
        numberOfLines={isExpanded ? undefined : 4}
      >
        {text}
      </ThemedText>
    </Pressable>
  );
}
