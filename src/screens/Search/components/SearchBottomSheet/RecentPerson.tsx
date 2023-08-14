import { Pressable, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { iOSUIKit } from "react-native-typography";

import { calculateWidth } from "@/helpers/helpers";

export function RecentPerson({ item }) {
  return (
    <Pressable>
      <FastImage
        source={{
          uri: `https://image.tmdb.org/t/p/w300${item.profile_path}`,
        }}
        style={{
          aspectRatio: 1,
          width: calculateWidth(12, 12, 3.5),
          // width: 96,
          // height: 96,
          // borderRadius: 96,
          borderRadius: calculateWidth(12, 12, 3.5),
          marginBottom: 8,
        }}
      />
      <Text
        style={[
          iOSUIKit.footnote,
          { color: "white", maxWidth: 96, textAlign: "center" },
        ]}
      >
        {item.name}
      </Text>
    </Pressable>
  );
}
