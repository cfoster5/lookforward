import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FindStack } from './FindStack';
import { CountdownStack } from './CountdownStack';
import { ProfileStack } from './ProfileStack';
import { IGDBCredentials, Navigation, Trakt } from '../../types';
import firestore from '@react-native-firebase/firestore';
import { onResult } from '../helpers/helpers';
import { getNextEpisode } from '../helpers/requests';

interface Props {
  uid: string,
  igdbCreds: IGDBCredentials
}

const Tab = createBottomTabNavigator<Navigation.TabNavigationParamList>();
export function TabStack({ uid, igdbCreds }: Props) {
  const [movieSubs, setMovieSubs] = useState([]);
  const [gameSubs, setGameSubs] = useState([]);
  const [showSubs, setShowSubs] = useState<Trakt.ShowPremiere[] | Trakt.ShowSearch[]>([]);
  const [nextEpisodes, setNextEpisodes] = useState<Trakt.NextEpisode[]>([]);

  useEffect(() => {
    const movieSubscription = firestore().collection('movies').orderBy("release_date").where("subscribers", "array-contains", uid)
      .onSnapshot(querySnapshot => { setMovieSubs(onResult(querySnapshot)) }, error => console.error("error", error));

    const gameSubscription = firestore().collection("gameReleases").orderBy("date").where("subscribers", "array-contains", uid)
      .onSnapshot(querySnapshot => { setGameSubs(onResult(querySnapshot)) }, error => console.error("error", error));

    const showSubscription = firestore().collection("shows").where("subscribers", "array-contains", uid)
      .onSnapshot(querySnapshot => { setShowSubs(onResult(querySnapshot)) }, error => console.error("error", error));

    // Stop listening for updates when no longer required
    return () => {
      // Unmounting
      movieSubscription();
      gameSubscription();
      showSubscription();
    };
  }, []);

  useEffect(() => {
    // TODO: Fix bug that removes next epidsodes from countdown on addition/removal

    // 
    let tempNextEpisodes: any[] = [];
    for (const show of showSubs) {
      getNextEpisode(show.documentID as number).then(nextEpisode => {
        // console.log(`nextEpisode from TabNav`, nextEpisode);
        (show as any).nextEpisode = nextEpisode;
        tempNextEpisodes.push(show);
      })
        .catch(err => console.log(`err`, err));
    }
    setNextEpisodes(tempNextEpisodes);
  }, [showSubs])

  useEffect(() => {
    console.log(`nextEpisodes from TabNav`, nextEpisodes)
  }, [nextEpisodes])

  return (
    <Tab.Navigator
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
      <Tab.Screen name="Find" initialParams={{ uid: uid, igdbCreds: igdbCreds }}>
        {props => <FindStack
          {...props}
          countdownMovies={movieSubs}
          countdownGames={gameSubs}
          showSubs={showSubs}
        />}
      </Tab.Screen>
      <Tab.Screen name="Countdown" initialParams={{ uid: uid }}>
        {props => <CountdownStack
          {...props}
          countdownMovies={movieSubs}
          countdownGames={gameSubs}
          // showSubs={showSubs}
          nextEpisodes={nextEpisodes}
        />}
      </Tab.Screen>
      <Tab.Screen name="Profile" component={ProfileStack} initialParams={{ uid: uid }} />
    </Tab.Navigator>
  )
}
