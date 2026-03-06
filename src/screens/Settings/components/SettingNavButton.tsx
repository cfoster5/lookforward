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
import { colors } from "@/theme/colors";

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
        <Text style={[iOSUIKit.body, { color: colors.label }]}>{text}</Text>
        <IconSymbol
          color={colors.tertiaryLabel as string}
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
    backgroundColor: colors.secondarySystemGroupedBackground,
    alignItems: "center",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
  },
  firstInGroup: { marginTop: 32 },
  pressed: { backgroundColor: colors.tertiarySystemGroupedBackground },
});

SettingNavButton.displayName = "SettingNavButton";
