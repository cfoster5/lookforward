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
import { getUpcomingMovies, searchMovies, getUpcomingGameReleases, searchGames, getIGDBToken } from '../helpers/requests';
import { IGDB, Navigation, TMDB } from '../../types';
import { reusableStyles } from '../helpers/styles';
import SegmentedControl from '@react-native-community/segmented-control';
import MediaItem from '../components/MediaItem';
import usePrevious, { convertReleasesToGames, onResult } from '../helpers/helpers';
import { useScrollToTop } from '@react-navigation/native';
import CategoryControl from '../components/CategoryControl';

function Search({ route, navigation, countdownMovies, countdownGames }: Navigation.FindScreenProps) {
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
  const [igdbToken, setIgdbToken] = useState("")

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
    getIGDBToken().then(token => setIgdbToken((token.data() as { "access_token": string, "expires_in": number, "modified": number, "token_type": "bearer" }).access_token))
    return () => { isMounted = false };
  }, [])

  useEffect(() => {
    if (igdbToken) {
      // getGameReleases().then(games => {
      getUpcomingGameReleases(igdbToken).then(async releaseDates => {
        await convertReleasesToGames(releaseDates).then(games => {
          // console.log(games)
          setInitGames(games);
          setGames(games);
        })
          .catch(error => {
            console.log("error 1", error)
          })
        // if (isMounted) setGames(releaseDates);
      })
        .catch(error => {
          console.log("error 2", error)
        })
    }
  }, [igdbToken])

  useEffect(() => {
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

  // const colorScheme = Appearance.getColorScheme();
  const colorScheme = "dark"

  const renderItem = ({ item }: { item: TMDB.Movie.Movie | IGDB.Game.Game }) => (
    <MediaItem navigation={navigation} mediaType={categoryIndex === 0 ? "movie" : "game"} data={item}
      inCountdown={categoryIndex === 0 ?
        countdownMovies.some((movie: TMDB.Movie.Movie) => movie.id === item.id) : false}
    />
  );

  function handleCategoryChange(index: number) {
    if (index === 0) {
      setGames(initGames);
    }
    if (index === 1) {
      setMovies(initMovies);
    }
    setSearchValue("");
    searchRef.current?.clear();
    setCategoryIndex(index);
  }

  return (
    <>
      <View style={colorScheme === "dark" ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
        <CategoryControl buttons={['Movies', 'Games']} categoryIndex={categoryIndex} handleCategoryChange={(index: number) => handleCategoryChange(index)} marginTop={8} />
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
              setGames(await searchGames(searchValue, igdbToken));
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
