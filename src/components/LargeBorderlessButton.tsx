import { Pressable, StyleProp, Text, ViewStyle } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { Colors } from "@/constants/Colors";

type LargeBorderlessButtonProps = {
  style?: StyleProp<ViewStyle>;
  handlePress: () => void;
  text: string;
};

export const LargeBorderlessButton = ({
  style,
  handlePress,
  text,
}: LargeBorderlessButtonProps) => (
  <Pressable
    style={({ pressed }) => [
      {
        minHeight: 44,
        minWidth: 44,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingVertical: 16,
        borderRadius: 12,
        opacity: pressed ? 0.5 : 1,
      },
      style,
    ]}
    onPress={handlePress}
  >
    <Text style={[iOSUIKit.bodyEmphasized, { color: Colors.blue }]}>
      {text}
    </Text>
  </Pressable>
);
