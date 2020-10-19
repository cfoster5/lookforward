import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HomeStackScreen } from './HomeStack';
import { CountdownStackScreen } from './CountdownStack';
import { ProfileStackScreen } from './ProfileStack';

const Tab = createBottomTabNavigator();
export function TabNavigation({ route, navigation }: any) {
  return <Tab.Navigator
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
    <Tab.Screen name="Find" component={HomeStackScreen} initialParams={{ uid: route.params.uid }} />
    <Tab.Screen name="Countdown" component={CountdownStackScreen} initialParams={{ uid: route.params.uid }} />
    <Tab.Screen name="Profile" component={ProfileStackScreen} initialParams={{ uid: route.params.uid }} />
  </Tab.Navigator>
}
