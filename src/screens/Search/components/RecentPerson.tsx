import { BlurTargetView, BlurView } from "expo-blur";
import { Image } from "expo-image";
import { usePostHog } from "posthog-react-native";
import { useRef } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import RevenueCatUI from "react-native-purchases-ui";
import { iOSUIKit } from "react-native-typography";

import { useProOfferings } from "@/api/getProOfferings";
import { ContextMenuLink } from "@/components/ContextMenuLink";
import { IconSymbol } from "@/components/IconSymbol";
import { calculateWidth } from "@/helpers/helpers";
import { useAuthStore } from "@/stores";
import { useRecentItemsStore } from "@/stores/recents";
import { colors } from "@/theme/colors";
import { Recent } from "@/types";
import { onShare } from "@/utils/share";

export function RecentPerson({ item }: { item: Recent }) {
  const { isPro } = useAuthStore();
  const { data: pro } = useProOfferings();
  const { removeRecent } = useRecentItemsStore();
  const posthog = usePostHog();
  const blurTargetRef = useRef<View | null>(null);
  const textBlurTargetRef = useRef<View | null>(null);

  const size = calculateWidth(12, 12, 3.5);

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
          posthog.capture("recent_person:paywall_view", { type: "pro" });
          await RevenueCatUI.presentPaywall({ offering: pro });
        }}
        style={{ paddingVertical: 8 }}
      >
        <View
          // Extracted from Figma, decide to keep or not
          style={{
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
            {item.img_path ? (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w300${item.img_path}`,
                }}
                style={{
                  aspectRatio: 1,
                  width: size,
                  borderRadius: size,
                  borderWidth: 1,
                  borderColor: colors.separator,
                  marginBottom: 8,
                }}
              />
            ) : (
              <View
                style={{
                  backgroundColor: colors.systemGray,
                  aspectRatio: 1,
                  width: size,
                  borderRadius: size,
                  borderWidth: 1,
                  borderColor: colors.separator,
                  marginBottom: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: size / 2,
                    color: "white",
                  }}
                >
                  RP
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
              overflow: "hidden",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              aspectRatio: 1,
              width: size,
              borderRadius: size,
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
      href={{
        pathname: "/(tabs)/(find)/person/[id]",
        params: {
          id: item.id,
          name: item.name,
        },
      }}
      handleShareSelect={() => onShare(`person/${item.id}`, "recent", posthog)}
      handleRemoveSelect={() => removeRecent("recentPeople", item)}
    >
      <Pressable
        // https://github.com/dominicstop/react-native-ios-context-menu/issues/9#issuecomment-1047058781
        delayLongPress={100} // Leave room for a user to be able to click
        onLongPress={() => {}} // A callback that does nothing
        style={{ paddingVertical: 8 }}
      >
        <View
          // Extracted from Figma, decide to keep or not
          style={{
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
                uri: `https://image.tmdb.org/t/p/w300${item.img_path}`,
              }}
              style={{
                aspectRatio: 1,
                width: size,
                borderRadius: size,
                borderWidth: 1,
                borderColor: colors.separator,
                marginBottom: 8,
              }}
            />
          ) : (
            <View
              style={{
                backgroundColor: colors.systemGray,
                aspectRatio: 1,
                width: size,
                borderRadius: size,
                borderWidth: 1,
                borderColor: colors.separator,
                marginBottom: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: size / 2,
                  color: "white",
                }}
              >
                RP
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
