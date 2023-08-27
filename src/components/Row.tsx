import Ionicons from "@expo/vector-icons/build/Ionicons";
import { PlatformColor, View, Text } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";
import { iOSUIKit } from "react-native-typography";

import { Colors } from "@/constants/Colors";

type RowProps = {
  icon: string;
  title: string;
  body: string;
  useAltIcon?: boolean;
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
      <Ionicons name={icon} size={36} color={Colors.blue} />
    ) : (
      <SFSymbol
        name={icon}
        size={36}
        color={Colors.blue}
        resizeMode="center"
        style={{ height: 36, width: 36 }}
      />
    )}
    <View style={{ paddingLeft: 16, flex: 1, alignItems: "flex-start" }}>
      <Text style={[iOSUIKit.bodyEmphasized, { color: Colors.label }]}>
        {title}
      </Text>
      <Text style={[iOSUIKit.body, { color: Colors.secondaryLabel }]}>
        {body}
      </Text>
    </View>
    {showDrillIn && (
      <Ionicons
        name="chevron-forward"
        size={iOSUIKit.bodyObject.lineHeight}
        color={Colors.secondaryLabel}
        style={{ paddingLeft: 8 }}
      />
    )}
  </View>
);
