import { getAnalytics } from "@react-native-firebase/analytics";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { PlatformColor, Pressable, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { calculateWidth } from "@/helpers/helpers";
import { useCountdownLimit } from "@/hooks/useCountdownLimit";
import { useRecentItemsStore } from "@/stores/recents";
import { useStore } from "@/stores/store";
import { Recent } from "@/types";
import { timestamp } from "@/utils/dates";
import { onShare } from "@/utils/share";

import { addCountdownItem, removeCountdownItem } from "../../utils/firestore";

import { ContextMenu } from "./ContextMenu";

export function RecentTitle({ item }: { item: Recent }) {
  // https://github.com/react-navigation/react-navigation/issues/9037#issuecomment-735698288
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { user, movieSubs, isPro, proModalRef } = useStore();
  const { addRecent, removeRecent } = useRecentItemsStore();
  const checkLimit = useCountdownLimit();

  const isMovieSub = () =>
    item.id && movieSubs.some((sub) => sub.documentID === item.id.toString());

  if (!isPro)
    return (
      <Pressable
        onPress={() => {
          proModalRef.current?.present();
          getAnalytics().logEvent("select_promotion", {
            name: "Pro",
            id: "com.lookforward.pro",
          });
        }}
        style={{ paddingVertical: 8 }}
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
          <BlurView
            intensity={50}
            tint="systemChromeMaterial"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 12,
              overflow: "hidden",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <SymbolView
                name="lock"
                size={36}
                tintColor={PlatformColor("label")}
                resizeMode="scaleAspectFit"
                style={{
                  height: 36,
                  width: 36,
                  // position: "absolute",
                }}
              />
              <Text style={[iOSUIKit.bodyWhite, { textAlign: "center" }]}>
                Get Pro
              </Text>
            </View>
          </BlurView>
        </View>
        <View style={{ alignItems: "center" }}>
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
          <BlurView
            intensity={50}
            tint="systemChromeMaterial"
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 12,
                overflow: "hidden",
                // maxWidth: 96,
              },
            ]}
          />
        </View>
      </Pressable>
    );

  return (
    <ContextMenu
      handleCountdownToggle={
        item.media_type === "movie"
          ? {
              action: () =>
                isMovieSub()
                  ? removeCountdownItem("movies", item.id, user!)
                  : addCountdownItem({
                      collection: "movies",
                      id: item.id,
                      user: user!,
                      limitCheckCallback: () => checkLimit("movies"),
                    }),
              buttonText: isMovieSub() ? "Remove from Pins" : "Add to Pins",
            }
          : undefined
      }
      handleShareSelect={
        item.media_type === "movie"
          ? () => onShare(`movie/${item.id}?name=${item.name}`, "recent")
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
            ? (navigation.navigate("Movie", {
                movieId: item.id,
                name: item.name,
              }),
              addRecent("recentMovies", {
                id: item.id,
                name: item.name,
                img_path: item.img_path,
                last_viewed: timestamp,
                media_type: "movie",
              }))
            : (navigation.navigate("Game", {
                game: {
                  id: item.id,
                  name: item.name,
                  cover: { url: item.img_path },
                },
              }),
              addRecent("recentGames", {
                id: item.id,
                name: item.name,
                img_path: item.img_path,
                last_viewed: timestamp,
                media_type: "game",
              }))
        }
        // https://github.com/dominicstop/react-native-ios-context-menu/issues/9#issuecomment-1047058781
        delayLongPress={100} // Leave room for a user to be able to click
        onLongPress={() => {}} // A callback that does nothing
        style={{ paddingVertical: 8 }}
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
              alignSelf: "center",
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
