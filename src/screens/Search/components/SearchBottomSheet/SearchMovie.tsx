import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image } from "expo-image";
import { PlatformColor, Pressable, View, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { MovieWithMediaType } from "tmdb-ts";

import { calculateWidth } from "@/helpers/helpers";
import { useStore } from "@/stores/store";
import { dateToFullLocale } from "@/utils/dates";
import { onShare } from "@/utils/share";

import { addCountdownItem, removeCountdownItem } from "../../utils/firestore";

import { ContextMenu } from "./ContextMenu";

export function SearchMovie({ item }: { item: MovieWithMediaType }) {
  // https://github.com/react-navigation/react-navigation/issues/9037#issuecomment-735698288
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { user, movieSubs } = useStore();

  const isMovieSub = () =>
    item.id && movieSubs.some((sub) => sub.documentID === item.id.toString());

  return (
    <ContextMenu
      handleCountdownToggle={{
        action: () =>
          isMovieSub()
            ? removeCountdownItem("movies", item.id, user)
            : addCountdownItem("movies", item.id, user),
        buttonText: isMovieSub() ? "Remove from Countdown" : "Add to Countdown",
      }}
      handleShareSelect={() =>
        onShare(item.title, `movie/${item.id}?name=${item.title}`)
      }
    >
      <Pressable
        onPress={() =>
          navigation.navigate("Movie", {
            movieId: item.id,
            name: item.title,
          })
        }
        // https://github.com/dominicstop/react-native-ios-context-menu/issues/9#issuecomment-1047058781
        delayLongPress={100} // Leave room for a user to be able to click
        onLongPress={() => console.log("Long Pressed")}
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
            style={[
              iOSUIKit.subhead,
              { color: PlatformColor("secondaryLabel") },
            ]}
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
    </ContextMenu>
  );
}
