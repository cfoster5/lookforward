import React, { useEffect, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Navigation } from "../../types";
import Profile from '../screens/Profile';

const ProfileStack = createStackNavigator<Navigation.ProfileStackParamList>();
export function ProfileStackScreen({ route }: any) {
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

  return <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={Profile} initialParams={{ uid: route.params.uid }} />
    {/* <ProfileStack.Screen name="Profile" initialParams={{ uid: route.params.uid }}>
      {props => <Profile {...props} dayNotifications={dayNotifications} weekNotifications={weekNotifications} />}
    </ProfileStack.Screen> */}
  </ProfileStack.Navigator>
}
