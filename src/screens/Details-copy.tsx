import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  Pressable,
  Appearance,
  Text,
  StyleSheet,
  ImageBackground,
  Button
} from 'react-native';

import moment from 'moment';
import { IGDB, Navigation, TMDB } from './types';
import { Image } from 'react-native-elements';
import { getMovieDetails } from './src/helpers/requests';
import { reusableStyles } from './src/helpers/styles';
import { iOSColors, iOSUIKit } from 'react-native-typography'
import Trailer from './src/components/Trailer';
import Cast from './Cast';
import SegmentedControl from '@react-native-community/segmented-control';
import MediaItem from './src/components/MediaItem';
import Person from './src/components/Person';
import { Modalize } from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderButton, HeaderButtonProps, HeaderButtons, Item } from 'react-navigation-header-buttons';
import { months } from './src/helpers/helpers';
import firestore from '@react-native-firebase/firestore';

function Details({ route, navigation }: Navigation.DetailsScreenProps) {
  const media = route.params;
  const [movieDetails, setMovieDetails] = useState<TMDB.Movie.Details>();
  const [detailIndex, setDetailIndex] = useState(0)
  const modalizeRef = useRef<Modalize>(null);

  const IoniconsHeaderButton = (props: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<HeaderButton> & Readonly<HeaderButtonProps> & Readonly<any>) => (
    // the `props` here come from <Item ... />
    // you may access them and pass something else to `HeaderButton` if you like
    <HeaderButton IconComponent={Ionicons} iconSize={30} color={iOSColors.blue} {...props} />
  );

  useEffect(() => {
    if (media.type === "movie") {
      // console.log(media.data.id)
      getMovieDetails(media.data.id).then(movie => {
        // console.log(movie);
        setMovieDetails(movie);
      })
    }
  }, [media])

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        // <Pressable onPress={() => modalizeRef.current?.open()}>
        //   <Ionicons name="add" color={iOSColors.blue} size={30} />
        // </Pressable>
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item title="search" iconName="add" onPress={() => media.type === "movie" ? addToList() : modalizeRef.current?.open()} />
        </HeaderButtons>
      )
    });
  }, [navigation]);

  const colorScheme = Appearance.getColorScheme();

  function getReleaseDate(): string {
    if (media.type === "movie") {
      let monthIndex = new Date((media.data as TMDB.Movie.Movie).release_date).getUTCMonth();
      return `${months[monthIndex].toUpperCase()} ${new Date((media.data as TMDB.Movie.Movie).release_date).getUTCDate()}, ${new Date((media.data as TMDB.Movie.Movie).release_date).getUTCFullYear()}`;
    }
    else {
      let dates: number[] = [];
      // console.log((media.data as IGDB.Game.Game).release_dates)
      (media.data as IGDB.Game.Game).release_dates.forEach(releaseDate => {
        // console.log(releaseDate)
        if (dates.indexOf(releaseDate.date) === -1 && (releaseDate.region === 2 || releaseDate.region === 8)) {
          dates.push(releaseDate.date)
        }
      });
      if (dates.length === 1) {
        let date = new Date(dates[0] * 1000);
        let monthIndex = new Date(date).getUTCMonth();
        return `${months[monthIndex].toUpperCase()} ${date.getUTCDate()}, ${new Date(date).getUTCFullYear()}`
      }
      else {
        return "MULTIPLE DATES"
      }
    }
  }

  async function addToList() {
    let data = media.data;
    data.mediaType = media.type
    try {
      await firestore().collection("users").doc(route.params.uid).collection('items').add(data);
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return (
    <>
      {media.type === "game" &&
        <Modalize ref={modalizeRef} adjustToContentHeight={true} childrenStyle={{ marginBottom: 16 }} modalStyle={colorScheme === "dark" ? { backgroundColor: "#121212" } : {}}>
          {/* {(media.data as IGDB.Game.Game).release_dates.map((releaseDate, i) => ( */}
          {(media.data as IGDB.Game.Game).release_dates.map((releaseDate, i) => (
            (releaseDate.region === 2 || releaseDate.region === 8) &&
            <Pressable
              key={i}
              onPress={() => modalizeRef.current?.close()}
              style={{
                marginLeft: 16,
                marginTop: 16,
                paddingBottom: i < (media.data as IGDB.Game.Game).release_dates.filter(releaseDate => releaseDate.region === 2 || releaseDate.region === 8).length - 1 ? 16 : 0,
                borderBottomWidth: i < (media.data as IGDB.Game.Game).release_dates.filter(releaseDate => releaseDate.region === 2 || releaseDate.region === 8).length - 1 ? StyleSheet.hairlineWidth : 0,
                borderColor: i < (media.data as IGDB.Game.Game).release_dates.filter(releaseDate => releaseDate.region === 2 || releaseDate.region === 8).length - 1 ? "#3c3d41" : undefined
              }}
            >
              <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{releaseDate.platform.name}</Text>
            </Pressable>
          ))}
        </Modalize>
      }
      <ScrollView>
        {/* <Image
          // style={{ width: Dimensions.get("window").width, height: (500 / 889) * Dimensions.get("window").width }}
          style={{ width: Dimensions.get("window").width, height: (720 / 1280) * Dimensions.get("window").width }}
          // source={{ uri: media.type === "game" ? `https:${media.data.game.cover.url.replace("thumb", "screenshot_big")}` : `https://image.tmdb.org/t/p/w1280${media.data.backdrop_path}` }}
          source={{ uri: media.type === "game" ? `https:${(media.data as IGDB.Game.Game).cover.url.replace("thumb", "screenshot_big")}` : `https://image.tmdb.org/t/p/w780${media.data.backdrop_path}` }}
        /> */}
        {media.type === "game" && (media.data as IGDB.Game.Game)?.cover?.url &&
          <Image
            // style={{ width: Dimensions.get("window").width, height: (500 / 889) * Dimensions.get("window").width }}
            style={{ width: Dimensions.get("window").width, height: (720 / 1280) * Dimensions.get("window").width }}
            source={{ uri: `https:${(media.data as IGDB.Game.Game).cover.url.replace("thumb", "screenshot_big")}` }}
          />
        }
        {media.type === "movie" && (media.data as TMDB.Movie.Movie)?.backdrop_path &&
          <Image
            // style={{ width: Dimensions.get("window").width, height: (500 / 889) * Dimensions.get("window").width }}
            style={{ width: Dimensions.get("window").width, height: (720 / 1280) * Dimensions.get("window").width }}
            source={{ uri: `https://image.tmdb.org/t/p/w780${(media.data as TMDB.Movie.Movie).backdrop_path}` }}
          />
        }
        <View style={{ margin: 16 }}>
          <Text style={colorScheme === "dark" ? iOSUIKit.largeTitleEmphasizedWhite : iOSUIKit.largeTitleEmphasized}>{media.type === "game" ? (media.data as IGDB.Game.Game).name : (media.data as TMDB.Movie.Movie).title}</Text>
          <Text style={reusableStyles.date}>{getReleaseDate()}</Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{media.type === "movie" ? movieDetails?.release_dates.results.find(result => result.iso_3166_1 === "US").release_dates[0].certification : null} </Text>
            <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{media.type === "movie" ? `${Math.floor(movieDetails?.runtime / 60)} h ${movieDetails?.runtime % 60} min` : null}</Text>
          </View>
          <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{media.type === "game" ? (media.data as IGDB.Game.Game).summary : (media.data as TMDB.Movie.Movie).overview}</Text>
          {media.type === "game" &&
            <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Genres: {(media.data as IGDB.Game.Game).genres.map((genre, i) => <React.Fragment key={i}>{i > 0 ? `, ${genre.name}` : genre.name}</React.Fragment>)}</Text>
          }
          {media.type === "movie" &&
            <View>
              <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Genres: {movieDetails?.genres.map((genre: { id: number, name: string }, i: number) => <React.Fragment key={i}>{i > 0 ? `, ${genre.name}` : genre.name}</React.Fragment>)}</Text>
              <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Status: {movieDetails?.status}</Text>
            </View>
          }
        </View>
        <SegmentedControl
          style={{ marginHorizontal: 16, paddingVertical: 16 }}
          values={media.type === "movie" ? ["Cast & Crew", "Trailers", "Similar"] : ["Credits", "Trailers", "Similar"]}
          selectedIndex={detailIndex}
          onChange={(event) => {
            setDetailIndex(event.nativeEvent.selectedSegmentIndex)
          }}
        />
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          {/* {detailIndex === 0 &&
            <> */}
          <View style={detailIndex !== 0 && media.type === "movie" ? { display: "none" } : {}}>
            {movieDetails?.credits?.crew?.find(person => person?.job === "Director") &&
              <Person navigation={navigation} type={"crew"} person={movieDetails?.credits?.crew?.find(person => person?.job === "Director") as TMDB.Movie.Crew} />
            }

            {movieDetails?.credits.cast.map((person, i) => (
              <Person key={i} navigation={navigation} type={"cast"} person={person} />
            ))}
          </View>
          {/* </> */}
          {/* } */}
          {/* {detailIndex === 1 && media.type === "movie" &&
            <> */}
          <View style={detailIndex !== 1 && media.type === "movie" ? { display: "none" } : {}}>
            {movieDetails?.videos?.results?.map((video, i) => <Trailer key={i} video={video} index={i} />)}
          </View>
          {/* </> */}
          {/* } */}
          {detailIndex === 1 && media.type === "game" &&
            <>
              {(media.data as IGDB.Game.Game).videos?.map((video, i) => <Trailer key={i} video={video} index={i} />)}
            </>
          }
          {/* {detailIndex === 2 && */}
          <View style={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -16, marginTop: 16, marginBottom: -16, display: detailIndex !== 2 ? "none" : "flex" }}>
            {movieDetails?.similar.results.filter(movie => moment(movie.release_date, "YYYY-MM-DD").isSameOrAfter(moment().format("YYYY-MM-DD"))).map((movieRelease, i) => (
              <MediaItem key={i} navigation={navigation} mediaType="movie" index={i} data={movieRelease} />
            ))}
          </View>
          {/* } */}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  modalItem: {
    // width: (Dimensions.get("window").width / 2) - 32, // is 50% of container width
    // height: (4 / 3) * ((Dimensions.get("window").width / 2) - 32),
    width: (Dimensions.get("window").width / 2) - 24, // is 50% of container width
    height: (713 / 500) * ((Dimensions.get("window").width / 2) - 24),
    borderRadius: 8,
    resizeMode: "stretch",
    // marginTop: 16,
    marginBottom: 16,
    // marginLeft: 24,
    // marginRight: 8
    marginLeft: 16,
    marginRight: 8
  },
})

export default Details;
