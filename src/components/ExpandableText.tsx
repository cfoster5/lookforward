import { Pressable } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { Text as ThemedText } from "./Themed";

export function ExpandableText({
  handlePress,
  isExpanded,
  text,
}: {
  handlePress: () => void;
  isExpanded: boolean;
  text: string;
}) {
  return (
    <Pressable onPress={handlePress}>
      <ThemedText
        style={[iOSUIKit.body, { paddingTop: 16 }]}
        numberOfLines={isExpanded ? undefined : 4}
      >
        {text}
      </ThemedText>
    </Pressable>
  );
}
