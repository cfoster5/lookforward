import { SymbolView } from "expo-symbols";
import { PlatformColor, Pressable, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

export const ApplePillButton = ({ text }) => (
  <Pressable
    // Style extracted from Figma
    style={{
      flexDirection: "row",
      backgroundColor: PlatformColor("secondarySystemGroupedBackground"),
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
    }}
  >
    <Text
      style={[iOSUIKit.bodyEmphasized, { color: PlatformColor("systemBlue") }]}
    >
      {text}
    </Text>
    <SymbolView
      name="chevron.down"
      weight={"semibold"}
      // size={iOSUIKit.bodyObject.lineHeight}
      resizeMode="center"
      tintColor={PlatformColor("systemBlue")}
    />
  </Pressable>
);
