import { Pressable, StyleProp, Text, ViewStyle } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { colors } from "@/theme/colors";

type LargeFilledButtonProps = {
  disabled: boolean;
  style?: StyleProp<ViewStyle>;
  handlePress: () => void;
  text?: string;
  children?: JSX.Element;
};

export const LargeFilledButton = ({
  disabled,
  style,
  handlePress,
  text,
  children,
}: LargeFilledButtonProps) => (
  <Pressable
    style={({ pressed }) => [
      {
        backgroundColor: disabled
          ? colors.tertiarySystemFill
          : colors.systemBlue,
        width: "100%",
        paddingVertical: 16,
        borderRadius: 12,
        opacity: pressed ? 0.5 : 1,
      },
      style,
    ]}
    onPress={handlePress}
  >
    {text ? (
      <Text
        style={[
          iOSUIKit.bodyEmphasized,
          {
            color: disabled ? colors.tertiaryLabel : colors.label,
            textAlign: "center",
          },
        ]}
      >
        {text}
      </Text>
    ) : (
      children
    )}
  </Pressable>
);
