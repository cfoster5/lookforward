import { BottomSheetModal } from "@gorhom/bottom-sheet";
import analytics from "@react-native-firebase/analytics";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Linking, Platform, Text, View } from "react-native";

import { reusableStyles } from "@/helpers/styles";
import { NotificationSetting } from "@/screens/Settings/components/NotificationSetting";
import { SettingNavButton } from "@/screens/Settings/components/SettingNavButton";
import { TipModal } from "@/screens/Settings/components/TipModal";
import { useStore } from "@/stores/store";

export default function Settings() {
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
        (error) => console.log(error),
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
          value={notifications?.day}
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
        <>
          <SettingNavButton
            onPress={async () => {
              proModalRef.current?.present();
              await analytics().logEvent("select_promotion", {
                name: "Pro",
                id: "com.lookforward.pro",
              });
            }}
            text="Explore Pro Features"
            isFirstInGroup={true}
          />
          <SettingNavButton
            onPress={async () => {
              modalRef.current?.present();
              await analytics().logEvent("select_promotion", {
                name: "Tip Jar",
                items: [
                  { id: "com.lookforward.tip1" },
                  { id: "com.lookforward.tip3" },
                  { id: "com.lookforward.tip5" },
                ],
              });
            }}
            text="Tip Jar"
            isFirstInGroup={false}
          />
          <Link
            href="itms-apps://itunes.apple.com/app/viewContentsUserReviews/id1492748952?action=write-review"
            asChild
          >
            <SettingNavButton text="Write a Review" isFirstInGroup={false} />
          </Link>
          <SettingNavButton
            onPress={() => onboardingModalRef.current?.present()}
            text="Show Getting Started"
            isFirstInGroup={true}
          />
        </>
        <Link href="/(tabs)/(settings)/account" asChild>
          <SettingNavButton text="Account" isFirstInGroup={true} />
        </Link>
      </View>
      <TipModal modalRef={modalRef} />
    </>
  );
}
