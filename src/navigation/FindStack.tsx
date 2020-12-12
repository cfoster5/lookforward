import React, { useEffect, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Actor from '../screens/Actor';
import Details from "../screens/Details";
import Search from "../screens/Search";
import { Navigation } from "../../types";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { onResult } from '../helpers/helpers';

const FindStack = createStackNavigator<Navigation.FindStackParamList>();
export function FindStackScreen({ route }: Navigation.FindScreenProps) {
  const [countdownMovies, setCountdownMovies] = useState([]);
  const [countdownGames, setCountdownGames] = useState([]);

  useEffect(() => {
    const movieSubscription = firestore().collection('movies').orderBy("release_date").where("subscribers", "array-contains", route.params.uid)
      .onSnapshot(querySnapshot => { setCountdownMovies(onResult(querySnapshot, "movies")) }, (error) => console.error("error", error));

    const gameSubscription = firestore().collection("users").doc(route.params.uid).collection('items').orderBy("date").where("mediaType", "==", "game")
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

  return <FindStack.Navigator>
    {/* {props => <FindStack.Screen name="Find" component={Search} {...props} extraData={{}} />}
    {props => <FindStack.Screen name="Details" component={Details} {...props} extraData={{}} />} */}

    {/* <FindStack.Screen name="Find" component={Search} initialParams={{ uid: route.params.uid }} /> */}
    <FindStack.Screen name="Find">
      {props => <Search {...props} countdownMovies={countdownMovies} countdownGames={countdownGames} />}
    </FindStack.Screen>
    {/* <FindStack.Screen name="Details" component={Details} initialParams={{ uid: route.params.uid }} /> */}
    <FindStack.Screen name="Details" initialParams={{ uid: route.params.uid }}>
      {props => <Details {...props} countdownMovies={countdownMovies} countdownGames={countdownGames} />}
    </FindStack.Screen>
    <FindStack.Screen name="Actor" component={Actor} />
  </FindStack.Navigator>
}
