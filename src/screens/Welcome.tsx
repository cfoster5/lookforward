import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { StackNavigationProp } from "@react-navigation/stack";

import { getHypedGames } from "../helpers/igdbRequests";
import { getTrendingMovies } from "../helpers/tmdbRequests";
import { IGDB } from "../interfaces/igdb";
import { TrendingMovie } from "../interfaces/tmdb";
import { AuthStackParamList } from "../navigation/AuthStack";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "Welcome">;
  route: any;
}

function Welcome({ navigation }: Props) {
  const [carouselData, setCarouselData] = useState<
    TrendingMovie[] | IGDB.Game.Game[]
  >([]);
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>();
  const [hypedGames, setHypedGames] = useState<IGDB.Game.Game[]>();
  const ref = useRef<Carousel<any>>(null);
  const width = 200;
  const horizontalMargin = 4;

  useEffect(() => {
    let isMounted = true;
    getTrendingMovies().then((json) => {
      if (isMounted) {
        setTrendingMovies(json.results);
      }
    });
    getHypedGames().then((games) => {
      if (isMounted) {
        setHypedGames(games);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (trendingMovies && hypedGames) {
      let tempCarouselData = Array(20).fill({});
      for (let i = 0; i < 10; i++) {
        const movie = trendingMovies[i];
        tempCarouselData[i * 2] = movie;
        // Inserts movie at every other element starting at 0
      }
      for (let i = 0; i < 10; i++) {
        const game = hypedGames[i];
        tempCarouselData[i * 2 + 1] = game;
        // Inserts game at every other element starting at 1
      }
      setCarouselData(tempCarouselData);
    }
  }, [trendingMovies, hypedGames]);

  function RenderItem({
    item,
    index,
  }: {
    item: TrendingMovie | IGDB.Game.Game;
    index: number;
  }) {
    return (
      <Image
        source={{
          uri:
            index % 2
              ? `https://image.tmdb.org/t/p/w500${
                  (item as TrendingMovie).poster_path
                }`
              : `https:${(item as IGDB.Game.Game).cover?.url.replace(
                  "thumb",
                  "cover_big_2x"
                )}`,
        }}
        style={{
          borderRadius: 8,
          borderColor: "#1f1f1f",
          borderWidth: 1,
          width: width,
          height: width * 1.5,
          paddingHorizontal: horizontalMargin,
        }}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      {carouselData.length > 0 && (
        <>
          <View style={{ alignItems: "center" }}>
            <Text style={iOSUIKit.title3EmphasizedWhite}>
              Track your most anticipated titles
            </Text>
          </View>
          <Carousel
            ref={ref}
            data={carouselData}
            renderItem={RenderItem}
            layout={"default"}
            loop={true}
            autoplay={true}
            scrollEnabled={false}
            sliderWidth={Dimensions.get("window").width}
            itemWidth={width + horizontalMargin * 2}
            removeClippedSubviews={true}
            containerCustomStyle={{
              marginVertical: 24,
              flexGrow: 0,
              flexShrink: 0,
            }}
          />
          <View style={{ marginHorizontal: 24 }}>
            <Pressable
              style={{
                backgroundColor: iOSColors.blue,
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
                  color: iOSColors.gray,
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
                <Text style={{ ...iOSUIKit.bodyObject, color: iOSColors.blue }}>
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
