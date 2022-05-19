import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Modalize } from "react-native-modalize";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import GameDetails from "../components/Details/GameDetails";
import { MovieDetails } from "../components/Details/MovieDetails";
import GameReleaseModal from "../components/GamePlatformPicker";
import { IoniconsHeaderButton } from "../components/IoniconsHeaderButton";
import SubContext from "../contexts/SubContext";
import TabStackContext from "../contexts/TabStackContext";
import { removeSub, subToMovie } from "../helpers/helpers";
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
  const { movie, game } = route.params;
  const modalizeRef = useRef<Modalize>(null);
  const [countdownId, setCountdownId] = useState();
  const { user } = useContext(TabStackContext);
  const { movieSubs, games } = useContext(SubContext);

  useLayoutEffect(() => {
    let title = "";
    if (movie) {
      title = movie.title;
    } else if (game) {
      title = game.name;
    }
    navigation.setOptions({
      title: title,
      headerRight: () => (
        // upcomingRelease() && (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="search"
            iconName={countdownId ? "checkmark-outline" : "add-outline"}
            onPress={() =>
              !countdownId
                ? movie || route.params.tv
                  ? subToMovie(movie?.id.toString(), user)
                  : modalizeRef.current?.open()
                : deleteItem()
            }
          />
        </HeaderButtons>
      ),
      // ),
    });
  }, [route.params, navigation, countdownId]);

  useEffect(() => {
    // console.log("Details Changes", movies, games)
    // let documentID = route.params.type === "movie" ? movies?.find((movie: Movie) => movie.id === (route.params.data as Movie).id)?.documentID : games.find((releaseDate: IGDB.ReleaseDate.ReleaseDate) => releaseDate.game.id === (route.params.data as IGDB.Game.Game).id)?.documentID;
    let documentID;
    if (movie) {
      documentID = movieSubs?.find(
        (sub) => sub.documentID == movie.id.toString()
      )?.documentID;
    }
    if (game) {
      documentID = games.find(
        (releaseDate: IGDB.ReleaseDate.ReleaseDate) =>
          releaseDate.game.id === game.id
      )?.documentID;
    }
    setCountdownId(documentID);
    // setInCountdown(movies.some((movie: Movie) => movie.id === route.params.data.id))
  }, [movieSubs, games]);

  async function deleteItem() {
    console.log("route.params.data.id", countdownId);
    // console.log('route.params.type', route.params.type)
    let collection = "";
    if (movie) {
      collection = "movies";
    }
    if (game) {
      collection = "gameReleases";
    }
    removeSub(collection, countdownId, user);
  }

  return (
    <>
      {game && (
        <>
          <GameDetails navigation={navigation} game={game} />
          <GameReleaseModal modalizeRef={modalizeRef} game={game} />
        </>
      )}
      {movie && <MovieDetails navigation={navigation} movieId={movie.id} />}
    </>
  );
}

export default Details;
