import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Platform,
  Pressable,
  Appearance,
  FlatList
} from 'react-native';
import { SearchBar, Image } from 'react-native-elements';
import { getUpcomingMovies, searchMovies, getUpcomingGameReleases, searchGames } from '../helpers/requests';
import { IGDB, Navigation, TMDB } from '../../types';
import { reusableStyles } from '../helpers/styles';
import SegmentedControl from '@react-native-community/segmented-control';
import MediaItem from '../components/MediaItem';
import { convertReleasesToGames, onResult } from '../helpers/helpers';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

function Search({ route, navigation }: Navigation.FindScreenProps) {
  const [searchValue, setSearchValue] = useState("")
  const [movies, setMovies] = useState<TMDB.Movie.Movie[]>([])
  const [initMovies, setInitMovies] = useState<TMDB.Movie.Movie[]>([])
  // const [games, setGames] = useState<IGDB.ReleaseDate.ReleaseDate[]>([])
  const [games, setGames] = useState<IGDB.Game.Game[]>([])
  const [initGames, setInitGames] = useState<IGDB.Game.Game[]>([])
  const [categoryIndex, setCategoryIndex] = useState(0)
  const scrollRef = useRef<FlatList>(null);
  const [countdownMovies, setCountdownMovies] = useState([]);
  const [countdownGames, setCountdownGames] = useState([]);

  // function removeOldReleases(games: game[]) {
  //   let tempGames: game[] = [];
  //   games.forEach(game => {
  //     game.release_dates = game.release_dates.filter(releaseDate => moment(moment.unix(releaseDate.date)).isSameOrAfter(moment.unix(moment().unix())));
  //     tempGames.push(game);
  //   });
  //   return tempGames;
  // }

  useEffect(() => {
    let isMounted = true;
    getUpcomingMovies().then(movies => {
      if (isMounted) {
        setInitMovies(movies);
        setMovies(movies);
      };
    })
    // getGameReleases().then(games => {
    getUpcomingGameReleases().then(async releaseDates => {
      await convertReleasesToGames(releaseDates).then(games => {
        // console.log(games)
        if (isMounted) {
          setInitGames(games);
          setGames(games);
        }
      })
        .catch(error => {
          console.log("error 1", error)
        })
      // if (isMounted) setGames(releaseDates);
    })
      .catch(error => {
        console.log("error 2", error)
      })
    return () => { isMounted = false };
  }, [])

  // useEffect(() => {
  //   const movieSubscription = firestore().collection('users').doc(route.params.uid).collection('items').orderBy("release_date").where("mediaType", "==", "movie")
  //     .onSnapshot(querySnapshot => { setCountdownMovies(onResult(querySnapshot, "movies")) }, (error) => console.error("error", error));

  //   const gameSubscription = firestore().collection("users").doc(route.params.uid).collection('items').orderBy("date").where("mediaType", "==", "game")
  //     // firestore().collection("games").orderBy("date").where("owner", "==", user.uid)
  //     .onSnapshot(querySnapshot => { setCountdownGames(onResult(querySnapshot, "games")) }, (error) => console.error("error", error));

  //   // Stop listening for updates when no longer required
  //   return () => {
  //     // Unmounting
  //     movieSubscription();
  //     gameSubscription();
  //   };
  // }, [route.params.uid]);

  function getMovies() {
    const date = new Date();
    const years = [date.getFullYear(), date.getFullYear() + 1, date.getFullYear() + 2, date.getFullYear() + 3];
    let tempMovies: TMDB.Movie.Movie[] = [];
    years.forEach(async year => {
      const searchData = await searchMovies(searchValue, year)
      // console.log(...searchData)
      tempMovies = [...tempMovies, ...searchData]
      // Updating state for each year, need to only update once 
      setMovies(tempMovies)
    });
  }

  const colorScheme = Appearance.getColorScheme();

  const renderItem = ({ item }: { item: TMDB.Movie.Movie | IGDB.Game.Game }) => (
    <MediaItem navigation={navigation} mediaType={categoryIndex === 0 ? "movie" : "game"} data={item}
      // inCountdown={categoryIndex === 0 ?
      //   countdownMovies.some((movie: TMDB.Movie.Movie) => movie.id === item.id) : false}
    />
  );

  return (
    <>
      <View style={colorScheme === "dark" ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
        <SegmentedControl
          style={{ marginHorizontal: 16, marginTop: 8, paddingVertical: 16 }}
          values={['Movies', 'Games']}
          selectedIndex={categoryIndex}
          onChange={(event) => {
            if (event.nativeEvent.selectedSegmentIndex === 0) {
              setGames(initGames);
            }
            if (event.nativeEvent.selectedSegmentIndex === 1) {
              setMovies(initMovies);
            }
            setSearchValue("");
            setCategoryIndex(event.nativeEvent.selectedSegmentIndex);
            scrollRef?.current?.scrollToIndex({
              index: 0,
              animated: false
            })
          }}
        />
      </View>
      <View style={colorScheme === "dark" ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
        <SearchBar
          containerStyle={colorScheme === "dark" ? { backgroundColor: "black", marginHorizontal: 8 } : { marginHorizontal: 8 }}
          inputContainerStyle={colorScheme === "dark" ? { backgroundColor: "#1f1f1f" } : {}}
          placeholderTextColor={colorScheme === "dark" ? "#999999" : undefined}
          searchIcon={colorScheme === "dark" ? { color: "#999999" } : {}}
          inputStyle={colorScheme === "dark" ? { color: "white" } : {}}
          cancelButtonProps={colorScheme === "dark" ? { buttonTextStyle: { color: "#428cff" } } : {}}
          placeholder="Search"
          onChangeText={(value: string) => setSearchValue(value)}
          value={searchValue}
          platform={Platform.OS === "ios" ? "ios" : "android"}
          onSubmitEditing={async (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
            if (categoryIndex === 0) {
              setMovies([]);
              // setMovies(await searchMovies(searchValue))
              getMovies()
            }
            if (categoryIndex === 1) {
              setGames([]);
              setGames(await searchGames(searchValue));
            }
            // setResults(removeOldReleases(await getGamesSearch(searchValue)))
          }}
          onClear={() => {
            if (categoryIndex === 0) {
              setMovies(initMovies);
            }
            if (categoryIndex === 1) {
              setGames(initGames);
            }
          }}
          onCancel={() => {
            if (categoryIndex === 0) {
              setMovies(initMovies);
            }
            if (categoryIndex === 1) {
              setGames(initGames);
            }
          }}
        />
      </View>
      <FlatList
        data={categoryIndex === 0 ? movies : games}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ marginHorizontal: 16 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        ref={scrollRef}
      />
    </>
  );
};

export default Search;
