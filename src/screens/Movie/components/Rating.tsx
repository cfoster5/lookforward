import { Image } from "expo-image";
import { PlatformColor, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { OMDBMovie } from "../types/omdb";

export const Rating = ({
  source,
  rating,
}: {
  source: OMDBMovie["Ratings"][number]["Source"];
  rating: OMDBMovie["Ratings"][number]["Value"];
}) => {
  const imageMap = {
    "Internet Movie Database": {
      path: require("../assets/IMDb_Logo_Rectangle_Gold.png"),
      aspectRatio: 740 / 362,
    },
    "Rotten Tomatoes": {
      path:
        parseFloat(rating) >= 60
          ? require("../assets/tomatometer-fresh.svg")
          : require("../assets/tomatometer-rotten.svg"),
      aspectRatio: 1 / 1,
    },
    Metacritic: {
      path: require("../assets/metacritic-logo.png"),
      aspectRatio: 1 / 1,
    },
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Image
        style={{
          aspectRatio: imageMap[source].aspectRatio,
          height: iOSUIKit.bodyObject.lineHeight,
          marginRight: 8,
        }}
        contentFit="fill"
        source={imageMap[source].path}
      />
      <Text style={[iOSUIKit.body, { color: PlatformColor("label") }]}>
        {rating}
      </Text>
    </View>
  );
};
