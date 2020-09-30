/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Platform,
  ActivityIndicator,
  Dimensions,
  Pressable,
  Appearance
} from 'react-native';

import { SearchBar, ListItem, Avatar, Image, ButtonGroup } from 'react-native-elements';
import { getGamesSearch, getGames, getGameReleases, getUpcomingMovies, searchMovies } from './helpers/requests';
import { game, Navigation, release, TMDB } from './types';
import moment from 'moment';
import { reusableStyles } from './styles';
import SegmentedControl from '@react-native-community/segmented-control';


function Search({ route, navigation }: Navigation.FindScreenProps) {
  const [searchValue, setSearchValue] = useState("")
  const [movies, setMovies] = useState<TMDB.Movie.Movie[]>([])
  const [games, setGames] = useState<release[]>([])
  // const navigation = useNavigation();
  const [categoryIndex, setCategoryIndex] = useState(0)

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
    });
  }

  const buttons = ['Movies', 'Games']

  const colorScheme = Appearance.getColorScheme();

  return (
    <React.Fragment>
      <View style={colorScheme === "dark" ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
        <SegmentedControl
          style={{ marginLeft: 16, marginRight: 16, marginTop: 8 }}
          // fontStyle={{ fontSize: 13 }}
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
      {/* <ScrollView>
        {
          results.map((result: game, i) => (
            <ListItem key={i} bottomDivider
              onPress={() => {
                navigation.navigate('Details', result);
              }}>
              <ListItem.Content>
                <ListItem.Title>{result.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))
        }
      </ScrollView> */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
        {/* {
          results.map((result: game, i) => (
            // <Text key={i}>{result.cover.url}</Text>
            <Image
              key={i}
              style={(i % 2) ? styles.itemRight : styles.itemLeft}
              source={{ uri: `https:${result.cover.url.replace("thumb", "cover_big_2x")}` }}
              onPress={() => {
                navigation.navigate('Details', result);
              }}
            />
          ))
        } */}
        {categoryIndex === 0 &&
          movies.map((movieRelease, i) => (
            // <Text key={i}>{result.cover.url}</Text>
            <Pressable key={i} onPress={() => navigation.navigate('Details', { type: "movie", data: movieRelease })}>
              <Image
                // key={i}
                style={(i % 2) ? reusableStyles.itemRight : reusableStyles.itemLeft}
                // source={{ uri: movieRelease.poster_path ? `https://image.tmdb.org/t/p/w500${movieRelease.poster_path}` : `https://via.placeholder.com/500x750?text=${movieRelease.title}` }}
                source={{ uri: movieRelease.poster_path ? `https://image.tmdb.org/t/p/w300${movieRelease.poster_path}` : `https://via.placeholder.com/500x750?text=${movieRelease.title}` }}
              // onPress={() => navigation.navigate('Details', movieRelease)}
              />
            </Pressable>
          ))}
        {categoryIndex === 1 &&
          games.map((gameRelease: release, i) => (
            // <Text key={i}>{gameRelease.cover.url}</Text>
            <Image
              key={i}
              style={(i % 2) ? reusableStyles.itemRight : reusableStyles.itemLeft}
              source={{ uri: `https:${gameRelease?.game?.cover?.url.replace("thumb", "cover_big_2x")}` }}
              onPress={() => navigation.navigate('Details', { type: "game", data: gameRelease })}
            />
          ))}
      </ScrollView>
    </React.Fragment>
  );
};

export default Search;
