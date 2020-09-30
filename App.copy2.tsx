/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Button,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import Search from './Search';
import Details from './Details';
import Login from './authentication/Login';

// function HomeScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Home!</Text>
//     </View>
//   );
// }

// function SettingsScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Settings!</Text>
//     </View>
//   );
// }

// const Tab = createBottomTabNavigator();

// const App = () => {
//   const [searchValue, setSearchValue] = useState("")
//   const [results, setResults] = useState([])
//   return (
//     // <NavigationContainer>
//     //   <Tab.Navigator
//     //     screenOptions={({ route }) => ({
//     //       tabBarIcon: ({ focused, color, size }) => {
//     //         let iconName;

//     //         if (route.name === 'Find') {
//     //           // iconName = focused
//     //           //   ? 'ios-information-circle'
//     //           //   : 'ios-information-circle-outline';
//     //           iconName = "search"
//     //         } else if (route.name === 'Settings') {
//     //           iconName = focused ? 'ios-list-box' : 'ios-list';
//     //         }

//     //         // You can return any component that you like here!
//     //         return <Ionicons name={iconName} size={size} color={color} />;
//     //       },
//     //     })}
//     //     tabBarOptions={{
//     //       activeTintColor: 'tomato',
//     //       inactiveTintColor: 'gray',
//     //     }}
//     //   >
//     //     <Tab.Screen name="Find" component={Search} />
//     //     <Tab.Screen name="Settings" component={SettingsScreen} />
//     //   </Tab.Navigator>
//     // </NavigationContainer>

//     // <NavigationContainer>
//     //   <StatusBar barStyle="dark-content" />
//     //   <SafeAreaView>
//     //     <Search />
//     //   </SafeAreaView>
//     // </NavigationContainer>

//     // <React.Fragment>
//     //   <StatusBar barStyle="dark-content" />
//     //   <SafeAreaView>
//     //     <Search />
//     //   </SafeAreaView>
//     // </React.Fragment>
//   );
// };


// function DetailsScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Details!</Text>
//     </View>
//   );
// }

// function SettingsScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Settings screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.navigate('Details')}
//       />
//     </View>
//   );
// }

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Find" component={Search} />
      <HomeStack.Screen name="Details" component={Details} />
    </HomeStack.Navigator>
  );
}

// const SettingsStack = createStackNavigator();

// function SettingsStackScreen() {
//   return (
//     <SettingsStack.Navigator>
//       <SettingsStack.Screen name="Settings" component={SettingsScreen} />
//       <SettingsStack.Screen name="Details" component={DetailsScreen} />
//     </SettingsStack.Navigator>
//   );
// }

const Tab = createBottomTabNavigator();

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <Login />
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "";

            if (route.name === 'Find') {
              // iconName = focused
              //   ? 'ios-information-circle'
              //   : 'ios-information-circle-outline';
              iconName = "search"
              // } else if (route.name === 'Settings') {
              //   iconName = focused ? 'ios-list-box' : 'ios-list';
              // }
            } else if (route.name === "Countdown") {
              iconName = "timer-outline"
            }
            else if (route.name === "Profile") {
              iconName = "person-circle-outline"
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        })}
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Find" component={HomeStackScreen} />
        {/* <Tab.Screen name="Settings" component={SettingsStackScreen} /> */}
        <Tab.Screen name="Countdown" component={HomeStackScreen} />
        <Tab.Screen name="Profile" component={HomeStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
