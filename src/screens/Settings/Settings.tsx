import { BottomSheetModal } from "@gorhom/bottom-sheet";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import { useEffect, useRef, useState } from "react";
import { Platform, Text, View } from "react-native";

import { NotificationSetting } from "./components/NotificationSetting";
import { SettingNavButton } from "./components/SettingNavButton";
import { TipModal } from "./components/TipModal";

import { reusableStyles } from "@/helpers/styles";
import { useStore } from "@/stores/store";

function Settings({ navigation }) {
  const { user, onboardingModalRef, proModalRef } = useStore();
  const [hasPermissions, setHasPermissions] = useState(true);
  const [notifications, setNotifications] = useState({
    day: false,
    week: false,
  });

  const modalRef = useRef<BottomSheetModal>();

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
          onValueChange={async (value) => {
            // setNotifications({ ...notifications, day: value })
            await firestore()
              .collection("users")
              .doc(user!.uid)
              .update({ "notifications.day": value });
            await getNotificationPermissions();
          }}
          value={notifications.day}
        />
        <NotificationSetting
          title="Week Before"
          onValueChange={async (value) => {
            // setNotifications({ ...notifications, week: value })
            await firestore()
              .collection("users")
              .doc(user!.uid)
              .update({ "notifications.week": value });
            await getNotificationPermissions();
          }}
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
          <>
            <SettingNavButton
              handlePress={() => proModalRef.current?.present()}
              text="Explore Pro Features"
            />
            <SettingNavButton
              handlePress={() => modalRef.current?.present()}
              text="Tip Jar"
              buttonStyle={{ marginTop: 0 }}
            />
            <SettingNavButton
              handlePress={() => onboardingModalRef.current?.present()}
              text="Show Getting Started"
            />
          </>
        )}
        <SettingNavButton
          handlePress={() => navigation.navigate("Account")}
          text="Account"
        />
      </View>
      {Platform.OS === "ios" && <TipModal modalRef={modalRef} />}
    </>
  );
}

export default Settings;
