import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Platform,
  Pressable,
  Appearance
} from 'react-native';

import { SearchBar, Image } from 'react-native-elements';
import { getGamesSearch, getGames, getGameReleases, getUpcomingMovies, searchMovies } from './helpers/requests';
import { game, Navigation, release, TMDB } from './types';
import { reusableStyles } from './styles';
import SegmentedControl from '@react-native-community/segmented-control';
import MediaItem from './components/MediaItem';

function Search({ route, navigation }: Navigation.FindScreenProps) {
  const [searchValue, setSearchValue] = useState("")
  const [movies, setMovies] = useState<TMDB.Movie.Movie[]>([])
  const [games, setGames] = useState<release[]>([])
  const [categoryIndex, setCategoryIndex] = useState(0)
  const scrollRef = useRef<ScrollView>(null);

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
      if (isMounted) setMovies(movies);
    })
    getGameReleases().then(games => {
      if (isMounted) setGames(games);
    })
    return () => { isMounted = false };
  }, [])

  function getMovies() {
    const date = new Date();
    const years = [date.getFullYear(), date.getFullYear() + 1, date.getFullYear() + 2, date.getFullYear() + 3];
    let tempMovies: TMDB.Movie.Movie[] = [];
    years.forEach(async year => {
      const searchData = await searchMovies(searchValue, year)
      console.log(...searchData)
      tempMovies = [...tempMovies, ...searchData]
      // Updating state for each year, need to only update once 
      setMovies(tempMovies)
      scrollRef?.current?.scrollTo({
        y: 0,
        animated: false
      })
    });
  }

  const buttons = ['Movies', 'Games']

  const colorScheme = Appearance.getColorScheme();

  return (
    <>
      <View style={colorScheme === "dark" ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
        <SegmentedControl
          style={{ marginHorizontal: 16, marginTop: 8, paddingVertical: 16 }}
          values={buttons}
          selectedIndex={categoryIndex}
          onChange={(event) => {
            setCategoryIndex(event.nativeEvent.selectedSegmentIndex)
          }}
        />
      </View>
      <SearchBar
        containerStyle={colorScheme === "dark" ? { backgroundColor: "black" } : {}}
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
          // setResults(removeOldReleases(await getGamesSearch(searchValue)))
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }} ref={scrollRef}>
        {categoryIndex === 0 &&
          movies.map((movieRelease, i) => (
            <MediaItem key={i} navigation={navigation} mediaType="movie" index={i} data={movieRelease} />
          ))}
        {categoryIndex === 1 &&
          games.map((gameRelease: release, i) => (
            <MediaItem key={i} navigation={navigation} mediaType="game" index={i} data={gameRelease} />
          ))}
      </ScrollView>
    </>
  );
};

export default Search;
