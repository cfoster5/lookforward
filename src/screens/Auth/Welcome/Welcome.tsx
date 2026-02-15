import * as Colors from "@bacons/apple-colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { useRef } from "react";
import { Dimensions, SafeAreaView, Text, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { iOSUIKit } from "react-native-typography";
import { PosterSize, TrendingResults } from "tmdb-ts";

import { LargeBorderlessButton } from "@/components/LargeBorderlessButton";
import { LargeFilledButton } from "@/components/LargeFilledButton";
import { AuthStackParams } from "@/types";

import { useHypedGames } from "./api/getHypedGames";
import { useTrendingMovies } from "./api/getTrendingMovies";

const width = 200;
const horizontalMargin = 4;

type CarouselItemProps = {
  item:
    | NonNullable<ReturnType<typeof useTrendingMovies>["data"]>[number]
    | NonNullable<ReturnType<typeof useHypedGames>["data"]>[number];
  index: number;
};

function isTrendingMovie(
  item: CarouselItemProps["item"],
  index: number,
): item is TrendingResults<"movie">["results"][number] {
  return index % 2 === 1;
}

function isHypedGame(
  item: CarouselItemProps["item"],
  index: number,
): item is NonNullable<ReturnType<typeof useHypedGames>["data"]>[number] {
  return index % 2 === 0;
}

const CarouselItem = ({ item, index }: CarouselItemProps) => {
  let imageUri: string | undefined;

  if (isTrendingMovie(item, index)) {
    imageUri = `https://image.tmdb.org/t/p/${PosterSize.W500}${item.poster_path}`;
  } else if (isHypedGame(item, index)) {
    imageUri = `https:${item.cover?.url.replace("thumb", "cover_big_2x")}`;
  } else {
    imageUri = undefined;
  }

  return (
    <Image
      source={{ uri: imageUri }}
      style={{
        borderRadius: 12,
        borderColor: Colors.separator,
        borderWidth: 1,
        width,
        aspectRatio: 2 / 3,
        paddingHorizontal: horizontalMargin,
      }}
    />
  );
};

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
            renderItem={({ item, index }) => (
              <CarouselItem item={item} index={index} />
            )}
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
