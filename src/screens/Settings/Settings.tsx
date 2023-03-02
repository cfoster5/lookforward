import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import { reusableStyles } from "helpers/styles";
import React, { useEffect, useRef, useState } from "react";
import { Platform, Text, View } from "react-native";
import { Modalize } from "react-native-modalize";

import { NotificationSetting } from "./components/NotificationSetting";
import { SettingNavButton } from "./components/SettingNavButton";
import { TipModal } from "./components/TipModal";
import { useFirstRender } from "./hooks/useFirstRender";

import { useStore } from "@/stores/store";

function Settings({ navigation }) {
  const { user } = useStore();
  const [hasPermissions, setHasPermissions] = useState(true);

  const [notifications, setNotifications] = useState({
    day: false,
    week: false,
  });

  const modalizeRef = useRef<Modalize>(null);
  const firstRender = useFirstRender();

  useEffect(() => {
    getNotificationPermissions();
    const preferenceSubscription = firestore()
      .collection("users")
      .doc(user!.uid)
      .onSnapshot(
        (docSnapshot) => setNotifications(docSnapshot.data()?.notifications),
        (error) => console.log(error)
      );
    // Stop listening for updates when no longer required
    return preferenceSubscription;
  }, [user]);

  useEffect(() => {
    if (!firstRender) {
      console.log("notifications update", notifications);
      getNotificationPermissions();
      firestore().collection("users").doc(user!.uid).update({ notifications });
    }
  }, [notifications]);

  async function getNotificationPermissions() {
    const res = await messaging().hasPermission();
    setHasPermissions(res);
    // if (!res) {
    //   setHasPermissions(false);
    // } else {
    //   setHasPermissions(true);
    // }
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            ...reusableStyles.date,
            paddingTop: 24,
            paddingLeft: 16,
            paddingBottom: 8,
          }}
        >
          COUNTDOWN NOTIFICATIONS
        </Text>
        <NotificationSetting
          title="Day Before"
          onValueChange={(value) =>
            setNotifications({ ...notifications, day: value })
          }
          value={notifications.day}
        />
        <NotificationSetting
          title="Week Before"
          onValueChange={(value) =>
            setNotifications({ ...notifications, week: value })
          }
          value={notifications.week}
          style={{ borderBottomWidth: 0 }}
        />
        {!hasPermissions && (
          <Text
            style={{ ...reusableStyles.date, paddingTop: 8, paddingLeft: 16 }}
          >
            Please enable notifications in your device's settings
          </Text>
        )}
        {Platform.OS === "ios" && (
          <SettingNavButton
            handlePress={() => modalizeRef.current?.open()}
            text="Tip Jar"
          />
        )}
        <SettingNavButton
          handlePress={() => navigation.navigate("Account")}
          text="Account"
        />
      </View>
      {Platform.OS === "ios" && <TipModal modalizeRef={modalizeRef} />}
    </>
  );
}

export default Settings;
