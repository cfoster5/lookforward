import { Color } from "expo-router";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { SFSymbol, SymbolView } from "expo-symbols";
import { View, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { IconSymbol } from "./IconSymbol";

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
      paddingVertical: 12,
    }}
  >
    {!useAltIcon ? (
      <Ionicons name={icon} size={36} color={Color.ios.systemBlue} />
    ) : (
      <IconSymbol
        name={icon}
        size={36}
        color={Color.ios.systemBlue as string}
      />
    )}
    <View style={{ paddingLeft: 16, flex: 1, alignItems: "flex-start" }}>
      <Text style={[iOSUIKit.bodyEmphasized, { color: Color.ios.label }]}>
        {title}
      </Text>
      <Text style={[iOSUIKit.body, { color: Color.ios.secondaryLabel }]}>
        {body}
      </Text>
    </View>
    {showDrillIn && (
      <Ionicons
        name="chevron-forward"
        size={iOSUIKit.bodyObject.lineHeight}
        color={Color.ios.secondaryLabel}
        style={{ paddingLeft: 8 }}
      />
    )}
  </View>
);
