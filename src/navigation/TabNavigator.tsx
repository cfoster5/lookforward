import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FindStack } from './FindStack';
import { CountdownStack } from './CountdownStack';
import { ProfileStack } from './ProfileStack';
import { IGDBCredentials, Navigation } from '../../types';
import firestore from '@react-native-firebase/firestore';
import { onResult } from '../helpers/helpers';

interface Props {
  uid: string,
  igdbCreds: IGDBCredentials
}

const Tabs = createBottomTabNavigator<Navigation.TabNavigationParamList>();
export function TabNavigation({ uid, igdbCreds }: Props) {
  const [countdownMovies, setCountdownMovies] = useState([]);
  const [countdownGames, setCountdownGames] = useState([]);

  useEffect(() => {
    const movieSubscription = firestore().collection('movies').orderBy("release_date").where("subscribers", "array-contains", uid)
      .onSnapshot(querySnapshot => { setCountdownMovies(onResult(querySnapshot, "movies")) }, (error) => console.error("error", error));

    const gameSubscription = firestore().collection("gameReleases").orderBy("date").where("subscribers", "array-contains", uid)
      .onSnapshot(querySnapshot => { setCountdownGames(onResult(querySnapshot, "games")) }, (error) => console.error("error", error));

    // Stop listening for updates when no longer required
    return () => {
      // Unmounting
      movieSubscription();
      gameSubscription();
    };
  }, []);

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
        {props => <FindStack {...props} countdownMovies={countdownMovies} countdownGames={countdownGames} />}
      </Tabs.Screen>
      <Tabs.Screen name="Countdown" initialParams={{ uid: uid, igdbCreds: igdbCreds }}>
        {props => <CountdownStack {...props} countdownMovies={countdownMovies} countdownGames={countdownGames} />}
      </Tabs.Screen>
      <Tabs.Screen name="Profile" component={ProfileStack} initialParams={{ uid: uid }} />
    </Tabs.Navigator>
  )
}
