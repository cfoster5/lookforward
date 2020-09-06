/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Platform,
  ActivityIndicator,
  Button,
  Dimensions,
} from 'react-native';

import moment from 'moment';
import { useRoute, useNavigation } from '@react-navigation/native';
import { game, release } from './types';
import { Image, Text } from 'react-native-elements';


// function Details({ route, navigation }) {
function Details() {
  // const { itemId } = route.params;
  // const { otherParam } = route.params;
  const route = useRoute();
  const navigation = useNavigation();
  const game = route.params as release
  // const release = route.params as release

  return (
    <React.Fragment>
      {/* <Image
        style={{ width: Dimensions.get("window").width, height: (500 / 889) * Dimensions.get("window").width }}
        source={{ uri: `https:${game.cover.url.replace("thumb", "screenshot_big")}` }}
      /> */}
      <Image
        style={{ width: Dimensions.get("window").width, height: (500 / 889) * Dimensions.get("window").width }}
        source={{ uri: `https:${game.game.cover.url.replace("thumb", "screenshot_big")}` }}
      />

      {/* <ScrollView style={{ margin: 16 }}>
        <Text h4>{game.name}</Text>
        <Text>{game.summary}</Text>
        <Text>Genres: {game.genres.map((genre, i) => (<React.Fragment key={i}>{i > 0 ? `, ${genre.name}` : genre.name}</React.Fragment>))}</Text>
      </ScrollView> */}
      <ScrollView style={{ margin: 16 }}>
        <Text h4>{game.game.name}</Text>
        <Text>{game.game.summary}</Text>
        <Text>Genres: {game.game.genres.map((genre, i) => (<React.Fragment key={i}>{i > 0 ? `, ${genre.name}` : genre.name}</React.Fragment>))}</Text>
      </ScrollView>
      {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> */}
      {/* {
            game.release_dates.map((releaseDate: release, i) => (
              <Text key={i}>Release date for {releaseDate.platform.name}: {moment.unix(releaseDate.date).format("MM/DD/YYYY")}</Text>
            ))
          } */}

      {/* <Button
          title="Go to Details... again"
          onPress={() =>
            navigation.push('Details', {
              itemId: Math.floor(Math.random() * 100),
            })
          }
        />
        <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
        <Button title="Go back" onPress={() => navigation.goBack()} /> */}
      {/* </View> */}
    </React.Fragment>
  );
};

export default Details;
