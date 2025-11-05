import { getAuth, signOut } from "@react-native-firebase/auth";
import { Link } from "expo-router";
import { Alert, ScrollView } from "react-native";

import { SettingNavButton } from "@/screens/Settings/components/SettingNavButton";

import { ViewSeparator } from "./ViewSeparator";

function handleSignOut() {
  const auth = getAuth();
  signOut(auth);
}

export default function AccountScreen() {
  return (
    <ScrollView style={{ paddingHorizontal: 16 }}>
      <SettingNavButton
        onPress={() =>
          Alert.alert("Sign out?", undefined, [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Out", style: "destructive", onPress: handleSignOut },
          ])
        }
        text="Sign Out"
        isFirstInGroup
        style={{ borderTopLeftRadius: 26, borderTopRightRadius: 26 }}
      />
      <ViewSeparator />
      <Link href="/(tabs)/(settings)/delete-account" asChild>
        <SettingNavButton
          text="Delete Account"
          style={{ borderBottomLeftRadius: 26, borderBottomRightRadius: 26 }}
        />
      </Link>
    </ScrollView>
  );
}
