import {
  PlatformColor,
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
import { iOSUIKit } from "react-native-typography";

type Props = {
  handlePress: () => void;
  text: string;
  isSelected: boolean;
  style: StyleProp<ViewStyle>;
};

export const SubscriptionOption = ({
  handlePress,
  text,
  isSelected,
  style,
}: Props) => (
  <Pressable
    onPress={handlePress}
    style={[
      {
        flex: 1,
        flexDirection: "row",
        // justifyContent: "space-between",
        justifyContent: "center",
        backgroundColor: PlatformColor("tertiarySystemBackground"),
        width: "100%",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderColor: isSelected ? PlatformColor("systemBlue") : "transparent",
        borderWidth: 1,
      },
      style,
    ]}
  >
    <Text style={[iOSUIKit.bodyEmphasized, { color: PlatformColor("label") }]}>
      {text}
    </Text>
    {/* {isSelected && (
      <Ionicons
        name="checkmark-circle"
        color={PlatformColor("systemBlue")}
        size={iOSUIKit.bodyEmphasizedObject.lineHeight}
      />
    )} */}
  </Pressable>
);
