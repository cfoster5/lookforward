import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import firestore from "@react-native-firebase/firestore";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { MovieDetails } from "../components/Details/MovieDetails";
import { IoniconsHeaderButton } from "../components/IoniconsHeaderButton";
import SubContext from "../contexts/SubContext";
import TabStackContext from "../contexts/TabStackContext";
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

function Movie({ navigation, route }: Props) {
  const { movie } = route.params;
  const [countdownId, setCountdownId] = useState();
  const { user } = useContext(TabStackContext);
  const { movieSubs } = useContext(SubContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: movie?.title,
      headerRight: () => (
        // upcomingRelease() && (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="search"
            iconName={countdownId ? "checkmark-outline" : "add-outline"}
            onPress={() => (!countdownId ? addMovieToList() : deleteItem())}
          />
        </HeaderButtons>
      ),
      // ),
    });
  }, [movie, navigation, countdownId]);

  useEffect(() => {
    // console.log("Details Changes", movies, games)
    // let documentID = route.params.type === "movie" ? movies?.find((movie: Movie) => movie.id === (route.params.data as Movie).id)?.documentID : games.find((releaseDate: IGDB.ReleaseDate.ReleaseDate) => releaseDate.game.id === (route.params.data as IGDB.Game.Game).id)?.documentID;
    let documentID = movieSubs?.find(
      (sub) => sub.documentID == movie?.id.toString()
    )?.documentID;

    setCountdownId(documentID);
    // setInCountdown(movies.some((movie: Movie) => movie.id === route.params.data.id))
  }, [movieSubs]);

  async function addMovieToList() {
    try {
      await firestore()
        .collection("movies")
        .doc(movie?.id.toString())
        .set(
          { subscribers: firestore.FieldValue.arrayUnion(user) },
          { merge: true }
        );
      ReactNativeHapticFeedback.trigger("impactLight", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  async function deleteItem() {
    try {
      await firestore()
        .collection("movies")
        .doc(countdownId)
        .update({
          subscribers: firestore.FieldValue.arrayRemove(user),
        });
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return <MovieDetails navigation={navigation} movieId={movie.id} />;
}

export default Movie;
