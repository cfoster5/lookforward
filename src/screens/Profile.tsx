import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import usePrevious from '../helpers/helpers';
import { reusableStyles } from '../helpers/styles';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import UserContext from '../contexts/UserContext';
import { Modalize } from 'react-native-modalize';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import ThemeContext from '../contexts/ThemeContext';
import { connectAsync, getProductsAsync, IAPItemDetails, IAPResponseCode, purchaseItemAsync } from 'expo-in-app-purchases';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Navigation } from '../interfaces/navigation';

type ProfileScreenRouteProp = RouteProp<Navigation.ProfileStackParamList, 'Profile'>;
type ProfileScreenNavigationProp = StackNavigationProp<Navigation.ProfileStackParamList, 'Profile'>;
type ProfileScreenProps = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
  dayNotifications: boolean;
  weekNotifications: boolean;
}

function Profile({ route, navigation }: ProfileScreenProps) {
  const uid = useContext(UserContext)
  const [hasPermissions, setHasPermissions] = useState(true);
  const [dayNotifications, setDayNotifications] = useState(false);
  const [weekNotifications, setWeekNotifications] = useState(false);
  const toggleDaySwitch = () => setDayNotifications(previousState => !previousState);
  const toggleWeekSwitch = () => setWeekNotifications(previousState => !previousState);
  const prevDayNotifications = usePrevious(dayNotifications);
  const prevWeekNotifications = usePrevious(weekNotifications);
  const modalizeRef = useRef<Modalize>(null);
  const tabBarheight = useBottomTabBarHeight();
  const colorScheme = useContext(ThemeContext);
  const [connected, setConnected] = useState(false);
  const [iapItems, setIapItems] = useState<IAPItemDetails[]>();

  useEffect(() => {
    if (Platform.OS === "ios") {
      connectAsync()
        .then(() => setConnected(true))
        .catch(() => console.log(`connection error`));
    }
  }, [])

  useEffect(() => {
    if (Platform.OS === "ios" && connected) {
      getProductsAsync(["com.lookforward.tip1", "com.lookforward.tip3", "com.lookforward.tip5"])
        .then(response => {
          if (response.responseCode === IAPResponseCode.OK) {
            setIapItems(response.results)
          }
        })
        .catch(() => console.log("connection error"));
    }
  }, [connected])

  useEffect(() => {
    if (uid) {
      getNotificationPermissions()
      const preferenceSubscription = firestore().collection('users').doc(uid).collection('contentPreferences').doc("preferences")
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
  }, [uid])

  useEffect(() => {
    getNotificationPermissions();
    if (prevDayNotifications !== undefined && prevDayNotifications !== dayNotifications) {
      firestore().collection("users").doc(uid).collection('contentPreferences').doc("preferences").set({
        dayNotifications: dayNotifications
      }, { merge: true })
        .then(() => {
          // console.log("Document successfully written!");
        })
        .catch(error => {
          // console.error("Error writing document: ", error);
        });
    }
  }, [dayNotifications])

  useEffect(() => {
    getNotificationPermissions();
    if (prevWeekNotifications !== undefined && prevWeekNotifications !== weekNotifications) {
      firestore().collection("users").doc(uid).collection('contentPreferences').doc("preferences").set({
        weekNotifications: weekNotifications
      }, { merge: true })
        .then(() => {
          // console.log("Document successfully written!");
        })
        .catch(error => {
          // console.error("Error writing document: ", error);
        });
    }
  }, [weekNotifications])

  function signOut() {
    auth().signOut().then(() => console.log('User signed out!'));
  }

  async function getNotificationPermissions() {
    const res = await messaging().hasPermission();
    if (!res) {
      setHasPermissions(false);
    }
    else {
      setHasPermissions(true);
    }
  }

  function NotificationSetting({ title, onValueChange, value }: { title: string, onValueChange: () => void, value: boolean }) {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.item}>
          <Text style={{ ...iOSUIKit.bodyWhiteObject }}>{title}</Text>
          <Switch
            trackColor={{ false: "red", true: iOSColors.blue }}
            style={{ marginRight: 16 }}
            onValueChange={onValueChange}
            value={value}
          />
        </View>
      </View>
    )
  }

  function Icon({ details }: { details: IAPItemDetails }) {
    let name = "";
    let color = "";
    if (details.title === "Coffee-Sized Tip") {
      name = "cafe";
      color = "brown";
    }
    else if (details.title === "Snack-Sized Tip") {
      name = "ice-cream"
      color = "lightgreen";
    }
    else if (details.title === "Pizza-Sized Tip") {
      name = "pizza"
      color = iOSColors.yellow;
    }
    return <Ionicons name={name} color={color} size={28} />
  }

  function TipModal() {
    return (
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight={true}
        childrenStyle={{ marginBottom: Platform.OS === "ios" ? tabBarheight + 16 : 16 }}
        modalStyle={colorScheme === "dark" ? { backgroundColor: "#121212" } : {}}
        onClosed={() => null}
      >
        <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, marginHorizontal: 16, marginVertical: 16 } : iOSUIKit.body}>
          If you're feeling generous and would like to support LookForward's development further, any tip helps!
        </Text>
        {iapItems?.length > 0
          ?
          iapItems?.map((details, i) => {
            return (
              <Pressable
                key={i}
                onPress={() => purchaseItemAsync(details.productId)}
                style={{
                  marginHorizontal: 16,
                  marginTop: 16,
                  paddingBottom: i < iapItems.length - 1 ? 16 : 0,
                  borderBottomWidth: i < iapItems.length - 1 ? StyleSheet.hairlineWidth : 0,
                  borderColor: i < iapItems.length - 1 ? "#3c3d41" : undefined
                }}
              >
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                  {/* <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{JSON.stringify(details)}</Text> */}
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Icon details={details} />
                    <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, marginHorizontal: 16 } : iOSUIKit.body}>{details.title}</Text>
                  </View>
                  <Text style={reusableStyles.date}>{details.price}</Text>
                </View>
              </Pressable>
            )
          })
          :
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        }
      </Modalize>
    )
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <Text style={{ ...reusableStyles.date, paddingTop: 24, paddingLeft: 16, paddingBottom: 8 }}>COUNTDOWN NOTIFICATIONS</Text>
        <NotificationSetting title="Day Before" onValueChange={toggleDaySwitch} value={dayNotifications} />
        <NotificationSetting title="Week Before" onValueChange={toggleWeekSwitch} value={weekNotifications} />
        {!hasPermissions &&
          <Text style={{ ...reusableStyles.date, paddingTop: 8, paddingLeft: 16 }}>Please enable notifications in your device's settings</Text>
        }
        {Platform.OS === "ios" &&
          <Pressable style={{ ...styles.buttonContainer }} onPress={() => modalizeRef.current?.open()}>
            <View style={styles.button}>
              <Text style={{ ...iOSUIKit.bodyObject, color: iOSColors.blue }}>Tip Jar</Text>
            </View>
          </Pressable>
        }
        <Pressable style={{ ...styles.buttonContainer }} onPress={() => signOut()}>
          <View style={styles.button}>
            <Text style={{ ...iOSUIKit.bodyObject, color: iOSColors.red }}>Sign Out</Text>
          </View>
        </Pressable>
      </View>
      <TipModal />
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-between",
    backgroundColor: "#1f1f1f",
    paddingLeft: 16,
    alignItems: "center"
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-between",
    borderColor: "#3c3d41",
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    paddingVertical: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "center",
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    marginTop: 32
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "center",
    borderColor: "#3c3d41",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 16
  },
});

export default Profile;
