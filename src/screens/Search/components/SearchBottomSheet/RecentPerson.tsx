import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import * as Colors from "@bacons/apple-colors";

import { calculateWidth } from "@/helpers/helpers";
import { useRecentItemsStore } from "@/stores/recents";
import { useStore } from "@/stores/store";
import { Recent } from "@/types";
import { onShare } from "@/utils/share";

import { ContextMenu } from "./ContextMenu";

export function RecentPerson({ item }: { item: Recent }) {
  const router = useRouter();

  const { isPro, proModalRef } = useStore();
  const { removeRecent } = useRecentItemsStore();

  if (!isPro)
    return (
      <Pressable
        onPress={() => {
          proModalRef.current?.present();
          const analytics = getAnalytics();
          logEvent(analytics, "select_promotion", {
            name: "Pro",
            id: "com.lookforward.pro",
          });
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
          {item.img_path ? (
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w300${item.img_path}`,
              }}
              style={{
                aspectRatio: 1,
                width: calculateWidth(12, 12, 3.5),
                borderRadius: calculateWidth(12, 12, 3.5),
                borderWidth: 1,
                borderColor: Colors.separator,
                marginBottom: 8,
              }}
            />
          ) : (
            <View
              style={{
                backgroundColor: Colors.systemGray,
                aspectRatio: 1,
                width: calculateWidth(12, 12, 3.5),
                borderRadius: calculateWidth(12, 12, 3.5),
                borderWidth: 1,
                borderColor: Colors.separator,
                marginBottom: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: calculateWidth(12, 12, 3.5) / 2,
                  color: "white",
                }}
              >
                RP
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
              overflow: "hidden",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              aspectRatio: 1,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: calculateWidth(12, 12, 3.5),
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
                tintColor={Colors.label}
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
                color: Colors.label,
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
      handleShareSelect={() => onShare(`person/${item.id}`, "recent")}
      handleRemoveSelect={() => removeRecent("recentPeople", item)}
    >
      <Pressable
        onPress={() =>
          router.navigate({
            pathname: "/(tabs)/(find)/person/[id]",
            params: {
              id: item.id,
              name: item.name,
            },
          })
        }
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
                width: calculateWidth(12, 12, 3.5),
                borderRadius: calculateWidth(12, 12, 3.5),
                borderWidth: 1,
                borderColor: Colors.separator,
                marginBottom: 8,
              }}
            />
          ) : (
            <View
              style={{
                backgroundColor: Colors.systemGray,
                aspectRatio: 1,
                width: calculateWidth(12, 12, 3.5),
                borderRadius: calculateWidth(12, 12, 3.5),
                borderWidth: 1,
                borderColor: Colors.separator,
                marginBottom: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: calculateWidth(12, 12, 3.5) / 2,
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
              color: Colors.label,
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
