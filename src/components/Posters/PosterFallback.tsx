import { Color } from "expo-router";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { iOSUIKit } from "react-native-typography";

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
        borderColor: Color.ios.separator,
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
        { color: Color.ios.label, textAlign: "center" },
      ]}
    >
      {text}
    </Text>
  </View>
);
