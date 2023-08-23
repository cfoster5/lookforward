import { useState } from "react";
import { Pressable } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { Text as ThemedText } from "./Themed";

export function ExpandableText({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Pressable onPress={() => setIsExpanded(!isExpanded)}>
      <ThemedText
        style={[iOSUIKit.body, { paddingTop: 16 }]}
        numberOfLines={isExpanded ? undefined : 3}
      >
        {text}
      </ThemedText>
    </Pressable>
  );
}
