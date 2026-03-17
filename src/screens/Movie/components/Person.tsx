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
import { useInterfaceStore } from "@/stores/interface";
import { colors } from "@/theme/colors";
import { onShare } from "@/utils/share";

type Props = {
  person: Cast | Crew;
};

export function Person({ person }: Props) {
  const segments = useSegments();
  const stack = segments[1] as "(find)" | "(countdown)";
  const theme = useInterfaceStore((s) => s.theme);
  const { width: windowWidth } = useWindowDimensions();

  const posterWidth = windowWidth / 3.5 - 16;
  const isDark = theme === "dark";

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
        style={styles.row}
        // https://github.com/dominicstop/react-native-ios-context-menu/issues/9#issuecomment-1047058781
        delayLongPress={100} // Leave room for a user to be able to click
        onLongPress={() => {}} // A callback that does nothing
      >
        {person.profile_path ? (
          <Image
            style={[
              styles.poster,
              {
                width: posterWidth,
                borderColor: isDark ? colors.separator : "#e0e0e0",
              },
            ]}
            source={{
              uri: `https://image.tmdb.org/t/p/w300${person.profile_path}`,
            }}
          />
        ) : (
          <View
            style={[
              styles.poster,
              styles.posterFallback,
              {
                width: posterWidth,
                borderColor: isDark ? colors.separator : "#e0e0e0",
              },
            ]}
          >
            <Text
              style={
                isDark ? styles.fallbackTextDark : styles.fallbackTextLight
              }
            >
              {person.name
                .split(" ")
                .map((i: string) => i.charAt(0))
                .join("")}
            </Text>
          </View>
        )}
        <View style={styles.details}>
          <Text style={isDark ? iOSUIKit.bodyWhite : iOSUIKit.body}>
            {person.name}
          </Text>
          <Text style={styles.role}>
            {"character" in person ? person.character : person.job?.join(", ")}
          </Text>
        </View>
      </Pressable>
    </ContextMenuLink>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  poster: {
    aspectRatio: 2 / 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  posterFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackTextDark: {
    ...iOSUIKit.title3EmphasizedWhiteObject,
    textAlign: "center",
  },
  fallbackTextLight: {
    ...iOSUIKit.title3EmphasizedObject,
    color: colors.systemGray,
    textAlign: "center",
  },
  details: {
    marginLeft: 16,
    flex: 1,
  },
  role: {
    ...iOSUIKit.calloutObject,
    color: colors.systemGray,
  },
});
