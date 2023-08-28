import { PlatformColor, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

export function DiscoverListLabel({ text }: { text: string }) {
  return (
    <Text
      style={[
        iOSUIKit.subheadEmphasized,
        {
          color: PlatformColor("secondaryLabel"),
          textAlign: "center",
          marginTop: 16,
        },
      ]}
    >
      {text}
    </Text>
  );
}
