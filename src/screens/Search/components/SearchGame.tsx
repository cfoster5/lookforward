import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Color, useRouter } from "expo-router";
import { Pressable, View, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { calculateWidth, getGameReleaseDate } from "@/helpers/helpers";
import { useAppConfigStore } from "@/stores/appConfig";
import { Games, ReleaseDate } from "@/types/igdb";
import { tryRequestReview } from "@/utils/requestReview";

export function SearchGame({
  item,
}: {
  item: Games & { release_dates: ReleaseDate[] };
}) {
  const router = useRouter();
  const { incrementSearchCount } = useAppConfigStore();

  const handlePress = () => {
    incrementSearchCount();
    tryRequestReview();
    router.navigate({
      pathname: "/(tabs)/(find)/game/[id]",
      params: { id: item.id?.toString() ?? "", game: JSON.stringify(item) },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 12,
        },
        pressed && {
          backgroundColor: Color.ios.tertiarySystemBackground,
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
              borderColor: Color.ios.separator,
            }}
          />
        ) : (
          <View
            style={{
              backgroundColor: Color.ios.systemGray,
              aspectRatio: 3 / 4,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Color.ios.separator,
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
          style={[iOSUIKit.body, { color: Color.ios.label }]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <Text
          style={[iOSUIKit.subhead, { color: Color.ios.secondaryLabel }]}
          numberOfLines={2}
        >
          {getGameReleaseDate(item)}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={28}
        style={{ marginRight: 12 }}
        color={Color.ios.tertiaryLabel}
      />
    </Pressable>
  );
}
