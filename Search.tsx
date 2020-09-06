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
} from 'react-native';

import { SearchBar, ListItem, Avatar, Image, ButtonGroup } from 'react-native-elements';
import { getGamesSearch, getGames, getGameReleases } from './helpers/requests';
import { useNavigation } from '@react-navigation/native';
import { game, release } from './types';
import moment from 'moment';


function Search() {
  const [searchValue, setSearchValue] = useState("")
  const [results, setResults] = useState<release[]>([])
  const navigation = useNavigation();

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
    getGameReleases().then(games => {
      if (isMounted) setResults(games);
    })
    return () => { isMounted = false };
  }, [])

  const buttons = ['Movies', 'Games']

  return (
    <React.Fragment>
      <View style={{ backgroundColor: 'white' }}>
        <ButtonGroup
          onPress={() => null}
          selectedIndex={1}
          buttons={buttons}
        />
      </View>
      <SearchBar
        placeholder="Search"
        onChangeText={(value: string) => setSearchValue(value)}
        value={searchValue}
        platform={Platform.OS === "ios" ? "ios" : "android"}
        onSubmitEditing={async (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
          setResults([]);
          // setResults(removeOldReleases(await getGamesSearch(searchValue)))
        }} />
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', }}>
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
        {
          results.map((result: release, i) => (
            // <Text key={i}>{result.cover.url}</Text>
            <Image
              key={i}
              style={(i % 2) ? styles.itemRight : styles.itemLeft}
              source={{ uri: `https:${result?.game?.cover?.url.replace("thumb", "cover_big_2x")}` }}
              onPress={() => {
                navigation.navigate('Details', result);
              }}
            />
          ))
        }
      </ScrollView>
    </React.Fragment >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // alignItems: 'flex-start' // if you want to fill rows left to right
  },
  itemLeft: {
    // width: (Dimensions.get("window").width / 2) - 32, // is 50% of container width
    // height: (4 / 3) * ((Dimensions.get("window").width / 2) - 32),
    width: (Dimensions.get("window").width / 2) - 24, // is 50% of container width
    height: (4 / 3) * ((Dimensions.get("window").width / 2) - 24),
    borderRadius: 8,
    resizeMode: "stretch",
    marginTop: 16,
    // marginLeft: 24,
    // marginRight: 8
    marginLeft: 16,
    marginRight: 8
  },
  itemRight: {
    // width: (Dimensions.get("window").width / 2) - 32, // is 50% of container width
    // height: (4 / 3) * ((Dimensions.get("window").width / 2) - 32),
    width: (Dimensions.get("window").width / 2) - 24, // is 50% of container width
    height: (4 / 3) * ((Dimensions.get("window").width / 2) - 24),
    borderRadius: 8,
    resizeMode: "stretch",
    marginTop: 16,
    // marginLeft: 8,
    // marginRight: 24
    marginLeft: 8,
    marginRight: 16
  }
})

export default Search;
