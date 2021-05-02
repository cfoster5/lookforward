import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { Navigation } from '../../types';
import usePrevious from '../helpers/helpers';
import { reusableStyles } from '../helpers/styles';

function Profile({ route, navigation }: Navigation.ProfileScreenProps) {
  const uid = route.params.uid;
  const [hasPermissions, setHasPermissions] = useState(true);
  const [dayNotifications, setDayNotifications] = useState(false);
  const [weekNotifications, setWeekNotifications] = useState(false);
  const toggleDaySwitch = () => setDayNotifications(previousState => !previousState);
  const toggleWeekSwitch = () => setWeekNotifications(previousState => !previousState);
  const prevDayNotifications = usePrevious(dayNotifications);
  const prevWeekNotifications = usePrevious(weekNotifications);

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

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ ...reusableStyles.date, paddingTop: 24, paddingLeft: 16, paddingBottom: 8 }}>COUNTDOWN NOTIFICATIONS</Text>
      <View style={styles.itemContainer}>
        <View style={styles.item}>
          <Text style={{ ...iOSUIKit.bodyWhiteObject }}>Day Before</Text>
          <Switch
            trackColor={{ false: "red", true: iOSColors.blue }}
            style={{ marginRight: 16 }}
            onValueChange={toggleDaySwitch}
            value={dayNotifications}
          />
        </View>
      </View>
      <View style={{ ...styles.itemContainer, paddingLeft: 0 }}>
        <View style={{ ...styles.item, paddingLeft: 16 }}>
          <Text style={{ ...iOSUIKit.bodyWhiteObject }}>Week Before</Text>
          <Switch
            trackColor={{ false: "red", true: iOSColors.blue }}
            style={{ marginRight: 16 }}
            onValueChange={toggleWeekSwitch}
            value={weekNotifications}
          />
        </View>
      </View>
      {!hasPermissions &&
        <Text style={{ ...reusableStyles.date, paddingTop: 8, paddingLeft: 16 }}>Please enable notifications in your device's settings</Text>
      }
      <Pressable style={{ ...styles.buttonContainer }} onPress={() => signOut()}>
        <View style={styles.button}>
          <Text style={{ ...iOSUIKit.bodyObject, color: iOSColors.red }}>Sign Out</Text>
        </View>
      </Pressable>
    </View>
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
