import React, { useState, useEffect, useRef, useContext, useLayoutEffect } from 'react';
import { IGDB, Navigation, TMDB } from '../../types';
import { iOSColors } from 'react-native-typography'
import { Modalize } from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderButton, HeaderButtonProps, HeaderButtons, Item } from 'react-navigation-header-buttons';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import GameDetails from '../components/Details/GameDetails';
import MovieDetails from '../components/Details/MovieDetails';
import UserContext from '../contexts/UserContext';
import { GameSubContext, MovieSubContext } from '../contexts/SubContexts';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import GameReleaseModal from '../components/GamePlatformPicker';

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList | Navigation.CountdownStackParamList, 'Details'>,
  route: RouteProp<Navigation.FindStackParamList, 'Details'>,
}

function Details({ route, navigation }: Props) {
  const modalizeRef = useRef<Modalize>(null);
  const [countdownId, setCountdownId] = useState();
  const uid = useContext(UserContext)
  const movieSubs = useContext(MovieSubContext)
  const gameSubs = useContext(GameSubContext)

  useEffect(() => {
    console.log(`route.params.data`, route.params.data)
    let title = "";
    if (route.params.type === "movie") {
      title = (route.params.data as TMDB.Movie.Movie).title;
    }
    else if (route.params.type === "game") {
      title = (route.params.data as IGDB.Game.Game).name;
    }
    navigation.setOptions({ title: title });
  }, [route.params.data])

  const IoniconsHeaderButton = (props: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<HeaderButton> & Readonly<HeaderButtonProps> & Readonly<any>) => (
    // the `props` here come from <Item ... />
    // you may access them and pass something else to `HeaderButton` if you like
    // <HeaderButton IconComponent={Ionicons} iconSize={30} color={route.params.inCountdown ? iOSColors.red : iOSColors.blue} {...props} />
    <HeaderButton IconComponent={Ionicons} iconSize={30} color={iOSColors.blue} {...props} />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="search"
            iconName={countdownId ? "checkmark-outline" : "add-outline"}
            onPress={
              () => route.params.type === "movie" || route.params.type === "tv"
                ? (countdownId ? deleteItem() : addMovieToList())
                : (countdownId ? deleteItem() : modalizeRef.current?.open())
            }
          />
        </HeaderButtons>
      )
    });
  }, [navigation, countdownId]);

  useEffect(() => {
    // console.log("Details Changes", movieSubs, gameSubs)
    // let documentID = route.params.type === "movie" ? movieSubs?.find((movie: TMDB.Movie.Movie) => movie.id === (route.params.data as TMDB.Movie.Movie).id)?.documentID : gameSubs.find((releaseDate: IGDB.ReleaseDate.ReleaseDate) => releaseDate.game.id === (route.params.data as IGDB.Game.Game).id)?.documentID;
    let documentID;
    if (route.params.type === "movie") {
      documentID = movieSubs?.find((movie: TMDB.Movie.Movie) => movie.id === (route.params.data as TMDB.Movie.Movie).id)?.documentID;
    }
    if (route.params.type === "game") {
      documentID = gameSubs.find((releaseDate: IGDB.ReleaseDate.ReleaseDate) => releaseDate.game.id === (route.params.data as IGDB.Game.Game).id)?.documentID;
    }
    setCountdownId(documentID)
    // setInCountdown(movieSubs.some((movie: TMDB.Movie.Movie) => movie.id === route.params.data.id))
  }, [movieSubs, gameSubs])

  let docId = "";
  if (route.params.type === "movie") { docId = (route.params.data as TMDB.Movie.Movie).id.toString(); }

  async function addMovieToList() {
    try {
      await firestore().collection("movies").doc(docId).set((route.params.data), { merge: true });
      await firestore().collection("movies").doc(docId).update({
        subscribers: firestore.FieldValue.arrayUnion(uid)
      })
      ReactNativeHapticFeedback.trigger("impactLight", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false
      })
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  async function deleteItem() {
    console.log('route.params.data.id', countdownId)
    // console.log('route.params.type', route.params.type)
    let collection = "";
    if (route.params.type === "movie") { collection = "movies" };
    if (route.params.type === "game") { collection = "gameReleases" };
    try {
      await firestore().collection(collection).doc(countdownId).update({
        subscribers: firestore.FieldValue.arrayRemove(uid)
      })
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return (
    <>
      {route.params.type === "game" &&
        <>
          <GameDetails
            navigation={navigation}
            game={route.params.data as IGDB.Game.Game}
          />
          <GameReleaseModal modalizeRef={modalizeRef} game={route.params.data as IGDB.Game.Game} />
        </>
      }
      {route.params.type === "movie" &&
        <MovieDetails
          navigation={navigation}
          movie={route.params.data as TMDB.Movie.Movie}
        />
      }
    </>
  );
};

export default Details;
