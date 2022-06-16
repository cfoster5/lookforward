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

import { useGetHypedGames } from "../../../hooks/useGetHypedGames";
import { IGDB } from "../../../interfaces/igdb";
import { Movie } from "../../../interfaces/tmdb";
import { AuthStackParamList } from "../../../navigation/AuthStack";
import { useTrendingMovies } from "./api/getTrendingMovies";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "Welcome">;
  route: any;
}

function Welcome({ navigation }: Props) {
  const { data: trendingMovies, isLoading } = useTrendingMovies();
  const hypedGames: IGDB.Game.Game[] = useGetHypedGames();
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
              ? `https://image.tmdb.org/t/p/w500${(item as Movie).poster_path}`
              : `https:${(item as IGDB.Game.Game)?.cover?.url.replace(
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
      {!isLoading && hypedGames.length > 0 && (
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
