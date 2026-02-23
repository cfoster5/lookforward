import { Image, type ImageProps } from "expo-image";
import { Color } from "expo-router";
import { View, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

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
      tintColor={Color.ios.systemBlue as string}
    />
    <View style={{ flex: 1, alignItems: "flex-start" }}>
      <Text style={[iOSUIKit.bodyEmphasized, { color: Color.ios.label }]}>
        {title}
      </Text>
      <Text style={[iOSUIKit.body, { color: Color.ios.secondaryLabel }]}>
        {body}
      </Text>
    </View>
    {showDrillIn && (
      <Image
        source="sf:chevron.forward"
        style={{
          aspectRatio: 1,
          height: iOSUIKit.bodyObject.fontSize,
        }}
        tintColor={Color.ios.secondaryLabel as string}
      />
    )}
  </View>
);
