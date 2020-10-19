import React, { useEffect, useState } from 'react';
import {
  Appearance,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

function Profile({ route, navigation }: any) {
  const uid = route.params.uid;
  const [dayNotifications, setDayNotifications] = useState(false);
  const [weekNotifications, setWeekNotifications] = useState(false);
  const toggleDaySwitch = () => setDayNotifications(previousState => !previousState);
  const toggleWeekSwitch = () => setWeekNotifications(previousState => !previousState);
  const colorScheme = Appearance.getColorScheme();

  useEffect(() => {
    if (uid) {
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
    firestore().collection("users").doc(uid).collection('contentPreferences').doc("preferences").update({
      dayNotifications: dayNotifications,
      weekNotifications: weekNotifications
    })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });
  }, [dayNotifications, weekNotifications])

  function signOut() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.itemContainer}>
        <View style={styles.item}>
          <Text style={{ ...iOSUIKit.bodyWhiteObject }}>Daily notifications</Text>
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
          <Text style={{ ...iOSUIKit.bodyWhiteObject }}>Weekly notifications</Text>
          <Switch
            trackColor={{ false: "red", true: iOSColors.blue }}
            style={{ marginRight: 16 }}
            onValueChange={toggleWeekSwitch}
            value={weekNotifications}
          />
        </View>
      </View>
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
