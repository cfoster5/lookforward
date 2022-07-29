import { BlurView } from "@react-native-community/blur";
import firestore from "@react-native-firebase/firestore";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import { iOSColors } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";

import { FirestoreGame, FirestoreMovie } from "../interfaces/firebase";
import Profile from "../screens/Profile/Profile";
import { CountdownStack } from "./CountdownStack";
import { FindStack } from "./FindStack";

import { useStore } from "@/stores/store";
import { BottomTabParams } from "@/types";

const Tab = createBottomTabNavigator<BottomTabParams>();
export function TabStack() {
  const { user, setMovieSubs, setGameSubs } = useStore();

  useEffect(() => {
    const movieSubscription = firestore()
      .collection("movies")
      .where("subscribers", "array-contains", user!.uid)
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
      .where("subscribers", "array-contains", user!.uid)
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
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";
          if (route.name === "FindTabStack") {
            iconName = "search";
          } else if (route.name === "CountdownTabStack") {
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
            <BlurView style={StyleSheet.absoluteFill} />
          ) : undefined,
      })}
    >
      {/* Is setting headerShown to false the best method? */}
      <Tab.Screen
        name="FindTabStack"
        component={FindStack}
        options={{ headerShown: false, tabBarLabel: "Find" }}
      />
      <Tab.Screen
        name="CountdownTabStack"
        component={CountdownStack}
        options={{ headerShown: false, tabBarLabel: "Countdown" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={Profile}
        options={{ tabBarLabel: "Profile", title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
