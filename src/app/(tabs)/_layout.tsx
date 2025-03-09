import firestore from "@react-native-firebase/firestore";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

import { NativeIcon } from "@/components/NativeIcon.ios";
import { FirestoreMovie } from "@/interfaces/firebase";
import { useStore } from "@/stores/store";

export function BlurTabBarBackground() {
  return (
    <BlurView
      // TODO: Use systemChromeMaterialDark when same can be applied to Search modals
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      // tint="systemChromeMaterial"
      tint="dark"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export default function TabsLayout() {
  // Protects child routes
  const { user, setMovieSubs, setGameSubs } = useStore();

  useEffect(() => {
    if (user) {
      const movieSubscription = firestore()
        .collection("movies")
        .where("subscribers", "array-contains", user.uid)
        .onSnapshot((documentSnapshot) => {
          const movieSubsData: FirestoreMovie[] = documentSnapshot.docs.map(
            (doc) => ({
              ...doc.data(),
              subscribers: doc.data()["subscribers"],
              documentID: doc.id,
            }),
          );
          setMovieSubs(movieSubsData);
        });

      const gameSubscription = firestore()
        .collection("gameReleases")
        .where("subscribers", "array-contains", user.uid)
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
    }
  }, [setGameSubs, setMovieSubs, user]);

  return (
    // TODO: See if we can set screenOptions only for the root page in the Find stack
    // Checking against route.name === "(find)" && route.pathname === "/" hasn't worked
    // If we can do this, we can remove the View under the SearchBottomSheet in the Find screen
    <Tabs
      screenOptions={{
        tabBarBackground: BlurTabBarBackground,
        tabBarStyle: {
          // Use a transparent background on iOS to show the blur effect
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="(find)"
        options={{
          title: "Find",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <NativeIcon name="magnifyingglass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(countdown)"
        options={{
          title: "Countdown",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <NativeIcon name="timer" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <NativeIcon name="gear" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
