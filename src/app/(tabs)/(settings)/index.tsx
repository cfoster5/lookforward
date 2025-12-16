import * as Colors from "@bacons/apple-colors";
import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import {
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "@react-native-firebase/firestore";
import { getMessaging, hasPermission } from "@react-native-firebase/messaging";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import Purchases from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";
import { iOSUIKit } from "react-native-typography";

import { useProOfferings } from "@/api/getProOfferings";
import { DropdownMenu } from "@/components/DropdownMenu";
import { ViewSeparator } from "@/components/ViewSeparator";
import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { tmdb } from "@/providers/app";
import { NotificationSetting } from "@/screens/Settings/components/NotificationSetting";
import { SettingNavButton } from "@/screens/Settings/components/SettingNavButton";
import { useInterfaceStore } from "@/stores";
import { useAppConfigStore } from "@/stores/appConfig";

export default function Settings() {
  const user = useAuthenticatedUser();
  const { onboardingModalRef } = useInterfaceStore();
  const { movieRegion, movieLanguage, setMovieRegion, setMovieLanguage } =
    useAppConfigStore();
  const [notificationPermissions, setNotificationPermissions] = useState(true);
  const [notifications, setNotifications] = useState({
    day: false,
    week: false,
  });

  async function getNotificationPermissions() {
    const messaging = getMessaging();
    const authStatus = await hasPermission(messaging);
    setNotificationPermissions(authStatus);
  }

  useEffect(() => {
    getNotificationPermissions();
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    const preferenceSubscription = onSnapshot(
      userRef,
      (docSnapshot) => {
        const data = docSnapshot.data();
        setNotifications(data?.notifications);
      },
      (error) => console.log(error),
    );
    // Stop listening for updates when no longer required
    return preferenceSubscription;
  }, [user]);

  const { data: pro } = useProOfferings();

  const { data: tips } = useQuery({
    queryKey: ["tipsPackages"],
    queryFn: async () => await Purchases.getOfferings(),
    select: (data) => data.all["tips"],
  });

  const { data: countries } = useQuery({
    queryKey: ["tmdbCountries"],
    queryFn: async () => await tmdb.configuration.getCountries(),
  });

  const { data: languages } = useQuery({
    queryKey: ["tmdbLanguages"],
    queryFn: async () => await tmdb.configuration.getLanguages(),
  });

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
      <View
        style={{
          backgroundColor: Colors.secondarySystemGroupedBackground,
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          paddingHorizontal: 16,
          marginTop: 32,
          minHeight: 44,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ ...iOSUIKit.bodyObject, color: Colors.label }}>
          Movie Region
        </Text>
        <DropdownMenu
          options={
            countries
              ?.map((country) => ({
                value: country.iso_3166_1,
                label: country.english_name,
              }))
              .sort((a, b) => a.label.localeCompare(b.label)) ?? []
          }
          selectedValue={movieRegion}
          handleSelect={(value) => {
            setMovieRegion(value as string);
          }}
        >
          <Pressable
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ ...iOSUIKit.bodyObject, color: Colors.systemBlue }}>
              {countries?.find((c) => c.iso_3166_1 === movieRegion)
                ?.english_name ?? movieRegion}
            </Text>
          </Pressable>
        </DropdownMenu>
      </View>
      <ViewSeparator />
      <View
        style={{
          backgroundColor: Colors.secondarySystemGroupedBackground,
          borderBottomLeftRadius: 26,
          borderBottomRightRadius: 26,
          paddingHorizontal: 16,
          minHeight: 44,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ ...iOSUIKit.bodyObject, color: Colors.label }}>
          Movie Language
        </Text>
        <DropdownMenu
          options={
            languages
              ?.map((language) => ({
                value: language.iso_639_1,
                label: language.english_name,
              }))
              .sort((a, b) => a.label.localeCompare(b.label)) ?? []
          }
          selectedValue={movieLanguage}
          handleSelect={(value) => {
            setMovieLanguage(value as string);
          }}
        >
          <Pressable
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ ...iOSUIKit.bodyObject, color: Colors.systemBlue }}>
              {languages?.find((l) => l.iso_639_1 === movieLanguage)
                ?.english_name ?? movieLanguage}
            </Text>
          </Pressable>
        </DropdownMenu>
      </View>
      <SettingNavButton
        onPress={async () => {
          await RevenueCatUI.presentPaywall({ offering: pro });
          const analytics = getAnalytics();
          await logEvent(analytics, "select_promotion", {
            name: "Pro",
            id: "com.lookforward.pro",
          });
        }}
        text="Explore Pro Features"
        isFirstInGroup
        style={{ borderRadius: 26 }}
      />
      <SettingNavButton
        onPress={async () => {
          await RevenueCatUI.presentPaywall({ offering: tips });
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
      <Link href="/(tabs)/(settings)/account" asChild>
        <SettingNavButton
          text="Account"
          isFirstInGroup
          style={{ borderRadius: 26 }}
        />
      </Link>
    </ScrollView>
  );
}
