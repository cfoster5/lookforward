import { PlatformColor, Pressable, View, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { iOSUIKit } from "react-native-typography";
import { MovieWithMediaType } from "tmdb-ts";

import { calculateWidth } from "@/helpers/helpers";

export function SearchMovie({ item }: { item: MovieWithMediaType }) {
  return (
    <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          // Extracted from Figma, decide to keep or not
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowRadius: 4,
          shadowColor: "rgba(0, 0, 0, 0.15)",
          shadowOpacity: 1,
        }}
      >
        {item.poster_path ? (
          <FastImage
            source={{
              uri: `https://image.tmdb.org/t/p/w300${item.poster_path}`,
            }}
            style={{
              aspectRatio: 2 / 3,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: 8,
            }}
          />
        ) : (
          <View
            style={{
              backgroundColor: PlatformColor("systemGray"),
              aspectRatio: 2 / 3,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={[iOSUIKit.bodyWhite, { textAlign: "center" }]}>
              {item.title}
            </Text>
          </View>
        )}
      </View>
      <Text
        style={[
          iOSUIKit.subhead,
          {
            color: PlatformColor("label"),
            textAlign: "center",
            marginLeft: 12,
          },
        ]}
        numberOfLines={2}
      >
        {item.title}
      </Text>
    </Pressable>
  );
}
