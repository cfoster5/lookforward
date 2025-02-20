import Ionicons from "@expo/vector-icons/build/Ionicons";
import { PlatformColor, View, Text } from "react-native";
import { SymbolView, SFSymbol } from "expo-symbols";
import { iOSUIKit } from "react-native-typography";

type RowProps = {
  title: string;
  body: string;
  showDrillIn?: boolean;
} & (
  | {
      useAltIcon: true;
      icon: SFSymbol;
    }
  | {
      useAltIcon?: false;
      icon: string;
    }
);

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
        resizeMode="scaleAspectFill"
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
