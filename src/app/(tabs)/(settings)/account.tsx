import { getAuth, signOut } from "@react-native-firebase/auth";
import { Link } from "expo-router";
import { Alert, ScrollView } from "react-native";

import { SettingNavButton } from "@/screens/Settings/components/SettingNavButton";

function handleSignOut() {
  const auth = getAuth();
  signOut(auth);
}

export default function AccountScreen() {
  return (
    <ScrollView>
      <SettingNavButton
        onPress={() =>
          Alert.alert("Sign out?", undefined, [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Out", style: "destructive", onPress: handleSignOut },
          ])
        }
        text="Sign Out"
        isFirstInGroup={true}
      />
      <Link href="/(tabs)/(settings)/delete-account" asChild>
        <SettingNavButton text="Delete Account" isFirstInGroup={false} />
      </Link>
    </ScrollView>
  );
}
