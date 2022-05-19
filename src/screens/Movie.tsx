import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { AnimatedBackground } from "../components/AnimatedBackground";
import { MovieDetails } from "../components/Details/MovieDetails";
import { IoniconsHeaderButton } from "../components/IoniconsHeaderButton";
import SubContext from "../contexts/SubContext";
import TabStackContext from "../contexts/TabStackContext";
import { removeSub, subToMovie } from "../helpers/helpers";
import { FirestoreMovie } from "../interfaces/firebase";
import { Navigation } from "../interfaces/navigation";

interface Props {
  navigation:
    | CompositeNavigationProp<
        StackNavigationProp<Navigation.FindStackParamList, "Movie">,
        BottomTabNavigationProp<Navigation.TabNavigationParamList, "FindTab">
      >
    | CompositeNavigationProp<
        StackNavigationProp<Navigation.CountdownStackParamList, "Movie">,
        BottomTabNavigationProp<
          Navigation.TabNavigationParamList,
          "CountdownTab"
        >
      >;
  route: RouteProp<
    Navigation.FindStackParamList | Navigation.CountdownStackParamList,
    "Movie"
  >;
}

function Movie({ navigation, route }: Props) {
  const { movie } = route.params;
  const [countdownId, setCountdownId] =
    useState<FirestoreMovie["documentID"]>();
  const { user } = useContext(TabStackContext);
  const { movieSubs } = useContext(SubContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: movie.title,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="search"
            iconName={countdownId ? "checkmark-outline" : "add-outline"}
            onPress={() =>
              !countdownId
                ? subToMovie(movie.id.toString(), user)
                : removeSub("movies", countdownId, user)
            }
          />
        </HeaderButtons>
      ),
    });
  }, [movie, navigation, countdownId]);

  useEffect(() => {
    let documentID = movieSubs.find(
      (sub) => sub.documentID == movie.id.toString()
    )?.documentID;

    setCountdownId(documentID);
  }, [movieSubs, movie]);

  return (
    <AnimatedBackground
      uri={movie.backdrop_path ? movie.backdrop_path : movie.poster_path}
    >
      <MovieDetails navigation={navigation} movieId={movie.id} />
    </AnimatedBackground>
  );
}

export default Movie;
