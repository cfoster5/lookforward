import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FindStack } from './FindStack';
import { CountdownStack } from './CountdownStack';
import { ProfileStack } from './ProfileStack';
import { IGDBCredentials, Navigation, Trakt } from '../../types';
import firestore from '@react-native-firebase/firestore';
import { onResult } from '../helpers/helpers';
import { ColorSchemeName } from 'react-native';
import { getNextEpisode } from '../helpers/requests';

interface Props {
  uid: string,
  igdbCreds: IGDBCredentials,
  colorScheme: ColorSchemeName
}

const Tabs = createBottomTabNavigator<Navigation.TabNavigationParamList>();
export function TabNavigation({ uid, igdbCreds, colorScheme }: Props) {
  const [countdownMovies, setCountdownMovies] = useState([]);
  const [countdownGames, setCountdownGames] = useState([]);
  const [countdownShows, setCountdownShows] = useState([]);
  const [nextEpisodes, setNextEpisodes] = useState([]);

  useEffect(() => {
    const movieSubscription = firestore().collection('movies').orderBy("release_date").where("subscribers", "array-contains", uid)
      .onSnapshot(querySnapshot => { setCountdownMovies(onResult(querySnapshot)) }, (error) => console.error("error", error));

    const gameSubscription = firestore().collection("gameReleases").orderBy("date").where("subscribers", "array-contains", uid)
      .onSnapshot(querySnapshot => { setCountdownGames(onResult(querySnapshot)) }, (error) => console.error("error", error));

    const showSubscription = firestore().collection("shows").where("subscribers", "array-contains", uid)
      .onSnapshot(querySnapshot => { setCountdownShows(onResult(querySnapshot)) }, (error) => console.error("error", error));

    // Stop listening for updates when no longer required
    return () => {
      // Unmounting
      movieSubscription();
      gameSubscription();
      showSubscription();
    };
  }, []);

  useEffect(() => {
    let tempNextEpisodes = [];
    for (const show of countdownShows) {
      getNextEpisode(show?.documentID).then(nextEpisode => {
        tempNextEpisodes.push(nextEpisode);
      });
    }
  }, [countdownShows])

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";
          if (route.name === 'Find') {
            iconName = "search"
          } else if (route.name === "Countdown") {
            iconName = "timer-outline"
          }
          else if (route.name === "Profile") {
            iconName = "person-circle-outline"
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
      tabBarOptions={{
        activeTintColor: '#3880ff',
        inactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen name="Find" initialParams={{ uid: uid, igdbCreds: igdbCreds }}>
        {props => <FindStack
          {...props}
          countdownMovies={countdownMovies}
          countdownGames={countdownGames}
          countdownShows={countdownShows}
          colorScheme={colorScheme}
        />}
      </Tabs.Screen>
      <Tabs.Screen name="Countdown" initialParams={{ uid: uid, igdbCreds: igdbCreds }}>
        {props => <CountdownStack
          {...props}
          countdownMovies={countdownMovies}
          countdownGames={countdownGames}
          countdownShows={countdownShows}
          nextEpisodes={nextEpisodes}
          colorScheme={colorScheme}
        />}
      </Tabs.Screen>
      <Tabs.Screen name="Profile" component={ProfileStack} initialParams={{ uid: uid }} />
    </Tabs.Navigator>
  )
}
