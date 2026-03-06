import { StyleProp, Text, View, ViewStyle } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { colors } from "@/theme/colors";

import { reusableStyles } from "../../helpers/styles";

export const PosterFallback = ({
  text,
  style,
}: {
  text: string;
  style?: StyleProp<ViewStyle>;
}) => (
  <View
    style={[
      reusableStyles.gamePoster,
      {
        // borderWidth: 1,
        borderColor: colors.separator,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: 3 / 4,
        padding: 16,
      },
      style,
    ]}
  >
    <Text
      style={[
        iOSUIKit.title3Emphasized,
        { color: colors.label, textAlign: "center" },
      ]}
    >
      {text}
    </Text>
  </View>
);
