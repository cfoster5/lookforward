import Ionicons from "@expo/vector-icons/build/Ionicons";
import { PlatformColor, View, Text } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";
import { iOSUIKit } from "react-native-typography";
// import Ionicons from "react-native-vector-icons/Ionicons";

type RowProps = {
  icon: string;
  title: string;
  body: string;
  useAltIcon?: boolean;
};

export const Row = ({ icon, title, body, useAltIcon }: RowProps) => (
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
      <SFSymbol
        name={icon}
        size={36}
        color={PlatformColor("systemBlue")}
        resizeMode="center"
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
  </View>
);
