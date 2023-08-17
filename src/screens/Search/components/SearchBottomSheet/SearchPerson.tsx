import { PlatformColor, Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { iOSUIKit } from "react-native-typography";
import { PersonWithMediaType } from "tmdb-ts";

import { calculateWidth } from "@/helpers/helpers";

export function SearchPerson({ item }: { item: PersonWithMediaType }) {
  return (
    <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        // Extracted from Figma, decide to keep or not
        style={{
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowRadius: 4,
          shadowColor: "rgba(0, 0, 0, 0.15)",
          shadowOpacity: 1,
        }}
      >
        {item.profile_path ? (
          <FastImage
            source={{
              uri: `https://image.tmdb.org/t/p/w300${item.profile_path}`,
            }}
            style={{
              aspectRatio: 1,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: calculateWidth(12, 12, 3.5),
              marginBottom: 8,
            }}
          />
        ) : (
          <View
            style={{
              backgroundColor: PlatformColor("systemGray"),
              aspectRatio: 1,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: calculateWidth(12, 12, 3.5),
              marginBottom: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: calculateWidth(12, 12, 3.5) / 2,
                color: "white",
              }}
            >
              RP
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
        {item.name}
      </Text>
    </Pressable>
  );
}
