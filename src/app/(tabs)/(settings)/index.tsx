import * as Colors from "@bacons/apple-colors";
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
import { Linking, Pressable, ScrollView, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { NotificationSetting } from "@/screens/Settings/components/NotificationSetting";
import { SettingNavButton } from "@/screens/Settings/components/SettingNavButton";
import { TipModal } from "@/screens/Settings/components/TipModal";
import { useInterfaceStore } from "@/stores";

import { ViewSeparator } from "./ViewSeparator";

export default function Settings() {
  const user = useAuthenticatedUser();
  const { onboardingModalRef } = useInterfaceStore();
  const [notificationPermissions, setNotificationPermissions] = useState(true);
  const [notifications, setNotifications] = useState({
    day: false,
    week: false,
  });

  const modalRef = useRef<BottomSheetModal>();

  useEffect(() => {
    getNotificationPermissions();
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
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
    const authStatus = await hasPermission(messaging);
    setNotificationPermissions(authStatus);
  }

  return (
    <ScrollView style={{ paddingHorizontal: 16 }}>
      <Text
        style={{
          ...iOSUIKit.bodyEmphasizedObject,
          color: Colors.secondaryLabel,
          marginHorizontal: 16,
          paddingBottom: 9,
        }}
      >
        Countdown Notifications
      </Text>
      <NotificationSetting
        title="Day Before"
        onValueChange={async (value) => {
          // setNotifications({ ...notifications, day: value })
          const db = getFirestore();
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { "notifications.day": value });
          await getNotificationPermissions();
        }}
        value={notifications?.day}
        style={{ borderTopLeftRadius: 26, borderTopRightRadius: 26 }}
      />
      <ViewSeparator />
      <NotificationSetting
        title="Week Before"
        onValueChange={async (value) => {
          // setNotifications({ ...notifications, week: value })
          const db = getFirestore();
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { "notifications.week": value });
          await getNotificationPermissions();
        }}
        value={notifications?.week}
        style={{ borderBottomLeftRadius: 26, borderBottomRightRadius: 26 }}
      />
      {!notificationPermissions && (
        <Pressable onPress={() => Linking.openSettings()}>
          <Text
            style={{
              ...iOSUIKit.footnoteObject,
              color: Colors.systemBlue,
              paddingTop: 8,
              paddingHorizontal: 16,
            }}
          >
            {`Please enable notifications in your device's settings.`}
          </Text>
        </Pressable>
      )}
      <>
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
          isFirstInGroup
          style={{ borderTopLeftRadius: 26, borderTopRightRadius: 26 }}
        />
        <ViewSeparator />
        <Link
          href="itms-apps://itunes.apple.com/app/viewContentsUserReviews/id1492748952?action=write-review"
          asChild
        >
          <SettingNavButton
            text="Write a Review"
            style={{ borderBottomLeftRadius: 26, borderBottomRightRadius: 26 }}
          />
        </Link>
        <SettingNavButton
          onPress={() => onboardingModalRef.current?.present()}
          text="Show Getting Started"
          isFirstInGroup
          style={{ borderRadius: 26 }}
        />
      </>
      <Link href="/(tabs)/(settings)/account" asChild>
        <SettingNavButton
          text="Account"
          isFirstInGroup
          style={{ borderRadius: 26 }}
        />
      </Link>
      <TipModal modalRef={modalRef} />
    </ScrollView>
  );
}
