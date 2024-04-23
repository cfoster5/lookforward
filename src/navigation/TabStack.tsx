import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";
import firestore from "@react-native-firebase/firestore";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { Platform, PlatformColor, StyleSheet } from "react-native";

import { CountdownStack } from "./CountdownStack";
import { FindStack } from "./FindStack";
import { SettingsStack } from "./SettingsStack";
import { FirestoreGame, FirestoreMovie } from "../interfaces/firebase";

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
        const movieSubsData: FirestoreMovie[] = documentSnapshot.docs.map(
          (doc) => ({
            ...doc.data(),
            subscribers: doc.data()["subscribers"],
            documentID: doc.id,
          })
        );
        setMovieSubs(movieSubsData);
      });

    const gameSubscription = firestore()
      .collection("gameReleases")
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
  }, [setGameSubs, setMovieSubs, user]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";
          if (route.name === "FindTabStack") {
            iconName = "search";
          } else if (route.name === "CountdownTabStack") {
            iconName = "timer-outline";
          } else if (route.name === "SettingsTabStack") {
            iconName = "cog";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // tabBarActiveTintColor: PlatformColor("systemBlue"),
        // tabBarInactiveTintColor: "gray",
        tabBarStyle:
          Platform.OS === "ios"
            ? {
                position: "absolute",
              }
            : undefined,
        tabBarBackground: () =>
          Platform.OS === "ios" && <BlurView style={StyleSheet.absoluteFill} />,
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
        name="SettingsTabStack"
        component={SettingsStack}
        options={{ headerShown: false, tabBarLabel: "Settings" }}
      />
    </Tab.Navigator>
  );
}
