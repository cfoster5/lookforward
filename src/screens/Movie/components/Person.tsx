import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image } from "expo-image";
import { useContext } from "react";
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

import TabStackContext from "@/contexts/TabStackContext";
import {
  CountdownStackParamList,
  FindStackParamList,
  TabNavigationParamList,
} from "@/types";

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

function Person({ navigation, person }: Props) {
  const { theme } = useContext(TabStackContext);
  const { width: windowWidth } = useWindowDimensions();

  const styles = StyleSheet.create({
    poster: {
      width: windowWidth / 3.5 - 16,
      aspectRatio: 2 / 3,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme === "dark" ? PlatformColor("separator") : "#e0e0e0",
    },
  });

  return (
    <Pressable
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16,
      }}
      onPress={() =>
        navigation.push("Actor", {
          personId: person.id,
          name: person.name,
          profile_path: person.profile_path,
        })
      }
    >
      {person.profile_path ? (
        <Image
          style={styles.poster}
          source={{
            uri: `https://image.tmdb.org/t/p/w300${person.profile_path}`,
          }}
        />
      ) : (
        <View
          style={[
            styles.poster,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
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
      <View style={{ marginLeft: 16, flex: 1 }}>
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
  );
}

export default Person;
