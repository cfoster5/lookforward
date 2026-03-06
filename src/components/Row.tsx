import { Image, type ImageProps } from "expo-image";
import { Platform, View, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { colors } from "@/theme/colors";

import { IconSymbol } from "./IconSymbol";

type RowProps = {
  icon: NonNullable<ImageProps["source"]>;
  title: string;
  body: string;
  showDrillIn?: boolean;
};

export const Row = ({ icon, title, body, showDrillIn }: RowProps) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
    <Image
      source={icon}
      style={{ aspectRatio: 1, height: 36 }}
      tintColor={colors.systemBlue as string}
    />
    <View style={{ flex: 1, alignItems: "flex-start" }}>
      <Text style={[iOSUIKit.bodyEmphasized, { color: colors.label }]}>
        {title}
      </Text>
      <Text style={[iOSUIKit.body, { color: colors.secondaryLabel }]}>
        {body}
      </Text>
    </View>
    {showDrillIn &&
      (Platform.OS === "ios" ? (
        <Image
          source="sf:chevron.forward"
          style={{
            aspectRatio: 1,
            height: iOSUIKit.bodyObject.fontSize,
          }}
          tintColor={colors.secondaryLabel as string}
        />
      ) : (
        <IconSymbol
          name="chevron.right"
          size={iOSUIKit.bodyObject.fontSize}
          color={colors.secondaryLabel as string}
        />
      ))}
  </View>
);
