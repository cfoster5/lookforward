import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image } from "expo-image";
import { useMemo } from "react";
import {
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { iOSUIKit } from "react-native-typography";
import { Cast, Crew } from "tmdb-ts";

import { ContextMenu } from "@/screens/Search/components/SearchBottomSheet/ContextMenu";
import { useRecentItemsStore } from "@/stores/recents";
import { useStore } from "@/stores/store";
import {
  CountdownStackParamList,
  FindStackParamList,
  TabNavigationParamList,
} from "@/types";
import { timestamp } from "@/utils/dates";
import { onShare } from "@/utils/share";

interface Props {
  navigation:
    | CompositeNavigationProp<
        StackNavigationProp<FindStackParamList, "Movie">,
        BottomTabNavigationProp<TabNavigationParamList, "FindTab">
      >
    | CompositeNavigationProp<
        StackNavigationProp<CountdownStackParamList, "Movie">,
        BottomTabNavigationProp<TabNavigationParamList, "CountdownTab">
      >;
  person: Cast | Crew;
}

const pressableStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  nameContainer: {
    marginLeft: 16,
    flex: 1,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
});

function Person({ navigation, person }: Props) {
  const { theme } = useStore();
  const { addRecent } = useRecentItemsStore();
  const { width: windowWidth } = useWindowDimensions();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        poster: {
          width: windowWidth / 3.5 - 16,
          aspectRatio: 2 / 3,
          borderRadius: 12,
          borderWidth: 1,
          borderColor:
            theme === "dark" ? PlatformColor("separator") : "#e0e0e0",
        },
      }),
    [theme, windowWidth],
  );

  return (
    <ContextMenu
      handleShareSelect={() =>
        onShare(`person/${person.id}?name=${person.name}`, "movie")
      }
    >
      <Pressable
        style={pressableStyle.container}
        onPress={() => {
          navigation.push("Actor", {
            personId: person.id,
            name: person.name,
          });
          addRecent("recentPeople", {
            id: person.id,
            name: person.name,
            img_path: person.profile_path,
            last_viewed: timestamp,
          });
        }}
        // https://github.com/dominicstop/react-native-ios-context-menu/issues/9#issuecomment-1047058781
        delayLongPress={100} // Leave room for a user to be able to click
        onLongPress={() => {}} // A callback that does nothing
      >
        {person.profile_path ? (
          <Image
            style={styles.poster}
            source={{
              uri: `https://image.tmdb.org/t/p/w300${person.profile_path}`,
            }}
          />
        ) : (
          <View style={[styles.poster, pressableStyle.centered]}>
            <Text
              style={
                theme === "dark"
                  ? {
                      ...iOSUIKit.title3EmphasizedWhiteObject,
                      textAlign: "center",
                    }
                  : {
                      ...iOSUIKit.title3EmphasizedObject,
                      color: PlatformColor("systemGray"),
                      textAlign: "center",
                    }
              }
            >
              {person.name
                .split(" ")
                .map((i: string) => i.charAt(0))
                .join("")}
            </Text>
          </View>
        )}
        <View style={pressableStyle.nameContainer}>
          <Text style={theme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>
            {person.name}
          </Text>
          <Text
            style={[iOSUIKit.callout, { color: PlatformColor("systemGray") }]}
          >
            {"character" in person ? person.character : person.job?.join(", ")}
          </Text>
        </View>
      </Pressable>
    </ContextMenu>
  );
}

export default Person;
