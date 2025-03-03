import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { PlatformColor, Pressable, View, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { MovieWithMediaType } from "tmdb-ts";

import { calculateWidth } from "@/helpers/helpers";
import { dateToFullLocale } from "@/utils/dates";
import { useRouter } from "expo-router";

export function SearchMovie({ item }: { item: MovieWithMediaType }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: "/movie/[id]",
          params: { id: item?.id, name: item?.title },
        })
      }
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 12,
        },
        pressed && {
          backgroundColor: PlatformColor("tertiarySystemBackground"),
        },
      ]}
    >
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
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w300${item.poster_path}`,
            }}
            style={{
              aspectRatio: 2 / 3,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: 12,
              borderWidth: 1,
              borderColor: PlatformColor("separator"),
            }}
          />
        ) : (
          <View
            style={{
              backgroundColor: PlatformColor("systemGray"),
              aspectRatio: 2 / 3,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: 12,
              borderWidth: 1,
              borderColor: PlatformColor("separator"),
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
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text
          style={[iOSUIKit.body, { color: PlatformColor("label") }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[iOSUIKit.subhead, { color: PlatformColor("secondaryLabel") }]}
          numberOfLines={2}
        >
          {dateToFullLocale(item.release_date)}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={28}
        style={{ marginRight: 12 }}
        color={PlatformColor("tertiaryLabel")}
      />
    </Pressable>
  );
}
