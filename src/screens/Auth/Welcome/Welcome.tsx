import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { IGDB } from "interfaces/igdb";
import { useRef } from "react";
import {
  Dimensions,
  PlatformColor,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { iOSUIKit } from "react-native-typography";
import { TrendingResults } from "tmdb-ts";

import { useHypedGames } from "./api/getHypedGames";
import { useTrendingMovies } from "./api/getTrendingMovies";
import { PosterSizes } from "../../../interfaces/tmdb/configuration";

import { LargeBorderlessButton } from "@/components/LargeBorderlessButton";
import { LargeFilledButton } from "@/components/LargeFilledButton";
import { AuthStackParams } from "@/types";

const width = 200;
const horizontalMargin = 4;

type CarouselItemProps = {
  item: TrendingResults<"movie">["results"][number] | IGDB.Game.Game;
  index: number;
};

const CarouselItem = ({ item, index }: CarouselItemProps) => (
  <Image
    source={{
      uri:
        index % 2
          ? `https://image.tmdb.org/t/p/${PosterSizes.W500}${
              (item as TrendingResults<"movie">["results"][number]).poster_path
            }`
          : `https:${(item as IGDB.Game.Game)?.cover?.url.replace(
              "thumb",
              "cover_big_2x"
            )}`,
    }}
    style={{
      borderRadius: 12,
      borderColor: PlatformColor("separator"),
      borderWidth: 1,
      width,
      aspectRatio: 2 / 3,
      paddingHorizontal: horizontalMargin,
    }}
  />
);

type Props = NativeStackScreenProps<AuthStackParams, "Welcome">;

function Welcome({ navigation }: Props) {
  const { data: trendingMovies, isLoading } = useTrendingMovies();
  // const hypedGames: IGDB.Game.Game[] = useGetHypedGames();
  const { data: hypedGames } = useHypedGames();
  const ref = useRef<Carousel<any>>(null);

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
              ?.slice(0, 10)
              .map((movie, i) => [movie, hypedGames[i]])
              .reduce((a, b) => a.concat(b))}
            renderItem={CarouselItem}
            layout="default"
            loop
            autoplay
            scrollEnabled={false}
            sliderWidth={Dimensions.get("window").width}
            itemWidth={width + horizontalMargin * 2}
            vertical={false}
            containerCustomStyle={{
              marginVertical: 24,
              flexGrow: 0,
              flexShrink: 0,
            }}
          />
          <View style={{ marginHorizontal: 24 }}>
            <LargeFilledButton
              disabled={false}
              handlePress={() => navigation.navigate("Create Account")}
              text="Create Account"
            />
            <LargeBorderlessButton
              style={{ marginTop: 16 }}
              handlePress={() =>
                navigation.navigate("Sign In", { emailSent: false })
              }
              text="Sign In"
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

export default Welcome;
