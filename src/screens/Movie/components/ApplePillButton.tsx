import { Image } from "expo-image";
import { Color } from "expo-router";
import { Pressable, Text, ViewStyle } from "react-native";
import { iOSUIKit } from "react-native-typography";

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
        backgroundColor: Color.ios.secondarySystemGroupedBackground,
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
    <Text style={[iOSUIKit.bodyEmphasized, { color: Color.ios.systemBlue }]}>
      {text}
    </Text>
    <Image
      source="sf:chevron.down"
      style={{
        aspectRatio: 1,
        height: iOSUIKit.bodyEmphasizedObject.fontSize,
        fontWeight: "semibold",
        fontSize: iOSUIKit.bodyEmphasizedObject.fontSize,
      }}
      contentPosition="center"
      tintColor={Color.ios.systemBlue as string}
    />
  </Pressable>
);
