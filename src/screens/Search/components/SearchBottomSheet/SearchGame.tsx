import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image } from "expo-image";
import { PlatformColor, Pressable, View, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { calculateWidth, getGameReleaseDate } from "@/helpers/helpers";
import { Game, ReleaseDate } from "@/types";

export function SearchGame({
  item,
}: {
  item: Game & { release_dates: ReleaseDate[] };
}) {
  // https://github.com/react-navigation/react-navigation/issues/9037#issuecomment-735698288
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <Pressable
      onPress={() => navigation.navigate("Game", { game: item })}
      style={{ flexDirection: "row", alignItems: "center" }}
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
              borderRadius: 10,
            }}
          />
        ) : (
          <View
            style={{
              backgroundColor: PlatformColor("systemGray"),
              aspectRatio: 3 / 4,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: 10,
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
          style={[iOSUIKit.body, { color: PlatformColor("label") }]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <Text
          style={[iOSUIKit.subhead, { color: PlatformColor("secondaryLabel") }]}
          numberOfLines={2}
        >
          {getGameReleaseDate(item)}
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
