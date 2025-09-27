import * as Colors from "@bacons/apple-colors";
import { Image } from "expo-image";
import { useSegments } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { iOSUIKit } from "react-native-typography";
import { Cast, Crew } from "tmdb-ts";

import { ContextMenuLink } from "@/components/ContextMenuLink";
import { useInterfaceStore } from "@/stores";
import { onShare } from "@/utils/share";

type Props = {
  person: Cast | Crew;
};

function Person({ person }: Props) {
  const segments = useSegments();
  const stack = segments[1] as "(find)" | "(countdown)";
  const { theme } = useInterfaceStore();
  const { width: windowWidth } = useWindowDimensions();

  const styles = StyleSheet.create({
    poster: {
      width: windowWidth / 3.5 - 16,
      aspectRatio: 2 / 3,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme === "dark" ? Colors.separator : "#e0e0e0",
    },
  });

  return (
    <ContextMenuLink
      href={{
        pathname: `/(tabs)/${stack}/person/[id]`,
        params: {
          id: person.id,
          name: person.name,
        },
      }}
      handleShareSelect={() => onShare(`person/${person.id}`, "movie")}
    >
      <Pressable
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 16,
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
                      color: Colors.systemGray,
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
          <Text style={[iOSUIKit.callout, { color: Colors.systemGray }]}>
            {"character" in person ? person.character : person.job?.join(", ")}
          </Text>
        </View>
      </Pressable>
    </ContextMenuLink>
  );
}

export default Person;
