import { Color } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ComponentRef, forwardRef } from "react";
import { usePostHog } from "posthog-react-native";
import { Pressable, View, Text, PressableProps } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { MovieWithMediaType } from "tmdb-ts";

import { useLimitHitOffering, useProOfferings } from "@/api/getProOfferings";
import { ContextMenuLink } from "@/components/ContextMenuLink";
import { calculateWidth, handleMovieToggle } from "@/helpers/helpers";
import {
  useAppConfigStore,
  useAuthStore,
  useSubscriptionStore,
} from "@/stores";
import { dateToFullLocale } from "@/utils/dates";
import { tryRequestReview } from "@/utils/requestReview";
import { onShare } from "@/utils/share";

type ResultProps = PressableProps &
  Pick<Parameters<typeof SearchMovie>[0], "item">;

const Result = forwardRef<ComponentRef<typeof Pressable>, ResultProps>(
  ({ item, ...rest }, ref) => (
    <Pressable
      ref={ref}
      {...rest} // Apply props before custom ones to allow overrides
      // https://github.com/dominicstop/react-native-ios-context-menu/issues/9#issuecomment-1047058781
      delayLongPress={100} // Leave room for a user to be able to click
      onLongPress={() => {}} // A callback that does nothing
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
              borderColor: Color.ios.separator,
            }}
          />
        ) : (
          <View
            style={{
              backgroundColor: Color.ios.systemGray,
              aspectRatio: 2 / 3,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Color.ios.separator,
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
          style={[iOSUIKit.body, { color: Color.ios.label }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[iOSUIKit.subhead, { color: Color.ios.secondaryLabel }]}
          numberOfLines={2}
        >
          {dateToFullLocale(item.release_date)}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={28}
        style={{ marginRight: 12 }}
        color={Color.ios.tertiaryLabel}
      />
    </Pressable>
  ),
);

Result.displayName = "Result";

export function SearchMovie({ item }: { item: MovieWithMediaType }) {
  const { user, isPro } = useAuthStore();
  const { movieSubs, hasReachedLimit } = useSubscriptionStore();
  const { data: pro } = useProOfferings();
  const { data: limitHit } = useLimitHitOffering();
  const { incrementSearchCount } = useAppConfigStore();
  const posthog = usePostHog();

  const isMovieSub = () =>
    Boolean(
      item.id && movieSubs.some((sub) => sub.documentID === item.id.toString()),
    );

  const handlePress = () => {
    incrementSearchCount();
    tryRequestReview();
  };

  return (
    <ContextMenuLink
      href={{
        pathname: "/(tabs)/(find)/movie/[id]",
        params: {
          id: item.id,
          name: item.title,
        },
      }}
      onPress={handlePress}
      handleCountdownToggle={{
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
        buttonText: isMovieSub() ? "Remove from Countdown" : "Add to Countdown",
      }}
      handleShareSelect={() => onShare(`movie/${item.id}`, "search")}
    >
      <Result item={item} />
    </ContextMenuLink>
  );
}
