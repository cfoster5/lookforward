import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { iOSUIKit } from "react-native-typography";
import * as Colors from "@bacons/apple-colors";

type ButtonProps = PressableProps & {
  text: string;
  isFirstInGroup: boolean;
};

export const SettingNavButton = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  ButtonProps
>(({ text, isFirstInGroup, ...rest }, ref) => {
  return (
    <Pressable
      ref={ref}
      {...rest}
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && styles.pressed,
        isFirstInGroup && styles.firstInGroup,
      ]}
    >
      <View style={[styles.button, { justifyContent: "space-between" }]}>
        <Text style={iOSUIKit.bodyWhite}>{text}</Text>
        <Ionicons
          name="chevron-forward"
          color={Colors.systemGray}
          size={iOSUIKit.bodyObject.fontSize}
          style={{ alignSelf: "center" }}
        />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Colors.systemGray6,
    alignItems: "center",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    borderColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  firstInGroup: { marginTop: 32 },
  pressed: { backgroundColor: Colors.systemGray5 },
});

SettingNavButton.displayName = "SettingNavButton";
