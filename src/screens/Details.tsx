import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Modalize } from "react-native-modalize";
import { iOSColors } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  HeaderButton,
  HeaderButtonProps,
  HeaderButtons,
  Item,
} from "react-navigation-header-buttons";
import firestore from "@react-native-firebase/firestore";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DateTime } from "luxon";

import GameDetails from "../components/Details/GameDetails";
import MovieDetails from "../components/Details/MovieDetails";
import GameReleaseModal from "../components/GamePlatformPicker";
import SubContext from "../contexts/SubContext";
import TabStackContext from "../contexts/TabStackContext";
import { IGDB } from "../interfaces/igdb";
import { Navigation } from "../interfaces/navigation";
import { Movie } from "../interfaces/tmdb";

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
    console.log(`route.params.data`, route.params.data);
    let title = "";
    if (route.params.type === "movie") {
      title = (route.params.data as Movie).title;
    } else if (route.params.type === "game") {
      title = (route.params.data as IGDB.Game.Game).name;
    }
    navigation.setOptions({ title: title });
  }, [route.params.data]);

  const IoniconsHeaderButton = (
    props: JSX.IntrinsicAttributes &
      JSX.IntrinsicClassAttributes<HeaderButton> &
      Readonly<HeaderButtonProps> &
      Readonly<any>
  ) => (
    // the `props` here come from <Item ... />
    // you may access them and pass something else to `HeaderButton` if you like
    // <HeaderButton IconComponent={Ionicons} iconSize={30} color={route.params.inCountdown ? iOSColors.red : iOSColors.blue} {...props} />
    <HeaderButton
      IconComponent={Ionicons}
      iconSize={30}
      color={iOSColors.blue}
      {...props}
    />
  );

  function upcomingRelease() {
    if (
      route.params.type === "movie" &&
      DateTime.fromISO((route.params.data as Movie).release_date) >=
        DateTime.now()
    ) {
      return true;
    } else if (
      route.params.type === "game" &&
      (route.params.data as IGDB.Game.Game).release_dates.filter(
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
                route.params.type === "movie" || route.params.type === "tv"
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
    if (route.params.type === "movie") {
      documentID = movies?.find(
        (movie: Movie) => movie.id === (route.params.data as Movie).id
      )?.documentID;
    }
    if (route.params.type === "game") {
      documentID = games.find(
        (releaseDate: IGDB.ReleaseDate.ReleaseDate) =>
          releaseDate.game.id === (route.params.data as IGDB.Game.Game).id
      )?.documentID;
    }
    setCountdownId(documentID);
    // setInCountdown(movies.some((movie: Movie) => movie.id === route.params.data.id))
  }, [movies, games]);

  let docId = "";
  if (route.params.type === "movie") {
    docId = (route.params.data as Movie).id.toString();
  }

  async function addMovieToList() {
    try {
      await firestore()
        .collection("movies")
        .doc(docId)
        .set(route.params.data, { merge: true });
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
    if (route.params.type === "movie") {
      collection = "movies";
    }
    if (route.params.type === "game") {
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
      {route.params.type === "game" && (
        <>
          <GameDetails
            navigation={navigation}
            game={route.params.data as IGDB.Game.Game}
          />
          <GameReleaseModal
            modalizeRef={modalizeRef}
            game={route.params.data as IGDB.Game.Game}
          />
        </>
      )}
      {route.params.type === "movie" && (
        <MovieDetails
          navigation={navigation}
          movie={route.params.data as Movie}
        />
      )}
    </>
  );
}

export default Details;
