import {
  PlatformColor,
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
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
    style={[
      {
        backgroundColor: disabled
          ? PlatformColor("tertiarySystemFillColor")
          : PlatformColor("systemBlue"),
        width: "100%",
        paddingVertical: 16,
        borderRadius: 12,
      },
      style,
    ]}
    onPress={handlePress}
  >
    <Text
      style={[
        iOSUIKit.bodyEmphasized,
        {
          color: disabled
            ? PlatformColor("tertiaryLabel")
            : PlatformColor("label"),
          textAlign: "center",
        },
      ]}
    >
      {text ?? children}
    </Text>
  </Pressable>
);
