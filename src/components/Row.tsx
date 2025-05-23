import Ionicons from "@expo/vector-icons/build/Ionicons";
import { SFSymbol, SymbolView } from "expo-symbols";
import { PlatformColor, View, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

type IconProps = {
  icon: keyof (typeof Ionicons)["glyphMap"];
  useAltIcon: undefined;
};

type AltIconProps = {
  icon: SFSymbol;
  useAltIcon: true;
};

type RowProps = (AltIconProps | IconProps) & {
  title: string;
  body: string;
  showDrillIn?: boolean;
};

export const Row = ({
  icon,
  title,
  body,
  useAltIcon,
  showDrillIn,
}: RowProps) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
    }}
  >
    {!useAltIcon ? (
      <Ionicons name={icon} size={36} color={PlatformColor("systemBlue")} />
    ) : (
      <SymbolView
        name={icon}
        size={36}
        tintColor={PlatformColor("systemBlue")}
        resizeMode="scaleAspectFit"
        style={{ height: 36, width: 36 }}
      />
    )}
    <View style={{ paddingLeft: 16, flex: 1, alignItems: "flex-start" }}>
      <Text
        style={[iOSUIKit.bodyEmphasized, { color: PlatformColor("label") }]}
      >
        {title}
      </Text>
      <Text style={[iOSUIKit.body, { color: PlatformColor("secondaryLabel") }]}>
        {body}
      </Text>
    </View>
    {showDrillIn && (
      <Ionicons
        name="chevron-forward"
        size={iOSUIKit.bodyObject.lineHeight}
        color={PlatformColor("secondaryLabel")}
        style={{ paddingLeft: 8 }}
      />
    )}
  </View>
);
