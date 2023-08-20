import {
  PlatformColor,
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
import { iOSUIKit } from "react-native-typography";

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
    style={[
      {
        minHeight: 44,
        minWidth: 44,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingVertical: 16,
        borderRadius: 12,
      },
      style,
    ]}
    onPress={handlePress}
  >
    <Text
      style={[iOSUIKit.bodyEmphasized, { color: PlatformColor("systemBlue") }]}
    >
      {text}
    </Text>
  </Pressable>
);
