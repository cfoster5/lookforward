import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { IGDB } from "interfaces/igdb";
import { Movie } from "interfaces/tmdb";
import { useRef } from "react";
import {
  Dimensions,
  PlatformColor,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { iOSUIKit } from "react-native-typography";

import { useHypedGames } from "./api/getHypedGames";
import { useTrendingMovies } from "./api/getTrendingMovies";
import { PosterSizes } from "../../../interfaces/tmdb/configuration";

import { AuthStackParams } from "@/types";

type Props = NativeStackScreenProps<AuthStackParams, "Welcome">;

function Welcome({ navigation }: Props) {
  const { data: trendingMovies, isLoading } = useTrendingMovies();
  // const hypedGames: IGDB.Game.Game[] = useGetHypedGames();
  const { data: hypedGames } = useHypedGames();
  const ref = useRef<Carousel<any>>(null);
  const width = 200;
  const horizontalMargin = 4;

  function RenderItem({
    item,
    index,
  }: {
    item: Movie | IGDB.Game.Game;
    index: number;
  }) {
    return (
      <Image
        source={{
          uri:
            index % 2
              ? `https://image.tmdb.org/t/p/${PosterSizes.W500}${
                  (item as Movie).poster_path
                }`
              : `https:${(item as IGDB.Game.Game)?.cover?.url.replace(
                  "thumb",
                  "cover_big_2x"
                )}`,
        }}
        style={{
          borderRadius: 8,
          borderColor: PlatformColor("systemGray6"),
          borderWidth: 1,
          width,
          height: width * 1.5,
          paddingHorizontal: horizontalMargin,
        }}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      {!isLoading && hypedGames && (
        <>
          <View style={{ alignItems: "center" }}>
            <Text style={iOSUIKit.title3EmphasizedWhite}>
              Track your most anticipated titles
            </Text>
          </View>
          <Carousel
            ref={ref}
            // Merge two arrays so that the values alternate
            data={trendingMovies
              .slice(0, 10)
              .map((movie, i) => [movie, hypedGames[i]])
              .reduce((a, b) => a.concat(b))}
            renderItem={RenderItem}
            layout="default"
            loop
            autoplay
            scrollEnabled={false}
            sliderWidth={Dimensions.get("window").width}
            itemWidth={width + horizontalMargin * 2}
            removeClippedSubviews
            containerCustomStyle={{
              marginVertical: 24,
              flexGrow: 0,
              flexShrink: 0,
            }}
          />
          <View style={{ marginHorizontal: 24 }}>
            <Pressable
              style={{
                backgroundColor: PlatformColor("systemBlue"),
                width: "100%",
                paddingVertical: 16,
                borderRadius: 8,
              }}
              onPress={() => navigation.navigate("Create Account")}
            >
              <Text
                style={{
                  ...iOSUIKit.bodyEmphasizedWhiteObject,
                  textAlign: "center",
                }}
              >
                Continue
              </Text>
            </Pressable>
            <View style={{ flexDirection: "row", marginTop: 24 }}>
              <Text
                style={{
                  ...iOSUIKit.bodyObject,
                  color: PlatformColor("systemGray"),
                  alignSelf: "center",
                }}
              >
                Already have an account?
              </Text>
              <Pressable
                style={{ marginHorizontal: 8 }}
                onPress={() =>
                  navigation.navigate("Sign In", { emailSent: false })
                }
              >
                <Text
                  style={{
                    ...iOSUIKit.bodyObject,
                    color: PlatformColor("systemBlue"),
                  }}
                >
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

export default Welcome;
