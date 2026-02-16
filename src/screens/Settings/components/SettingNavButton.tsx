import { Color } from "expo-router";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { iOSUIKit } from "react-native-typography";

import { IconSymbol } from "@/components/IconSymbol";

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
        <Text style={[iOSUIKit.body, { color: Color.ios.label }]}>{text}</Text>
        <IconSymbol
          color={Color.ios.tertiaryLabel as string}
          name="chevron.forward"
          size={iOSUIKit.bodyObject.fontSize}
          weight="semibold"
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
    backgroundColor: Color.ios.secondarySystemGroupedBackground,
    alignItems: "center",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
  },
  firstInGroup: { marginTop: 32 },
  pressed: { backgroundColor: Color.ios.tertiarySystemGroupedBackground },
});

SettingNavButton.displayName = "SettingNavButton";
