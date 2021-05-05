import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Platform,
  FlatList,
  ColorSchemeName
} from 'react-native';
import { SearchBar, Image } from 'react-native-elements';
import { getUpcomingMovies, searchMovies, getUpcomingGameReleases, searchGames, getUpcomingTVPremieres } from '../helpers/requests';
import { IGDB, Navigation, TMDB, Trakt } from '../../types';
import Poster from '../components/Poster';
import usePrevious, { convertReleasesToGames } from '../helpers/helpers';
import { RouteProp, useScrollToTop } from '@react-navigation/native';
import CategoryControl from '../components/CategoryControl';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, 'Find'>,
  route: RouteProp<Navigation.FindStackParamList, 'Find'>,
  countdownMovies: any,
  countdownGames: any,
  countdownShows: any,
  colorScheme: ColorSchemeName
}

function Search({ navigation, route, countdownMovies, countdownGames, countdownShows, colorScheme }: Props) {
  const [searchValue, setSearchValue] = useState("")
  const [movies, setMovies] = useState<TMDB.Movie.Movie[]>([])
  const [initMovies, setInitMovies] = useState<TMDB.Movie.Movie[]>([])
  // const [games, setGames] = useState<IGDB.ReleaseDate.ReleaseDate[]>([])
  const [games, setGames] = useState<IGDB.Game.Game[]>([])
  const [initGames, setInitGames] = useState<IGDB.Game.Game[]>([])
  const [categoryIndex, setCategoryIndex] = useState(0)
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const searchRef = useRef<SearchBar>(null);
  const prevCategoryIndex = usePrevious(categoryIndex);
  const [showPremieres, setShowPremieres] = useState<Trakt.ShowPremiere[]>([]);

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
    getUpcomingGameReleases(route.params.igdbCreds.access_token).then(async releaseDates => {
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

    getUpcomingTVPremieres().then(premieres => isMounted ? setShowPremieres(premieres) : null);

    return () => { isMounted = false };
  }, [])

  useEffect(() => {
    if (categoryIndex !== 0) {
      setMovies(initMovies);
    }
    if (categoryIndex !== 1) {
      setGames(initGames);
    }
    setSearchValue("");
    searchRef.current?.clear();

    // Scroll to top on category change; Only after setting initial value
    if (prevCategoryIndex !== undefined && prevCategoryIndex !== categoryIndex) {
      scrollRef?.current?.scrollToIndex({
        index: 0,
        animated: false
      })
    }
  }, [categoryIndex])

  // useEffect(() => {
  //   console.log("Search Changes", countdownMovies, countdownGames)
  // }, [countdownMovies, countdownGames])

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

  function renderItem({ item }: { item: TMDB.Movie.Movie | Trakt.ShowPremiere | IGDB.Game.Game }) {
    let mediaType: "movie" | "tv" | "game" = "movie";
    if (categoryIndex === 0) { mediaType = "movie" };
    if (categoryIndex === 1) { mediaType = "tv" };
    if (categoryIndex === 2) { mediaType = "game" };

    let inCountdown = false;
    if (categoryIndex === 0) { inCountdown = countdownMovies.some((movie: TMDB.Movie.Movie) => movie.id === (item as TMDB.Movie.Movie).id) };
    if (categoryIndex === 1) { inCountdown = countdownShows.some((premiere: Trakt.ShowPremiere) => premiere.show.ids.trakt === (item as Trakt.ShowPremiere).show.ids.trakt) };

    return (
      <Poster
        navigation={navigation}
        mediaType={mediaType}
        data={item}
        inCountdown={inCountdown}
        uid={route.params.uid}
        colorScheme={colorScheme}
      />
    )
  };

  function setData() {
    if (categoryIndex === 0) {
      return movies;
    }
    if (categoryIndex === 1) {
      return showPremieres;
    }
    if (categoryIndex === 2) {
      return games;
    }
  }

  return (
    <>
      <View style={colorScheme === "dark" ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
        <CategoryControl
          buttons={['Movies', 'TV', 'Games']}
          categoryIndex={categoryIndex}
          handleCategoryChange={index => setCategoryIndex(index)}
        />
      </View>
      <View style={colorScheme === "dark" ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
        <SearchBar
          // cancelIcon={{ color: "#999999" }}
          cancelIcon={{ color: "white" }}
          clearIcon={Platform.OS === "android" ? { color: "white" } : undefined}
          ref={searchRef}
          containerStyle={colorScheme === "dark" ? { backgroundColor: "black", marginHorizontal: Platform.OS === "ios" ? 8 : 16 } : { marginHorizontal: 8 }}
          inputContainerStyle={colorScheme === "dark" ? { backgroundColor: "#1f1f1f" } : {}}
          placeholderTextColor={colorScheme === "dark" ? "#999999" : undefined}
          searchIcon={colorScheme === "dark" ? { color: "#999999" } : {}}
          inputStyle={colorScheme === "dark" ? { color: "white" } : {}}
          cancelButtonProps={colorScheme === "dark" ? { buttonTextStyle: { color: "#428cff" } } : {}}
          placeholder="Search"
          onChangeText={(value: string) => setSearchValue(value)}
          value={searchValue}
          platform={Platform.OS === "ios" ? "ios" : "android"}
          onSubmitEditing={searchValue ? async (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
            if (categoryIndex === 0) {
              setMovies([]);
              getMovies()
            }
            if (categoryIndex === 1) {
              setGames([]);
              setGames(await searchGames(route.params.igdbCreds.access_token, searchValue));
            }
            // setResults(removeOldReleases(await getGamesSearch(searchValue)))
          } : undefined}
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
        // data={categoryIndex === 0 ? movies : games}
        data={setData()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ marginHorizontal: 16 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        ref={scrollRef}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={6}
      />
    </>
  );
};

export default Search;
