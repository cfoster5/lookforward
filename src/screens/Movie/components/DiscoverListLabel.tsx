import { Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { colors } from "@/theme/colors";

export function DiscoverListLabel({ text }: { text: string }) {
  return (
    <Text
      style={[
        iOSUIKit.subheadEmphasized,
        {
          color: colors.secondaryLabel,
          textAlign: "center",
          marginTop: 16,
        },
      ]}
    >
      {text}
    </Text>
  );
}
