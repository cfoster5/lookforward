import * as Colors from "@bacons/apple-colors";
import { Pressable, StyleProp, Text, ViewStyle } from "react-native";
import { iOSUIKit } from "react-native-typography";

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
          ? Colors.tertiarySystemFillColor
          : Colors.systemBlue,
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
            color: disabled ? Colors.tertiaryLabel : Colors.label,
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
