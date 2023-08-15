import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PlatformColor, Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { iOSUIKit } from "react-native-typography";

import { calculateWidth } from "@/helpers/helpers";
import { Recent } from "@/types";

export function RecentMovie({ item }: { item: Recent }) {
  // https://github.com/react-navigation/react-navigation/issues/9037#issuecomment-735698288
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Movie", {
          movieId: item.id,
          movieTitle: item.name,
          poster_path: item.img_path,
        })
      }
    >
      {item.img_path ? (
        <FastImage
          source={{
            uri: `https://image.tmdb.org/t/p/w300${item.img_path}`,
          }}
          style={{
            aspectRatio: 2 / 3,
            width: calculateWidth(12, 12, 3.5),
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
      ) : (
        <View
          style={{
            backgroundColor: PlatformColor("systemGray"),
            aspectRatio: 2 / 3,
            width: calculateWidth(12, 12, 3.5),
            borderRadius: 8,
            marginBottom: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={[iOSUIKit.bodyWhite, { textAlign: "center" }]}>
            {item.name}
          </Text>
        </View>
      )}
      <Text
        style={[
          iOSUIKit.subhead,
          { color: "white", maxWidth: 96, textAlign: "center" },
        ]}
        numberOfLines={2}
      >
        {item.name}
      </Text>
    </Pressable>
  );
}
