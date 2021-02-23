import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FindStackScreen } from './FindStack';
import { CountdownStackScreen } from './CountdownStack';
import { ProfileStackScreen } from './ProfileStack';
import { IGDBCredentials, Navigation } from '../../types';

interface Props {
  uid: string,
  igdbCreds: IGDBCredentials
}

const Tabs = createBottomTabNavigator<Navigation.TabNavigationParamList>();
export function TabNavigation({ uid, igdbCreds }: Props) {
  return (
    <Tabs.Navigator
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
      <Tabs.Screen name="Find" component={FindStackScreen} initialParams={{ uid: uid, igdbCreds: igdbCreds }} />
      <Tabs.Screen name="Countdown" component={CountdownStackScreen} initialParams={{ uid: uid }} />
      <Tabs.Screen name="Profile" component={ProfileStackScreen} initialParams={{ uid: uid }} />
    </Tabs.Navigator>
  )
}
