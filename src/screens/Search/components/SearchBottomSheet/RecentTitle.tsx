import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image } from "expo-image";
import { PlatformColor, Pressable, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { calculateWidth } from "@/helpers/helpers";
import { useRecentItemsStore } from "@/stores/recents";
import { Recent } from "@/types";
import { onShare } from "@/utils/share";

import { ContextMenu } from "./ContextMenu";

export function RecentTitle({ item }: { item: Recent }) {
  // https://github.com/react-navigation/react-navigation/issues/9037#issuecomment-735698288
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { removeRecent } = useRecentItemsStore();

  return (
    <ContextMenu
      handleShareSelect={
        item.media_type === "movie"
          ? () => onShare(item.name, `movie/${item.id}?name=${item.name}`)
          : undefined
      }
      handleRemoveSelect={() =>
        removeRecent(
          item.media_type === "movie" ? "recentMovies" : "recentGames",
          item,
        )
      }
    >
      <Pressable
        onPress={() =>
          item.media_type === "movie"
            ? navigation.navigate("Movie", {
                movieId: item.id,
                name: item.name,
              })
            : navigation.navigate("Game", {
                game: {
                  id: item.id,
                  name: item.name,
                  cover: { url: item.img_path },
                },
              })
        }
        // https://github.com/dominicstop/react-native-ios-context-menu/issues/9#issuecomment-1047058781
        delayLongPress={100} // Leave room for a user to be able to click
        onLongPress={() => console.log("Long Pressed")}
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
          {item.img_path ? (
            <Image
              source={{
                uri:
                  item.media_type === "movie"
                    ? `https://image.tmdb.org/t/p/w300${item.img_path}`
                    : `https:${item.img_path.replace("thumb", "cover_big_2x")}`,
              }}
              style={{
                aspectRatio: item.media_type === "movie" ? 2 / 3 : 3 / 4,
                width: calculateWidth(12, 12, 3.5),
                borderRadius: 12,
                borderWidth: 1,
                borderColor: PlatformColor("separator"),
                marginBottom: 8,
              }}
            />
          ) : (
            <View
              style={{
                backgroundColor: PlatformColor("systemGray"),
                aspectRatio: item.media_type === "movie" ? 2 / 3 : 3 / 4,
                width: calculateWidth(12, 12, 3.5),
                borderRadius: 12,
                borderWidth: 1,
                borderColor: PlatformColor("separator"),
                marginBottom: 8,
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
        <Text
          style={[
            iOSUIKit.subhead,
            {
              color: PlatformColor("label"),
              maxWidth: 96,
              textAlign: "center",
            },
          ]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
      </Pressable>
    </ContextMenu>
  );
}
