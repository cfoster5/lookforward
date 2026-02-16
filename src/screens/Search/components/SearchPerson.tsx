import { Color } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ComponentRef, forwardRef } from "react";
import { Pressable, PressableProps, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { PersonWithMediaType } from "tmdb-ts";

import { ContextMenuLink } from "@/components/ContextMenuLink";
import { calculateWidth } from "@/helpers/helpers";
import { useAppConfigStore } from "@/stores/appConfig";
import { tryRequestReview } from "@/utils/requestReview";
import { onShare } from "@/utils/share";

type ResultProps = PressableProps &
  Pick<Parameters<typeof SearchPerson>[0], "item">;

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
              borderColor: Color.ios.separator,
            }}
          />
        ) : (
          <View
            style={{
              backgroundColor: Color.ios.systemGray,
              aspectRatio: 1,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: calculateWidth(12, 12, 3.5),
              borderWidth: 1,
              borderColor: Color.ios.separator,
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
          style={[iOSUIKit.body, { color: Color.ios.label }]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <Text
          style={[iOSUIKit.subhead, { color: Color.ios.secondaryLabel }]}
          numberOfLines={2}
        >
          {item.known_for_department}
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

export const SearchPerson = ({ item }: { item: PersonWithMediaType }) => {
  const { incrementSearchCount } = useAppConfigStore();

  const handlePress = () => {
    incrementSearchCount();
    tryRequestReview();
  };

  return (
    <ContextMenuLink
      href={{
        pathname: "/(tabs)/(find)/person/[id]",
        params: {
          id: item.id,
          name: item.name,
        },
      }}
      onPress={handlePress}
      handleShareSelect={() => onShare(`person/${item.id}`, "search")}
    >
      <Result item={item} />
    </ContextMenuLink>
  );
};
