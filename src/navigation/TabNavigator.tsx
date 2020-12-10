import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FindStackScreen } from './FindStack';
import { CountdownStackScreen } from './CountdownStack';
import { ProfileStackScreen } from './ProfileStack';
import { Navigation } from '../../types';

const Tab = createBottomTabNavigator<Navigation.TabNavigationParamList>();
export function TabNavigation({ route, navigation }: Navigation.TabsScreenProps) {
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
    <Tab.Screen name="Find" component={FindStackScreen} initialParams={{ uid: route.params.uid }} />
    <Tab.Screen name="Countdown" component={CountdownStackScreen} initialParams={{ uid: route.params.uid }} />
    <Tab.Screen name="Profile" component={ProfileStackScreen} initialParams={{ uid: route.params.uid }} />
  </Tab.Navigator>
}
