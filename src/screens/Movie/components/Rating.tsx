import { PlatformColor, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

export const Rating = ({
  source,
  rating,
}: {
  source: string;
  rating: number;
}) => {
  return (
    <View>
      <Text style={[iOSUIKit.body, { color: PlatformColor("label") }]}>
        {source}
      </Text>
      <Text
        style={[
          iOSUIKit.subhead,
          { color: PlatformColor("secondaryLabel"), textAlign: "center" },
        ]}
      >
        {rating}
      </Text>
    </View>
  );
};
