import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Modalize } from "react-native-modalize";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import firestore from "@react-native-firebase/firestore";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DateTime } from "luxon";

import GameDetails from "../components/Details/GameDetails";
import { MovieDetails } from "../components/Details/MovieDetails";
import GameReleaseModal from "../components/GamePlatformPicker";
import { IoniconsHeaderButton } from "../components/IoniconsHeaderButton";
import SubContext from "../contexts/SubContext";
import TabStackContext from "../contexts/TabStackContext";
import { IGDB } from "../interfaces/igdb";
import { Navigation } from "../interfaces/navigation";

interface Props {
  navigation:
    | CompositeNavigationProp<
        StackNavigationProp<Navigation.FindStackParamList, "Details">,
        BottomTabNavigationProp<Navigation.TabNavigationParamList, "FindTab">
      >
    | CompositeNavigationProp<
        StackNavigationProp<Navigation.CountdownStackParamList, "Details">,
        BottomTabNavigationProp<
          Navigation.TabNavigationParamList,
          "CountdownTab"
        >
      >;
  route: RouteProp<
    Navigation.FindStackParamList | Navigation.CountdownStackParamList,
    "Details"
  >;
}

function Details({ navigation, route }: Props) {
  const modalizeRef = useRef<Modalize>(null);
  const [countdownId, setCountdownId] = useState();
  const { user } = useContext(TabStackContext);
  const { movies, games } = useContext(SubContext);

  useEffect(() => {
    if (route.params.movie) {
      navigation.setOptions({ title: route.params.movie.title });
    } else if (route.params.game) {
      navigation.setOptions({ title: route.params.game.name });
    }
  }, [route.params]);

  function upcomingRelease() {
    if (
      route.params.movie &&
      DateTime.fromISO(route.params.movie.release_date) >= DateTime.now()
    ) {
      return true;
    } else if (
      route.params.game &&
      route.params.game.release_dates.filter(
        (releaseDate) => DateTime.fromISO(releaseDate.date) >= DateTime.now()
      ).length === 0
    ) {
      return true;
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        upcomingRelease() && (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            <Item
              title="search"
              iconName={countdownId ? "checkmark-outline" : "add-outline"}
              onPress={() =>
                route.params.movie || route.params.tv
                  ? countdownId
                    ? deleteItem()
                    : addMovieToList()
                  : countdownId
                  ? deleteItem()
                  : modalizeRef.current?.open()
              }
            />
          </HeaderButtons>
        ),
    });
  }, [navigation, countdownId]);

  useEffect(() => {
    // console.log("Details Changes", movies, games)
    // let documentID = route.params.type === "movie" ? movies?.find((movie: Movie) => movie.id === (route.params.data as Movie).id)?.documentID : games.find((releaseDate: IGDB.ReleaseDate.ReleaseDate) => releaseDate.game.id === (route.params.data as IGDB.Game.Game).id)?.documentID;
    let documentID;
    if (route.params.movie) {
      documentID = movies?.find(
        (movie: Movie) => movie.id === route.params.movie.id
      )?.documentID;
    }
    if (route.params.game) {
      documentID = games.find(
        (releaseDate: IGDB.ReleaseDate.ReleaseDate) =>
          releaseDate.game.id === route.params.game.id
      )?.documentID;
    }
    setCountdownId(documentID);
    // setInCountdown(movies.some((movie: Movie) => movie.id === route.params.data.id))
  }, [movies, games]);

  let docId = "";
  if (route.params.movie) {
    docId = route.params.movie.id.toString();
  }

  async function addMovieToList() {
    try {
      await firestore()
        .collection("movies")
        .doc(docId)
        .set(route.params.movie, { merge: true });
      await firestore()
        .collection("movies")
        .doc(docId)
        .update({
          subscribers: firestore.FieldValue.arrayUnion(user),
        });
      ReactNativeHapticFeedback.trigger("impactLight", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  async function deleteItem() {
    console.log("route.params.data.id", countdownId);
    // console.log('route.params.type', route.params.type)
    let collection = "";
    if (route.params.movie) {
      collection = "movies";
    }
    if (route.params.game) {
      collection = "gameReleases";
    }
    try {
      await firestore()
        .collection(collection)
        .doc(countdownId)
        .update({
          subscribers: firestore.FieldValue.arrayRemove(user),
        });
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return (
    <>
      {route.params.game && (
        <>
          <GameDetails navigation={navigation} game={route.params.game} />
          <GameReleaseModal
            modalizeRef={modalizeRef}
            game={route.params.game}
          />
        </>
      )}
      {route.params.movie && (
        <MovieDetails navigation={navigation} movieId={route.params.movie.id} />
      )}
    </>
  );
}

export default Details;
