import React, { useEffect, useState } from 'react';
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import Actor from '../screens/Actor';
import Details from "../screens/Details";
import Search from "../screens/Search";
import { Navigation } from "../../types";
import firestore from '@react-native-firebase/firestore';
import { onResult } from '../helpers/helpers';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type FindStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.FindStackParamList, "Find">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: FindStackNavProp,
  route: RouteProp<Navigation.TabNavigationParamList, "Find">
}

const Stack = createStackNavigator<Navigation.FindStackParamList>();
export function FindStack({ navigation, route }: Props) {
  const [countdownMovies, setCountdownMovies] = useState([]);
  const [countdownGames, setCountdownGames] = useState([]);

  useEffect(() => {
    const movieSubscription = firestore().collection('movies').orderBy("release_date").where("subscribers", "array-contains", route.params.uid)
      .onSnapshot(querySnapshot => { setCountdownMovies(onResult(querySnapshot, "movies")) }, (error) => console.error("error", error));

    const gameSubscription = firestore().collection("gameReleases").orderBy("date").where("subscribers", "array-contains", route.params.uid)
      // firestore().collection("games").orderBy("date").where("owner", "==", user.uid)
      .onSnapshot(querySnapshot => { setCountdownGames(onResult(querySnapshot, "games")) }, (error) => console.error("error", error));

    // Stop listening for updates when no longer required
    return () => {
      // Unmounting
      movieSubscription();
      gameSubscription();
    };
  }, [route.params.uid]);

  // useEffect(() => {
  //   console.log('homeStack changed')
  // }, [countdownMovies, countdownMovies])

  return (
    <Stack.Navigator>
      {/* {props => <Stack.Screen name="Find" component={Search} {...props} extraData={{}} />}
    {props => <Stack.Screen name="Details" component={Details} {...props} extraData={{}} />} */}

      {/* <Stack.Screen name="Find" component={Search} initialParams={{ uid: route.params.uid }} /> */}
      <Stack.Screen name="Find" initialParams={{ uid: route.params.uid, igdbCreds: route.params.igdbCreds }}>
        {props => <Search {...props} countdownMovies={countdownMovies} countdownGames={countdownGames} />}
      </Stack.Screen>
      {/* <Stack.Screen name="Details" component={Details} initialParams={{ uid: route.params.uid }} /> */}
      <Stack.Screen name="Details" initialParams={{ uid: route.params.uid }}>
        {props => <Details {...props} countdownMovies={countdownMovies} countdownGames={countdownGames} />}
      </Stack.Screen>
      <Stack.Screen name="Actor" component={Actor} />
    </Stack.Navigator>
  )
}
