import { Color } from "expo-router";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { usePostHog } from "posthog-react-native";
import { Pressable, Text, View } from "react-native";
import RevenueCatUI from "react-native-purchases-ui";
import { iOSUIKit } from "react-native-typography";

import { useLimitHitOffering, useProOfferings } from "@/api/getProOfferings";
import { ContextMenuLink } from "@/components/ContextMenuLink";
import { calculateWidth, handleMovieToggle } from "@/helpers/helpers";
import { useAuthStore, useSubscriptionStore } from "@/stores";
import { useRecentItemsStore } from "@/stores/recents";
import { Recent } from "@/types";
import { onShare } from "@/utils/share";

export function RecentTitle({ item }: { item: Recent }) {
  const { user, isPro } = useAuthStore();
  const { movieSubs, hasReachedLimit } = useSubscriptionStore();
  const { data: pro } = useProOfferings();
  const { data: limitHit } = useLimitHitOffering();
  const { removeRecent } = useRecentItemsStore();
  const posthog = usePostHog();

  const isMovieSub = () =>
    item.id && movieSubs.some((sub) => sub.documentID === item.id.toString());

  if (!isPro)
    return (
      <Pressable
        onPress={async () => {
          posthog.capture("recent_title:paywall_view", { type: "pro" });
          await RevenueCatUI.presentPaywall({ offering: pro });
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
                borderColor: Color.ios.separator,
                marginBottom: 8,
              }}
            />
          ) : (
            <View
              style={{
                backgroundColor: Color.ios.systemGray,
                aspectRatio: item.media_type === "movie" ? 2 / 3 : 3 / 4,
                width: calculateWidth(12, 12, 3.5),
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Color.ios.separator,
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
                tintColor={Color.ios.label}
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
                color: Color.ios.label,
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
    <ContextMenuLink
      href={
        item.media_type === "movie"
          ? {
              pathname: "/(tabs)/(find)/movie/[id]",
              params: {
                id: item.id,
                name: item.name,
              },
            }
          : {
              pathname: "/(tabs)/(find)/game/[id]",
              params: {
                id: item.id,
                game: JSON.stringify({
                  id: item.id,
                  name: item.name,
                  cover: { url: item.img_path },
                }),
              },
            }
      }
      handleCountdownToggle={
        item.media_type === "movie"
          ? {
              action: () =>
                handleMovieToggle({
                  movieId: item.id.toString(),
                  userId: user!.uid,
                  isCurrentlySubbed: isMovieSub(),
                  isPro,
                  hasReachedLimit,
                  proOffering: limitHit ?? pro,
                  onLimitPaywallView: limitHit
                    ? () => posthog.capture("limit:paywall_view")
                    : undefined,
                  onLimitPaywallDismiss: limitHit
                    ? () => posthog.capture("limit:paywall_dismiss")
                    : undefined,
                }),
              buttonText: isMovieSub()
                ? "Remove from Countdown"
                : "Add to Countdown",
            }
          : undefined
      }
      handleShareSelect={
        item.media_type === "movie"
          ? () => onShare(`movie/${item.id}`, "recent", posthog)
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
                borderColor: Color.ios.separator,
                marginBottom: 8,
              }}
            />
          ) : (
            <View
              style={{
                backgroundColor: Color.ios.systemGray,
                aspectRatio: item.media_type === "movie" ? 2 / 3 : 3 / 4,
                width: calculateWidth(12, 12, 3.5),
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Color.ios.separator,
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
              color: Color.ios.label,
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
    </ContextMenuLink>
  );
}
