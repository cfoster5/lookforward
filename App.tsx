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
import { View, StatusBar, Image, SafeAreaView, Appearance, useColorScheme, Button, Pressable } from 'react-native';
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
import { iOSColors, iOSUIKit } from 'react-native-typography';
import { OverflowMenuProvider } from 'react-navigation-header-buttons';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Countdown from './Countdown';
import Profile from './Profile';

const HomeStack = createStackNavigator<Navigation.HomeStackParamList>();

const buttons = ['Movies', 'Games']
const colorScheme = Appearance.getColorScheme();

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
  const [countdownMovies, setCountdownMovies] = useState([])
  const [countdownGames, setCountdownGames] = useState([])

  function onResult(querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) {
    // console.log(querySnapshot.docs);
    let tempMovies: any = []
    querySnapshot.docs.forEach(doc => {
      // console.log(doc.data())
      let data = doc.data();
      data.documentID = doc.id;
      tempMovies.push(data);
    });
    setCountdownMovies(tempMovies)
  }

  function onError(error: any) {
    console.error(error);
  }

  function onAuthStateChanged(user: any) {
    setUser(user);
    // console.log(user);

    // firestore().collection("users").doc(user.uid).collection('items').orderBy("release_date").where("mediaType", "==", "movie").onSnapshot(querySnapshot => {
    //   console.log(querySnapshot.docs)
    //   // setCountdownMovies(() => addTempItems(querySnapshot))
    //   // console.log("home movies", countdownMovies)
    // }, error => {
    //   console.log("Error getting document:", error);
    // });

    firestore()
      .collection('users').doc(user.uid).collection('items').orderBy("release_date").where("mediaType", "==", "movie")
      .onSnapshot(onResult, onError);

    firestore().collection("users").doc(user.uid).collection('items').orderBy("date").where("mediaType", "==", "game")
    // firestore().collection("games").orderBy("date").where("owner", "==", user.uid)
      .onSnapshot(querySnapshot => {
        let tempGames: any = []
        querySnapshot.docs.forEach(doc => {
          // console.log(doc.data())
          let data = doc.data();
          data.documentID = doc.id;
          tempGames.push(data);
        });
        setCountdownGames(tempGames)
      }, error => {
        console.log("Error getting document:", error);
      });

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // auth()
    //   .signOut()
    //   .then(() => console.log('User signed out!'));

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const CountdownStack = createStackNavigator<any>();

  function CountdownStackScreen() {
    return <CountdownStack.Navigator>
      <CountdownStack.Screen name="Countdown" component={Countdown} initialParams={{ movies: countdownMovies, games: countdownGames }} />
    </CountdownStack.Navigator>
  }

  const ProfileStack = createStackNavigator<any>();

  function ProfileStackScreen() {
    return <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={Profile} initialParams={{ movies: countdownMovies }} />
    </ProfileStack.Navigator>
  }

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
      <Tab.Screen name="Countdown" component={CountdownStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  }

  const Stack = createStackNavigator<Navigation.StackParamList>();

  if (initializing) {
    return <View />
  }

  const colorScheme = Appearance.getColorScheme();
  // const colorScheme = useColorScheme();

  return <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <OverflowMenuProvider>
      <>
        <StatusBar barStyle={colorScheme === 'dark' ? "default" : "dark-content"} />
        <Stack.Navigator>
          {/* options config - https://reactnavigation.org/docs/nesting-navigators/#nesting-multiple-stack-navigators */}
          {user ? <Stack.Screen name="Home" component={TabNavigation} options={{ headerShown: false }} /> : <Stack.Screen name="Welcome" component={AuthStackScreen} options={{ headerShown: false }} />}
        </Stack.Navigator>
      </>
    </OverflowMenuProvider>
  </NavigationContainer>
}
