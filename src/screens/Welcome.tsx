import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Image, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import Carousel from 'react-native-snap-carousel';
import { getHypedGames, getTrendingMovies } from '../helpers/requests';
import { IGDB } from '../interfaces/igdb';
import { TMDB } from '../interfaces/tmdb';

function Welcome() {
  const navigation = useNavigation();
  const [carouselData, setCarouselData] = useState<TMDB.Movie.Movie[] | IGDB.Game.Game[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<TMDB.Movie.Movie[]>();
  const [hypedGames, setHypedGames] = useState<IGDB.Game.Game[]>();
  const ref = useRef<Carousel<any>>(null)
  const width = 200;
  const horizontalMargin = 4

  useEffect(() => {
    let isMounted = true;
    getTrendingMovies().then(json => {
      if (isMounted) {
        setTrendingMovies(json.results);
      }
    })
    getHypedGames().then(games => {
      if (isMounted) {
        setHypedGames(games);
      }
    })
    return () => { isMounted = false };
  }, [])

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
        tempCarouselData[(i * 2) + 1] = game;
        // Inserts game at every other element starting at 1
      }
      setCarouselData(tempCarouselData);
    }
  }, [trendingMovies, hypedGames])

  function RenderItem({ item, index }: { item: TMDB.Movie.Movie | IGDB.Game.Game, index: number }) {
    return (
      <Image
        source={{
          uri: index % 2
            ? `https://image.tmdb.org/t/p/w500${(item as TMDB.Movie.Movie).poster_path}`
            : `https:${(item as IGDB.Game.Game).cover?.url.replace("thumb", "cover_big_2x")}`
        }}
        style={{
          borderRadius: 8,
          borderColor: "#1f1f1f",
          borderWidth: 1,
          width: width,
          height: width * 1.5,
          paddingHorizontal: horizontalMargin
        }}
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      {carouselData.length > 0 &&
        <>
          <View style={{ alignItems: "center" }}>
            <Text style={iOSUIKit.title3EmphasizedWhite}>Track your most anticipated titles</Text>
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
            containerCustomStyle={{ marginVertical: 24, flexGrow: 0, flexShrink: 0 }}
          />
          <View style={{ marginHorizontal: 24 }}>
            <Pressable style={{ backgroundColor: iOSColors.blue, width: "100%", paddingVertical: 16, borderRadius: 8 }} onPress={() => navigation.navigate("Create Account")}>
              <Text style={{ ...iOSUIKit.bodyEmphasizedWhiteObject, textAlign: "center" }}>Continue</Text>
            </Pressable>
            <View style={{ flexDirection: "row", marginTop: 24 }}>
              <Text style={{ ...iOSUIKit.bodyObject, color: iOSColors.gray, alignSelf: "center" }}>Already have an account?</Text>
              <Pressable style={{ marginHorizontal: 8 }} onPress={() => navigation.navigate("Sign In", { emailSent: false })}>
                <Text style={{ ...iOSUIKit.bodyObject, color: iOSColors.blue }}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </>
      }
    </SafeAreaView>
  );
};

export default Welcome;
