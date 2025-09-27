import * as Colors from "@bacons/apple-colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, View, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { calculateWidth, getGameReleaseDate } from "@/helpers/helpers";
import { Game, ReleaseDate } from "@/types";

export function SearchGame({
  item,
}: {
  item: Game & { release_dates: ReleaseDate[] };
}) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: "/(tabs)/(find)/game/[id]",
          params: { id: item.id, game: JSON.stringify(item) },
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
          backgroundColor: Colors.tertiarySystemBackground,
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
        {item.cover?.url ? (
          <Image
            source={{
              uri: `https:${item.cover.url.replace("thumb", "cover_big_2x")}`,
            }}
            style={{
              aspectRatio: 3 / 4,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.separator,
            }}
          />
        ) : (
          <View
            style={{
              backgroundColor: Colors.systemGray,
              aspectRatio: 3 / 4,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.separator,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={[iOSUIKit.bodyWhite, { textAlign: "center" }]}>
              {item.name}
            </Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text
          style={[iOSUIKit.body, { color: Colors.label }]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <Text
          style={[iOSUIKit.subhead, { color: Colors.secondaryLabel }]}
          numberOfLines={2}
        >
          {getGameReleaseDate(item)}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={28}
        style={{ marginRight: 12 }}
        color={Colors.tertiaryLabel}
      />
    </Pressable>
  );
}
