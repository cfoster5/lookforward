import React, { useState, useEffect, useRef, useContext } from 'react';
import { IGDB, Navigation, TMDB, Trakt } from '../../types';
import { iOSColors } from 'react-native-typography'
import { Modalize } from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderButton, HeaderButtonProps, HeaderButtons, Item } from 'react-navigation-header-buttons';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import GameDetails from '../components/Details/GameDetails';
import MovieDetails from '../components/Details/MovieDetails';
import ShowDetails from '../components/Details/ShowDetails';
import UserContext from '../UserContext';

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList | Navigation.CountdownStackParamList, 'Details'>,
  route: RouteProp<Navigation.FindStackParamList, 'Details'>,
  countdownMovies: any[];
  countdownGames: any[];
  showSubs: any[];
}

function Details({ route, navigation, countdownMovies, countdownGames, showSubs }: Props) {
  const modalizeRef = useRef<Modalize>(null);
  const [countdownId, setCountdownId] = useState();
  const uid = useContext(UserContext)

  useEffect(() => {
    console.log(`route.params.data`, route.params.data)
  }, [route.params.data])

  const IoniconsHeaderButton = (props: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<HeaderButton> & Readonly<HeaderButtonProps> & Readonly<any>) => (
    // the `props` here come from <Item ... />
    // you may access them and pass something else to `HeaderButton` if you like
    // <HeaderButton IconComponent={Ionicons} iconSize={30} color={route.params.inCountdown ? iOSColors.red : iOSColors.blue} {...props} />
    <HeaderButton IconComponent={Ionicons} iconSize={30} color={iOSColors.blue} {...props} />
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          {/* <Item title="search" iconName={route.params.inCountdown ? "remove-circle-outline" : "add-circle-outline"} onPress={() => route.params.type === "movie" ? addToList() : modalizeRef.current?.open()} /> */}
          <Item title="search" iconName={countdownId ? "checkmark-outline" : "add-outline"} onPress={() => route.params.type === "movie" || route.params.type === "tv" ? (countdownId ? deleteItem() : addToList()) : (countdownId ? deleteItem() : modalizeRef.current?.open())} />
        </HeaderButtons>
      )
    });
  }, [navigation, countdownId]);

  useEffect(() => {
    // console.log("Details Changes", countdownMovies, countdownGames)
    // let documentID = route.params.type === "movie" ? countdownMovies?.find((movie: TMDB.Movie.Movie) => movie.id === (route.params.data as TMDB.Movie.Movie).id)?.documentID : countdownGames.find((releaseDate: IGDB.ReleaseDate.ReleaseDate) => releaseDate.game.id === (route.params.data as IGDB.Game.Game).id)?.documentID;
    let documentID;
    if (route.params.type === "movie") {
      documentID = countdownMovies?.find((movie: TMDB.Movie.Movie) => movie.id === (route.params.data as TMDB.Movie.Movie).id)?.documentID;
    }
    if (route.params.type === "tv") {
      documentID = showSubs?.find((show: Trakt.ShowPremiere) => show.show.ids.trakt === (route.params.data as Trakt.ShowPremiere)?.show.ids.trakt)?.documentID;
    }
    if (route.params.type === "game") {
      documentID = countdownGames.find((releaseDate: IGDB.ReleaseDate.ReleaseDate) => releaseDate.game.id === (route.params.data as IGDB.Game.Game).id)?.documentID;
    }
    setCountdownId(documentID)
    // setInCountdown(countdownMovies.some((movie: TMDB.Movie.Movie) => movie.id === route.params.data.id))
  }, [countdownMovies, countdownGames, showSubs])

  let docId = "";
  if (route.params.type === "movie") { docId = (route.params.data as TMDB.Movie.Movie).id.toString(); }
  if (route.params.type === "tv") { docId = (route.params.data as Trakt.ShowPremiere).show.ids.trakt.toString(); }

  async function addToList() {
    try {
      await firestore().collection(route.params.type === "movie" ? "movies" : "shows").doc(docId).set((route.params.data), { merge: true });
      console.log("Document successfully written!");
      await firestore().collection(route.params.type === "movie" ? "movies" : "shows").doc(docId).update({
        subscribers: firestore.FieldValue.arrayUnion(uid)
      })
      console.log("Document updated written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  async function deleteItem() {
    console.log('route.params.data.id', countdownId)
    // console.log('route.params.type', route.params.type)
    let collection = "";
    if (route.params.type === "movie") { collection = "movies" };
    if (route.params.type === "tv") { collection = "shows" };
    if (route.params.type === "game") { collection = "gameReleases" };
    try {
      await firestore().collection(collection).doc(countdownId).update({
        subscribers: firestore.FieldValue.arrayRemove(uid)
      })
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return (
    <>
      {route.params.type === "game" &&
        <GameDetails
          navigation={navigation}
          game={route.params.data as IGDB.Game.Game}
          modalizeRef={modalizeRef}
        />
      }
      {route.params.type === "movie" &&
        <MovieDetails
          navigation={navigation}
          movie={route.params.data as TMDB.Movie.Movie}
        />
      }
      {route.params.type === "tv" &&
        <ShowDetails
          navigation={navigation}
          show={route.params.data as Trakt.ShowPremiere | Trakt.ShowSearch}
        />
      }
    </>
  );
};

export default Details;
