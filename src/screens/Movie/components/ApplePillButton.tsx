import { Color } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, Text, ViewStyle } from "react-native";
import { iOSUIKit } from "react-native-typography";

type ApplePillButtonProps = {
  text?: string;
  iconName?: string;
  style?: ViewStyle;
};

export const ApplePillButton = ({
  text,
  iconName,
  style,
}: ApplePillButtonProps) => (
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
      },
      style,
    ]}
  >
    {text && (
      <Text style={[iOSUIKit.bodyEmphasized, { color: Color.ios.systemBlue }]}>
        {text}
      </Text>
    )}
    {iconName && (
      // <Ionicons name={iconName} size={36} color={Color.ios.systemBlue} />
      <SymbolView
        name={iconName}
        tintColor={Color.ios.systemBlue}
        resizeMode="scaleAspectFill"
        style={{ marginRight: 4 }}
      />
    )}
    <SymbolView
      name="chevron.down"
      weight={"semibold"}
      // size={iOSUIKit.bodyObject.lineHeight}
      resizeMode="center"
      tintColor={Color.ios.systemBlue}
    />
  </Pressable>
);
