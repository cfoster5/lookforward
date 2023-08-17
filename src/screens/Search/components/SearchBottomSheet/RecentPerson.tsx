import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PlatformColor, Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { iOSUIKit } from "react-native-typography";

import { calculateWidth } from "@/helpers/helpers";
import { Recent } from "@/types";

export function RecentPerson({ item }: { item: Recent }) {
  // https://github.com/react-navigation/react-navigation/issues/9037#issuecomment-735698288
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Actor", {
          personId: item.id,
          name: item.name,
          profile_path: item.img_path,
        })
      }
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
          <FastImage
            source={{
              uri: `https://image.tmdb.org/t/p/w300${item.img_path}`,
            }}
            style={{
              aspectRatio: 1,
              width: calculateWidth(12, 12, 3.5),
              borderRadius: calculateWidth(12, 12, 3.5),
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
          { color: PlatformColor("label"), maxWidth: 96, textAlign: "center" },
        ]}
        numberOfLines={2}
      >
        {item.name}
      </Text>
    </Pressable>
  );
}
