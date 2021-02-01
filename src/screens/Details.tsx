import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  Pressable,
  Appearance,
  Text,
  StyleSheet,
} from 'react-native';

import moment from 'moment';
import { IGDB, Navigation, TMDB } from '../../types';
import { Image } from 'react-native-elements';
import { getMovieDetails } from '../helpers/requests';
import { reusableStyles } from '../helpers/styles';
import { iOSColors, iOSUIKit } from 'react-native-typography'
import Trailer from '../components/Trailer';
import Cast from './Cast';
import MediaItem from '../components/MediaItem';
import Person from '../components/Person';
import { Modalize } from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderButton, HeaderButtonProps, HeaderButtons, Item } from 'react-navigation-header-buttons';
import { months } from '../helpers/helpers';
import firestore from '@react-native-firebase/firestore';
import CategoryControl from '../components/CategoryControl';

function Details({ route, navigation, countdownMovies, countdownGames }: Navigation.DetailsScreenProps) {
  const media = route.params;
  const [movieDetails, setMovieDetails] = useState<TMDB.Movie.Details>();
  const [detailIndex, setDetailIndex] = useState(0)
  const modalizeRef = useRef<Modalize>(null);
  const [countdownId, setCountdownId] = useState();

  const IoniconsHeaderButton = (props: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<HeaderButton> & Readonly<HeaderButtonProps> & Readonly<any>) => (
    // the `props` here come from <Item ... />
    // you may access them and pass something else to `HeaderButton` if you like
    // <HeaderButton IconComponent={Ionicons} iconSize={30} color={route.params.inCountdown ? iOSColors.red : iOSColors.blue} {...props} />
    <HeaderButton IconComponent={Ionicons} iconSize={30} color={iOSColors.blue} {...props} />
  );

  useEffect(() => {
    // console.log((media.data as IGDB.Game.Game).involved_companies)
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
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          {/* <Item title="search" iconName={route.params.inCountdown ? "remove-circle-outline" : "add-circle-outline"} onPress={() => media.type === "movie" ? addToList() : modalizeRef.current?.open()} /> */}
          <Item title="search" iconName={countdownId ? "checkmark-outline" : "add-outline"} onPress={() => media.type === "movie" ? (countdownId ? deleteItem() : addToList()) : (countdownId ? deleteItem() : modalizeRef.current?.open())} />
        </HeaderButtons>
      )
    });
  }, [navigation, countdownId]);

  useEffect(() => {
    // console.log("Details Changes", countdownMovies, countdownGames)
    let documentID = media.type === "movie" ? countdownMovies.find((movie: TMDB.Movie.Movie) => movie.id === media.data.id)?.documentID : countdownGames.find((releaseDate: IGDB.ReleaseDate.ReleaseDate) => releaseDate.game.id === media.data.id)?.documentID;
    setCountdownId(documentID)
    // setInCountdown(countdownMovies.some((movie: TMDB.Movie.Movie) => movie.id === media.data.id))
  }, [countdownMovies, countdownGames])

  // const colorScheme = Appearance.getColorScheme();
  const colorScheme = "dark"

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

  function formatDate(item: IGDB.Game.ReleaseDate) {
    let date = new Date(item.date * 1000);
    let monthIndex = new Date(date).getUTCMonth();
    // return `${months[monthIndex].toUpperCase()} ${date.getUTCDate()}, ${new Date(date).getUTCFullYear()}`
    return `${(monthIndex + 1).toString().length < 2 ? "0" : ""}${monthIndex + 1}/${date.getUTCDate().toString().length < 2 ? "0" : ""}${date.getUTCDate()}/${new Date(date).getUTCFullYear()}`;
  }

  async function addToList() {
    console.log('media', media)
    try {
      await firestore().collection("movies").doc(media.data.id.toString()).set(media.data, { merge: true });
      console.log("Document successfully written!");
      await firestore().collection("movies").doc(media.data.id.toString()).update({
        subscribers: firestore.FieldValue.arrayUnion(route.params.uid)
      })
      console.log("Document updated written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  async function deleteItem() {
    console.log('media.data.id', countdownId)
    // console.log('media.type', media.type)
    try {
      await firestore().collection(media.type === "movie" ? "movies" : "gameReleases").doc(countdownId).update({
        subscribers: firestore.FieldValue.arrayRemove(route.params.uid)
      })
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  async function addGameRelease(releaseDate: IGDB.Game.ReleaseDate) {
    // console.log("releaseDate", releaseDate);
    let game = {
      cover: (media.data as IGDB.Game.Game).cover,
      id: (media.data as IGDB.Game.Game).id,
      name: (media.data as IGDB.Game.Game).name,
      summary: (media.data as IGDB.Game.Game).summary
    }
    // console.log(game);
    releaseDate.game = game;
    try {
      await firestore().collection("gameReleases").doc(releaseDate.id.toString()).set(releaseDate, { merge: true })
      console.log("Document successfully written!");
      await firestore().collection("gameReleases").doc(releaseDate.id.toString()).update({
        subscribers: firestore.FieldValue.arrayUnion(route.params.uid)
      })
      console.log("Document updated successfully.")
      modalizeRef.current?.close()
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
              onPress={() => addGameRelease(releaseDate)}
              style={{
                marginHorizontal: 16,
                marginTop: 16,
                paddingBottom: i < (media.data as IGDB.Game.Game).release_dates.filter(releaseDate => releaseDate.region === 2 || releaseDate.region === 8).length - 1 ? 16 : 0,
                borderBottomWidth: i < (media.data as IGDB.Game.Game).release_dates.filter(releaseDate => releaseDate.region === 2 || releaseDate.region === 8).length - 1 ? StyleSheet.hairlineWidth : 0,
                borderColor: i < (media.data as IGDB.Game.Game).release_dates.filter(releaseDate => releaseDate.region === 2 || releaseDate.region === 8).length - 1 ? "#3c3d41" : undefined
              }}
            >
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{releaseDate.platform.name}</Text>
                {getReleaseDate() === "MULTIPLE DATES" &&
                  <Text style={reusableStyles.date}>{formatDate(releaseDate)}</Text>
                }
              </View>
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
          {/* <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{media.type === "movie" ? movieDetails?.release_dates.results.find(result => result.iso_3166_1 === "US").release_dates[0].certification : null} </Text>
            <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{media.type === "movie" ? `${Math.floor(movieDetails?.runtime / 60)} h ${movieDetails?.runtime % 60} min` : null}</Text>
          </View> */}
          <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>{media.type === "game" ? (media.data as IGDB.Game.Game).summary : (media.data as TMDB.Movie.Movie).overview}</Text>
          {media.type === "game" &&
            // <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>
            //   Genres: {(media.data as IGDB.Game.Game).genres.map((genre, i) =>
            //   <React.Fragment key={i}>{i > 0 ? `, ${genre.name}` : genre.name}</React.Fragment>)}
            // </Text>
            <View style={{ flexDirection: "row", paddingTop: 16, flexWrap: "wrap" }}>
              <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>Genres: </Text>
              {(media.data as IGDB.Game.Game).genres.map((genre, i) =>
                <View style={{ flexDirection: "row" }} key={i}>
                  {i > 0 ? <View style={{ width: 5, height: 5, borderRadius: 5, marginHorizontal: 5, backgroundColor: iOSColors.blue, alignSelf: "center" }} /> : null}
                  {i > 0 ? <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, } : { ...iOSUIKit.bodyObject }}>{genre.name}</Text> : <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>{genre.name}</Text>}
                </View>
              )}
            </View>
          }
          {media.type === "movie" &&
            <View>
              {/* <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>Genres: {movieDetails?.genres.map((genre: { id: number, name: string }, i: number) => <React.Fragment key={i}>{i > 0 ? `, ${genre.name}` : genre.name}</React.Fragment>)}</Text> */}
              <View style={{ flexDirection: "row", paddingTop: 16, flexWrap: "wrap" }}>
                <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>Genres: </Text>
                {movieDetails?.genres.map((genre: { id: number, name: string }, i: number) =>
                  <View style={{ flexDirection: "row" }} key={i}>
                    {i > 0 ? <View style={{ width: 5, height: 5, borderRadius: 5, marginHorizontal: 5, backgroundColor: iOSColors.blue, alignSelf: "center" }} /> : null}
                    {i > 0 ? <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, } : { ...iOSUIKit.bodyObject }}>{genre.name}</Text> : <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>{genre.name}</Text>}
                  </View>
                )}
              </View>
              <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>Status: {movieDetails?.status}</Text>
            </View>
          }
        </View>
        <CategoryControl buttons={media.type === "movie" ? ["Cast & Crew", "Trailers"] : ["Credits", "Trailers"]} categoryIndex={detailIndex} handleCategoryChange={(index: number) => setDetailIndex(index)} />
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <View style={detailIndex !== 0 && media.type === "movie" ? { display: "none" } : {}}>
            {movieDetails?.credits?.crew?.find(person => person?.job === "Director") &&
              <Person navigation={navigation} type={"crew"} person={movieDetails?.credits?.crew?.find(person => person?.job === "Director") as TMDB.Movie.Crew} />
            }
            {movieDetails?.credits.cast.map((person, i) => (
              <Person key={i} navigation={navigation} type={"cast"} person={person} />
            ))}
          </View>
          <View style={detailIndex !== 1 && media.type === "movie" ? { display: "none" } : {}}>
            {movieDetails?.videos?.results?.map((video, i) => <Trailer key={i} video={video} index={i} />)}
            {movieDetails?.videos?.results?.length === 0 &&
              <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>No trailers yet! Come back later!</Text>
            }
          </View>

          {detailIndex === 0 && media.type === "game" &&
            <>
              {(media.data as IGDB.Game.Game).involved_companies?.find(company => company.publisher) &&
                <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>Published by:
                {(media.data as IGDB.Game.Game).involved_companies.filter(company => company.publisher)
                    .map((company, i) =>
                      <React.Fragment key={i}>{i > 0 ? `, ${company.company.name}` : ` ${company.company.name}`}</React.Fragment>
                    )}
                </Text>
              }
              {(media.data as IGDB.Game.Game).involved_companies?.find(company => company.developer) &&
                <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>Developed by:
                {(media.data as IGDB.Game.Game).involved_companies.filter(company => company.developer)
                    .map((company, i) =>
                      <React.Fragment key={i}>{i > 0 ? `, ${company.company.name}` : ` ${company.company.name}`}</React.Fragment>
                    )}
                </Text>
              }
              {(media.data as IGDB.Game.Game).involved_companies?.find(company => company.supporting) &&
                // <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>Supported by:
                // {(media.data as IGDB.Game.Game).involved_companies.filter(company => company.supporting)
                //     .map((company, i) =>
                //       <React.Fragment key={i}>{i > 0 ? `, ${company.company.name}` : ` ${company.company.name}`}</React.Fragment>
                //     )}
                // </Text>
                <View style={{ flexDirection: "row", paddingTop: 16, flexWrap: "wrap" }}>
                  <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>Supported by: </Text>
                  {(media.data as IGDB.Game.Game).involved_companies.filter(company => company.supporting)
                    .map((company, i) =>
                      <View style={{ flexDirection: "row" }} key={i}>
                        {i > 0 ? <View style={{ width: 5, height: 5, borderRadius: 5, marginHorizontal: 5, backgroundColor: iOSColors.blue, alignSelf: "center" }} /> : null}
                        {i > 0 ? <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, } : { ...iOSUIKit.bodyObject }}>{company.company.name}</Text> : <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>{company.company.name}</Text>}
                      </View>
                    )}
                </View>
              }
              {/* <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Ported by:
                {(media.data as IGDB.Game.Game).involved_companies.filter(company => company.porting)
                  .map((company, i) =>
                    <React.Fragment key={i}>{i > 0 ? `, ${company.company.name}` : ` ${company.company.name}`}</React.Fragment>
                  )}
              </Text> */}
              {/* {(media.data as IGDB.Game.Game).involved_companies.map((company, i) => <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Publisher: {JSON.stringify(company)}</Text>)} */}
            </>
          }
          {detailIndex === 1 && media.type === "game" &&
            <>
              {(media.data as IGDB.Game.Game).videos?.map((video, i) => <Trailer key={i} video={video} index={i} />)}
              {(media.data as IGDB.Game.Game).videos === undefined &&
                <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>No trailers yet! Come back later!</Text>
              }
            </>
          }
          {/* <View style={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -16, marginTop: 16, marginBottom: -16, display: detailIndex !== 2 ? "none" : "flex" }}>
            {movieDetails?.similar.results.filter(movie => moment(movie.release_date, "YYYY-MM-DD").isSameOrAfter(moment().format("YYYY-MM-DD"))).map((movieRelease, i) => (
              <MediaItem key={i} navigation={navigation} mediaType="movie" data={movieRelease} />
            ))}
          </View> */}
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
