import React, { useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BlurView } from "@react-native-community/blur";
import firestore from "@react-native-firebase/firestore";
import {
  BottomTabBar,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import SubContext from "../contexts/SubContext";
import TabStackContext from "../contexts/TabStackContext";
import { onResult } from "../helpers/helpers";
import { Navigation } from "../interfaces/navigation";
import { CountdownStack } from "./CountdownStack";
import { FindStack } from "./FindStack";
import { ProfileStack } from "./ProfileStack";

const CustomTabs = (props) =>
  Platform.OS === "ios" ? (
    <BlurView
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <BottomTabBar {...props} />
    </BlurView>
  ) : (
    <BottomTabBar {...props} />
  );

const Tab = createBottomTabNavigator<Navigation.TabNavigationParamList>();
export function TabStack() {
  const [movieSubs, setMovieSubs] = useState([]);
  const [gameSubs, setGameSubs] = useState([]);
  const { user } = useContext(TabStackContext);

  useEffect(() => {
    const movieSubscription = firestore()
      .collection("movies")
      .orderBy("release_date")
      .where("subscribers", "array-contains", user)
      .onSnapshot(
        (querySnapshot) => {
          setMovieSubs(onResult(querySnapshot));
        },
        (error) => console.error("error", error)
      );

    const gameSubscription = firestore()
      .collection("gameReleases")
      .orderBy("date")
      .where("subscribers", "array-contains", user)
      .onSnapshot(
        (querySnapshot) => {
          setGameSubs(onResult(querySnapshot));
        },
        (error) => console.error("error", error)
      );

    // Stop listening for updates when no longer required
    return () => {
      // Unmounting
      movieSubscription();
      gameSubscription();
    };
  }, []);

  return (
    <SubContext.Provider value={{ movies: movieSubs, games: gameSubs }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "";
            if (route.name === "Find") {
              iconName = "search";
            } else if (route.name === "Countdown") {
              iconName = "timer-outline";
            } else if (route.name === "Profile") {
              iconName = "person-circle-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        // tabBarOptions={{
        // activeTintColor: '#3880ff',
        // inactiveTintColor: 'gray',
        // }}
        tabBar={(props) => <CustomTabs {...props} />}
        tabBarOptions={
          Platform.OS === "ios"
            ? {
                activeTintColor: "#3880ff",
                inactiveTintColor: "gray",
                style: {
                  // borderTopColor: '#666666',
                  borderTopColor: "rgb(39, 39, 41)",
                  backgroundColor: "transparent",
                },
              }
            : {
                activeTintColor: "#3880ff",
                inactiveTintColor: "gray",
              }
        }
      >
        <Tab.Screen name="Find" component={FindStack} />
        <Tab.Screen name="Countdown" component={CountdownStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </SubContext.Provider>
  );
}
