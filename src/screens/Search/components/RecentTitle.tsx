import { BlurTargetView, BlurView } from "expo-blur";
import { Image } from "expo-image";
import { usePostHog } from "posthog-react-native";
import { useRef } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import RevenueCatUI from "react-native-purchases-ui";
import { iOSUIKit } from "react-native-typography";

import { useLimitHitOffering, useProOfferings } from "@/api/getProOfferings";
import { ContextMenuLink } from "@/components/ContextMenuLink";
import { IconSymbol } from "@/components/IconSymbol";
import { calculateWidth, handleMovieToggle } from "@/helpers/helpers";
import { useAuthStore, useSubscriptionStore } from "@/stores";
import { useRecentItemsStore } from "@/stores/recents";
import { colors } from "@/theme/colors";
import { Recent } from "@/types";
import { onShare } from "@/utils/share";

export function RecentTitle({ item }: { item: Recent }) {
  const { user, isPro } = useAuthStore();
  const { movieSubs, hasReachedLimit } = useSubscriptionStore();
  const { data: pro } = useProOfferings();
  const { data: limitHit } = useLimitHitOffering();
  const { removeRecent } = useRecentItemsStore();
  const posthog = usePostHog();
  const blurTargetRef = useRef<View | null>(null);
  const textBlurTargetRef = useRef<View | null>(null);

  const isMovieSub = () =>
    item.id && movieSubs.some((sub) => sub.documentID === item.id.toString());

  const imageSource = item.img_path
    ? {
        uri:
          item.media_type === "movie"
            ? `https://image.tmdb.org/t/p/w300${item.img_path}`
            : `https:${item.img_path.replace("thumb", "cover_big_2x")}`,
      }
    : undefined;

  const imageStyle = {
    aspectRatio: item.media_type === "movie" ? 2 / 3 : 3 / 4,
    width: calculateWidth(12, 12, 3.5),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.separator,
    marginBottom: 8,
  };

  const placeholderStyle = {
    backgroundColor: colors.systemGray,
    aspectRatio: item.media_type === "movie" ? 2 / 3 : 3 / 4,
    width: calculateWidth(12, 12, 3.5),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.separator,
    marginBottom: 8,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  };

  const lockIcon =
    Platform.OS === "ios" ? (
      <Image
        source="sf:lock"
        style={{ aspectRatio: 1, height: 36 }}
        tintColor={"white"}
      />
    ) : (
      <IconSymbol name="lock" size={36} color="white" />
    );

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
          <BlurTargetView ref={blurTargetRef}>
            {imageSource ? (
              <Image source={imageSource} style={imageStyle} />
            ) : (
              <View style={placeholderStyle}>
                <Text style={[iOSUIKit.bodyWhite, { textAlign: "center" }]}>
                  {item.name}
                </Text>
              </View>
            )}
          </BlurTargetView>
          <BlurView
            blurTarget={blurTargetRef}
            blurMethod="dimezisBlurView"
            intensity={Platform.OS === "ios" ? 50 : 30}
            tint={Platform.OS === "ios" ? "systemChromeMaterial" : "dark"}
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
              {lockIcon}
              <Text style={[iOSUIKit.bodyWhite, { textAlign: "center" }]}>
                Get Pro
              </Text>
            </View>
          </BlurView>
        </View>
        <View style={{ alignItems: "center" }}>
          <BlurTargetView ref={textBlurTargetRef}>
            <Text
              style={[
                iOSUIKit.subhead,
                {
                  color: colors.label,
                  maxWidth: 96,
                  textAlign: "center",
                },
              ]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
          </BlurTargetView>
          <BlurView
            blurTarget={textBlurTargetRef}
            blurMethod="dimezisBlurView"
            intensity={Platform.OS === "ios" ? 50 : 30}
            tint={Platform.OS === "ios" ? "systemChromeMaterial" : "dark"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 12,
              overflow: "hidden",
            }}
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
          {imageSource ? (
            <Image source={imageSource} style={imageStyle} />
          ) : (
            <View style={placeholderStyle}>
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
              color: colors.label,
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
