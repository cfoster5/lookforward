import React, { useEffect, useState } from 'react';
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import firestore from '@react-native-firebase/firestore';
import { Navigation } from "../../types";
import Profile from '../screens/Profile';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type ProfileStackNavProp = CompositeNavigationProp<
  StackNavigationProp<Navigation.ProfileStackParamList, "Profile">,
  BottomTabNavigationProp<Navigation.TabNavigationParamList>
>;

interface Props {
  navigation: ProfileStackNavProp,
  route: RouteProp<Navigation.TabNavigationParamList, "Countdown">
}

const Stack = createStackNavigator<Navigation.ProfileStackParamList>();
export function ProfileStack({ navigation, route }: Props) {
  const [dayNotifications, setDayNotifications] = useState(false);
  const [weekNotifications, setWeekNotifications] = useState(false);

  useEffect(() => {
    if (route.params.uid) {
      const preferenceSubscription = firestore().collection('users').doc(route.params.uid).collection('contentPreferences').doc("preferences")
        .onSnapshot(querySnapshot => {
          let preferences = querySnapshot.data();
          if (preferences?.dayNotifications) {
            setDayNotifications(true);
          }
          if (preferences?.weekNotifications) {
            setWeekNotifications(true);
          }
        }, error => console.log(error));

      // Stop listening for updates when no longer required
      return () => {
        // Unmounting
        preferenceSubscription();
      };
    }
  }, [route.params.uid])

  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} initialParams={{ uid: route.params.uid }} />
      {/* <Stack.Screen name="Profile" initialParams={{ uid: route.params.uid }}>
      {props => <Profile {...props} dayNotifications={dayNotifications} weekNotifications={weekNotifications} />}
    </Stack.Screen> */}
    </Stack.Navigator>
  )
}
