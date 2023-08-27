import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { iOSUIKit } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Colors } from "@/constants/Colors";

type Props = {
  handlePress: () => void;
  text: string;
  buttonStyle?: PressableProps["style"];
};

export const SettingNavButton = ({ handlePress, text, buttonStyle }: Props) => (
  <Pressable
    style={({ pressed }) => [
      styles.buttonContainer,
      pressed ? { backgroundColor: Colors.gray5 } : null,
      buttonStyle,
    ]}
    onPress={handlePress}
  >
    <View style={[styles.button, { justifyContent: "space-between" }]}>
      <Text style={iOSUIKit.bodyWhite}>{text}</Text>
      <Ionicons
        name="chevron-forward"
        color={Colors.gray}
        size={iOSUIKit.bodyObject.fontSize}
        style={{ alignSelf: "center" }}
      />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: Colors.gray6,
    alignItems: "center",
    marginTop: 32,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    borderColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
});
