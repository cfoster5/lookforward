/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React, { useState, useEffect } from 'react';
import { View, StatusBar, Image, SafeAreaView, Appearance, useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import Search from './Search';
import Details from './Details';
import Login from './authentication/Login';
import Welcome from './authentication/Welcome';
import CreateAccount from './authentication/CreateAccount';
import { Navigation } from './types';
import Actor from './Actor';
import SegmentedControl from '@react-native-community/segmented-control';

const HomeStack = createStackNavigator<Navigation.HomeStackParamList>();

const buttons = ['Movies', 'Games']
const colorScheme = Appearance.getColorScheme();

class LogoTitle extends React.Component {
  render() {
    return (
      <SafeAreaView style={colorScheme === "dark" ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
        <SegmentedControl
          style={{ marginLeft: 16, marginRight: 16 }}
          values={buttons}
          selectedIndex={0}
          onChange={(event) => {
          }}
        />
      </SafeAreaView>
    );
  }
}

function HomeStackScreen() {
  return <HomeStack.Navigator>
    <HomeStack.Screen name="Find" component={Search} />
    {/* <HomeStack.Screen name="Find" component={Search} options={{ header: () => <LogoTitle /> }} /> */}
    <HomeStack.Screen name="Details" component={Details} />
    {/* <HomeStack.Screen name="Details" component={Details} options={{headerShown: false}} /> */}
    <HomeStack.Screen name="Actor" component={Actor} />
  </HomeStack.Navigator>
}

const AuthStack = createStackNavigator<Navigation.AuthStackParamList>();

function AuthStackScreen() {
  return <AuthStack.Navigator>
    <AuthStack.Screen name="Welcome" component={Welcome} />
    <AuthStack.Screen name="Create Account" component={CreateAccount} />
    <AuthStack.Screen name="Sign In" component={Login} />
  </AuthStack.Navigator>
}

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
    // auth()
    //   .signOut()
    //   .then(() => console.log('User signed out!'));

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  function TabNavigation() {
    return <Tab.Navigator
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
        activeTintColor: '#3880ff',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Find" component={HomeStackScreen} />
      <Tab.Screen name="Countdown" component={HomeStackScreen} />
      <Tab.Screen name="Profile" component={HomeStackScreen} />
    </Tab.Navigator>
  }

  const Stack = createStackNavigator<Navigation.StackParamList>();

  if (initializing) {
    return <View />
  }

  const colorScheme = Appearance.getColorScheme();
  // const colorScheme = useColorScheme();

  return <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <StatusBar barStyle="dark-content" />
    <Stack.Navigator>
      {/* options config - https://reactnavigation.org/docs/nesting-navigators/#nesting-multiple-stack-navigators */}
      {user ? <Stack.Screen name="Home" component={TabNavigation} options={{ headerShown: false }} /> : <Stack.Screen name="Welcome" component={AuthStackScreen} options={{ headerShown: false }} />}
    </Stack.Navigator>
  </NavigationContainer>
}
