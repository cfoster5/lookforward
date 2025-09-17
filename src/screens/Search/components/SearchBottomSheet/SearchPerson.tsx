import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import * as Colors from "@bacons/apple-colors";
import { PersonWithMediaType } from "tmdb-ts";

import { calculateWidth } from "@/helpers/helpers";
import { onShare } from "@/utils/share";

import { ContextMenu } from "./ContextMenu";

export function SearchPerson({ item }: { item: PersonWithMediaType }) {
  const router = useRouter();

  return (
    <ContextMenu
      handleShareSelect={() => onShare(`person/${item.id}`, "search")}
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
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 12,
          },
          pressed && {
            backgroundColor: Colors.tertiarySystemBackground,
          },
        ]}
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
          {item.profile_path ? (
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w300${item.profile_path}`,
              }}
              style={{
                aspectRatio: 1,
                width: calculateWidth(12, 12, 3.5),
                borderRadius: calculateWidth(12, 12, 3.5),
                borderWidth: 1,
                borderColor: Colors.separator,
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
                {item.name.split(" ").map((i: string) => i.charAt(0))}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text
            style={[iOSUIKit.body, { color: Colors.label }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text
            style={[
              iOSUIKit.subhead,
              { color: Colors.secondaryLabel },
            ]}
            numberOfLines={2}
          >
            {item.known_for_department}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={28}
          style={{ marginRight: 12 }}
          color={Colors.tertiaryLabel}
        />
      </Pressable>
    </ContextMenu>
  );
}
