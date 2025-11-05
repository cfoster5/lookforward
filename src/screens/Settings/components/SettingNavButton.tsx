import * as Colors from "@bacons/apple-colors";
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

type ButtonProps = PressableProps & {
  text: string;
  isFirstInGroup?: boolean;
};

export const SettingNavButton = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  ButtonProps
>(({ text, isFirstInGroup = false, style, ...rest }, ref) => {
  return (
    <Pressable
      ref={ref}
      {...rest}
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && styles.pressed,
        isFirstInGroup && styles.firstInGroup,
        style,
      ]}
    >
      <View style={[styles.button, { justifyContent: "space-between" }]}>
        <Text style={[iOSUIKit.body, { color: Colors.label }]}>{text}</Text>
        <Ionicons
          name="chevron-forward"
          color={Colors.tertiaryLabel}
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
    backgroundColor: Colors.secondarySystemGroupedBackground,
    alignItems: "center",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
  },
  firstInGroup: { marginTop: 32 },
  pressed: { backgroundColor: Colors.tertiarySystemGroupedBackground },
});

SettingNavButton.displayName = "SettingNavButton";
