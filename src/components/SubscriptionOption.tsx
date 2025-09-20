import {
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
import { iOSUIKit } from "react-native-typography";
import * as Colors from "@bacons/apple-colors";

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
        backgroundColor: Colors.tertiarySystemBackground,
        width: "100%",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderColor: isSelected ? Colors.systemBlue : "transparent",
        borderWidth: 1,
      },
      style,
    ]}
  >
    <Text style={[iOSUIKit.bodyEmphasized, { color: Colors.label }]}>
      {text}
    </Text>
    {/* {isSelected && (
      <Ionicons
        name="checkmark-circle"
        color={Colors.systemBlue}
        size={iOSUIKit.bodyEmphasizedObject.lineHeight}
      />
    )} */}
  </Pressable>
);
