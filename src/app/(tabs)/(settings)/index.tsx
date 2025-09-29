import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import {
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "@react-native-firebase/firestore";
import { getMessaging, hasPermission } from "@react-native-firebase/messaging";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text } from "react-native";

import { reusableStyles } from "@/helpers/styles";
import { NotificationSetting } from "@/screens/Settings/components/NotificationSetting";
import { SettingNavButton } from "@/screens/Settings/components/SettingNavButton";
import { TipModal } from "@/screens/Settings/components/TipModal";
import { useAuthStore, useInterfaceStore } from "@/stores";

export default function Settings() {
  const { user } = useAuthStore();
  const { onboardingModalRef } = useInterfaceStore();
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
    const messaging = getMessaging();
    const res = await hasPermission(messaging);
    setHasPermissions(res);
    // if (!res) {
    //   setHasPermissions(false);
    // } else {
    //   setHasPermissions(true);
    // }
  }

  return (
    <ScrollView>
      <Text
        style={{
          ...reusableStyles.date,
          // paddingTop: 24,
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
          const db = getFirestore();
          const userRef = doc(db, "users", user!.uid);
          await updateDoc(userRef, { "notifications.day": value });
          await getNotificationPermissions();
        }}
        value={notifications?.day}
      />
      <NotificationSetting
        title="Week Before"
        onValueChange={async (value) => {
          // setNotifications({ ...notifications, week: value })
          const db = getFirestore();
          const userRef = doc(db, "users", user!.uid);
          await updateDoc(userRef, { "notifications.week": value });
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
        {/* <SettingNavButton
            onPress={async () => {
              proModalRef.current?.present();
              const analytics = getAnalytics();
              await logEvent(analytics, "select_promotion", {
                name: "Pro",
                id: "com.lookforward.pro",
              });
            }}
            text="Explore Pro Features"
            isFirstInGroup={true}
          /> */}
        <SettingNavButton
          onPress={async () => {
            modalRef.current?.present();
            const analytics = getAnalytics();
            await logEvent(analytics, "select_promotion", {
              name: "Tip Jar",
              items: [
                { id: "com.lookforward.tip1" },
                { id: "com.lookforward.tip3" },
                { id: "com.lookforward.tip5" },
              ],
            });
          }}
          text="Tip Jar"
          isFirstInGroup={true}
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

      <TipModal modalRef={modalRef} />
    </ScrollView>
  );
}
