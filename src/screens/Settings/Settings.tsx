import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getAnalytics } from "@react-native-firebase/analytics";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
} from "@react-native-firebase/firestore";
import { getMessaging } from "@react-native-firebase/messaging";
import { useEffect, useRef, useState } from "react";
import { Linking, Platform, Text, View } from "react-native";

import { reusableStyles } from "@/helpers/styles";
import { useStore } from "@/stores/store";

import { NotificationSetting } from "./components/NotificationSetting";
import { SettingNavButton } from "./components/SettingNavButton";
import { TipModal } from "./components/TipModal";

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
    const db = getFirestore();
    const userRef = doc(db, "users", user!.uid);
    const preferenceSubscription = onSnapshot(
      userRef,
      (docSnapshot) => setNotifications(docSnapshot.data()?.notifications),
      (error) => console.log(error),
    );
    // Stop listening for updates when no longer required
    return preferenceSubscription;
  }, [user]);

  async function getNotificationPermissions() {
    const res = await getMessaging().hasPermission();
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
            {
              const db = getFirestore();
              const userRef = doc(db, "users", user!.uid);
              await updateDoc(userRef, { "notifications.day": value });
            }
            await getNotificationPermissions();
          }}
          value={notifications?.day}
        />
        <NotificationSetting
          title="Week Before"
          onValueChange={async (value) => {
            {
              const db = getFirestore();
              const userRef = doc(db, "users", user!.uid);
              await updateDoc(userRef, { "notifications.week": value });
            }
            await getNotificationPermissions();
          }}
          value={notifications?.week}
          style={{ borderBottomWidth: 0 }}
        />
        {!hasPermissions && (
          <Text
            style={{ ...reusableStyles.date, paddingTop: 8, paddingLeft: 16 }}
          >
            {`Please enable notifications in your device's settings`}
          </Text>
        )}
        {Platform.OS === "ios" && (
          <>
            {/* <SettingNavButton
              handlePress={async () => {
                proModalRef.current?.present();
                await getAnalytics().logEvent("select_promotion", {
                  name: "Pro",
                  id: "com.lookforward.pro",
                });
              }}
              text="Explore Pro Features"
            /> */}
            <SettingNavButton
              handlePress={async () => {
                modalRef.current?.present();
                await getAnalytics().logEvent("select_promotion", {
                  name: "Tip Jar",
                  items: [
                    { id: "com.lookforward.tip1" },
                    { id: "com.lookforward.tip3" },
                    { id: "com.lookforward.tip5" },
                  ],
                });
              }}
              text="Tip Jar"
              // buttonStyle={{ marginTop: 0 }}
            />
            <SettingNavButton
              handlePress={() => {
                Linking.openURL(
                  `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id1492748952?action=write-review`,
                );
              }}
              text="Write a Review"
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
