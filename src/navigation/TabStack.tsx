import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FindStack } from './FindStack';
import { CountdownStack } from './CountdownStack';
import { ProfileStack } from './ProfileStack';
import { Navigation, Trakt } from '../../types';
import firestore from '@react-native-firebase/firestore';
import { onResult } from '../helpers/helpers';
import { getNextEpisode } from '../helpers/requests';
import UserContext from '../UserContext';
import { GameSubContext, MovieSubContext, ShowSubContext } from '../SubContexts';

const Tab = createBottomTabNavigator<Navigation.TabNavigationParamList>();
export function TabStack() {
  const [movieSubs, setMovieSubs] = useState([]);
  const [gameSubs, setGameSubs] = useState([]);
  const [showSubs, setShowSubs] = useState<Trakt.ShowPremiere[] | Trakt.ShowSearch[]>([]);
  const [nextEpisodes, setNextEpisodes] = useState<Trakt.NextEpisode[]>([]);
  const uid = useContext(UserContext)

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
    <MovieSubContext.Provider value={movieSubs}>
      <GameSubContext.Provider value={gameSubs}>
        <ShowSubContext.Provider value={showSubs}>
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
            <Tab.Screen name="Find" component={FindStack} />
            <Tab.Screen name="Countdown">
              {props =>
                <CountdownStack
                  {...props}
                  // showSubs={showSubs}
                  nextEpisodes={nextEpisodes}
                />
              }
            </Tab.Screen>
            <Tab.Screen name="Profile" component={ProfileStack} />
          </Tab.Navigator>
        </ShowSubContext.Provider>
      </GameSubContext.Provider>
    </MovieSubContext.Provider>

  )
}
