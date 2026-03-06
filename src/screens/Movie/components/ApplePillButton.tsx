import { Image } from "expo-image";
import { Platform, Pressable, Text, ViewStyle } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/theme/colors";

type ApplePillButtonProps = {
  text: string;
  style?: ViewStyle;
};

export const ApplePillButton = ({ text, style }: ApplePillButtonProps) => (
  <Pressable
    // Style extracted from Figma
    style={[
      {
        flexDirection: "row",
        backgroundColor: colors.secondarySystemGroupedBackground,
        minWidth: 44,
        minHeight: 44,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 7,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start", // Added to ensure the button is no wider than necessary based on width of its content
        // Otherwise, it will take the full width of the screen
        // gap: 4,
        marginTop: 16,
        gap: 4,
      },
      style,
    ]}
  >
    <Text style={[iOSUIKit.bodyEmphasized, { color: colors.systemBlue }]}>
      {text}
    </Text>
    {Platform.OS === "ios" ? (
      <Image
        source="sf:chevron.down"
        style={{
          aspectRatio: 1,
          height: iOSUIKit.bodyEmphasizedObject.fontSize,
          fontWeight: "semibold",
          fontSize: iOSUIKit.bodyEmphasizedObject.fontSize,
        }}
        contentPosition="center"
        tintColor={colors.systemBlue as string}
      />
    ) : (
      <IconSymbol
        name="chevron.down"
        size={iOSUIKit.bodyEmphasizedObject.fontSize}
        color={colors.systemBlue as string}
      />
    )}
  </Pressable>
);
