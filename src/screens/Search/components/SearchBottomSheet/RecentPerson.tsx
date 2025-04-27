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

export function RecentPerson({ item }: { item: Recent }) {
  // https://github.com/react-navigation/react-navigation/issues/9037#issuecomment-735698288
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { removeRecent } = useRecentItemsStore();

  return (
    <ContextMenu
      handleShareSelect={() =>
        onShare(`person/${item.id}?name=${item.name}`, "recent")
      }
      handleRemoveSelect={() => removeRecent("recentPeople", item)}
    >
      <Pressable
        onPress={() =>
          navigation.navigate("Actor", {
            personId: item.id,
            name: item.name,
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
                borderColor: PlatformColor("separator"),
                marginBottom: 8,
              }}
            />
          ) : (
            <View
              style={{
                backgroundColor: PlatformColor("systemGray"),
                aspectRatio: 1,
                width: calculateWidth(12, 12, 3.5),
                borderRadius: calculateWidth(12, 12, 3.5),
                borderWidth: 1,
                borderColor: PlatformColor("separator"),
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
