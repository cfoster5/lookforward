import React, { useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { iOSColors } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BlurView } from "@react-native-community/blur";
import firestore from "@react-native-firebase/firestore";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SubContext from "../contexts/SubContext";
import TabStackContext from "../contexts/TabStackContext";
import { Navigation } from "../interfaces/navigation";
import { CountdownStack } from "./CountdownStack";
import { FindStack } from "./FindStack";
import { ProfileStack } from "./ProfileStack";

const Tab = createBottomTabNavigator<Navigation.TabNavigationParamList>();
export function TabStack() {
  const [movieSubs, setMovieSubs] = useState([]);
  const [gameSubs, setGameSubs] = useState([]);
  const { user } = useContext(TabStackContext);

  useEffect(() => {
    const movieSubscription = firestore()
      .collection("movies")
      .where("subscribers", "array-contains", user)
      .onSnapshot((documentSnapshot) => {
        const movieSubsData = documentSnapshot.docs.map((doc) => ({
          ...doc.data(),
          documentID: doc.id,
        }));
        setMovieSubs(movieSubsData);
      });

    const gameSubscription = firestore()
      .collection("gameReleases")
      .orderBy("date")
      .where("subscribers", "array-contains", user)
      .onSnapshot((documentSnapshot) => {
        const gameSubsData = documentSnapshot.docs.map((doc) => ({
          ...doc.data(),
          documentID: doc.id,
        }));
        setGameSubs(gameSubsData);
      });

    // Stop listening for updates when no longer required
    return () => {
      // Unmounting
      movieSubscription();
      gameSubscription();
    };
  }, []);

  return (
    <SubContext.Provider value={{ movieSubs: movieSubs, games: gameSubs }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "";
            if (route.name === "FindTab") {
              iconName = "search";
            } else if (route.name === "CountdownTab") {
              iconName = "timer-outline";
            } else if (route.name === "ProfileTab") {
              iconName = "person-circle-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: iOSColors.blue,
          tabBarInactiveTintColor: "gray",
          tabBarStyle:
            Platform.OS === "ios"
              ? {
                  position: "absolute",
                }
              : undefined,
          tabBarBackground: () =>
            Platform.OS === "ios" ? (
              <BlurView style={{ flex: 1 }} />
            ) : undefined,
        })}
      >
        {/* Is setting headerShown to false the best method? */}
        <Tab.Screen
          name="FindTab"
          component={FindStack}
          options={{ headerShown: false, tabBarLabel: "Find" }}
        />
        <Tab.Screen
          name="CountdownTab"
          component={CountdownStack}
          options={{ headerShown: false, tabBarLabel: "Countdown" }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStack}
          options={{ headerShown: false, tabBarLabel: "Profile" }}
        />
      </Tab.Navigator>
    </SubContext.Provider>
  );
}
