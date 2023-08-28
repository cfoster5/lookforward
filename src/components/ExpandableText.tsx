import { useState } from "react";
import { Pressable, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { Colors } from "@/constants/Colors";

export function ExpandableText({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Pressable onPress={() => setIsExpanded(!isExpanded)}>
      <Text
        style={[iOSUIKit.body, { color: Colors.label, paddingTop: 16 }]}
        numberOfLines={isExpanded ? undefined : 3}
      >
        {text}
      </Text>
    </Pressable>
  );
}
