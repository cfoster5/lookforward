import * as Colors from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { useAuthStore } from "@/stores";

import { OMDBMovie } from "../../../screens/Movie/types/omdb";

export const Rating = ({
  source,
  rating,
}: {
  source: OMDBMovie["Ratings"][number]["Source"];
  rating: OMDBMovie["Ratings"][number]["Value"];
}) => {
  const { isPro } = useAuthStore();
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
      {!isPro ? (
        <View
          style={{
            width: 44,
            // backgroundColor: "rgba(120, 120, 120, 0.12)",
            backgroundColor: Colors.placeholderText,
            opacity: 0.5,
            borderRadius: 4,
          }}
        />
      ) : (
        <Text style={[iOSUIKit.body, { color: Colors.label }]}>{rating}</Text>
      )}
    </View>
  );
};
