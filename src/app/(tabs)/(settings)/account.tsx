import auth from "@react-native-firebase/auth";
import { Link } from "expo-router";
import { Alert, View } from "react-native";

import { SettingNavButton } from "@/screens/Settings/components/SettingNavButton";

function signOut() {
  auth()
    .signOut()
    .then(() => console.log("User signed out!"));
}

export default function AccountScreen() {
  return (
    <View style={{ flex: 1, paddingTop: 12 }}>
      <SettingNavButton
        onPress={() =>
          Alert.alert("Sign out?", undefined, [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Out", style: "destructive", onPress: signOut },
          ])
        }
        text="Sign Out"
        isFirstInGroup={true}
      />
      <Link href="/(tabs)/(settings)/delete-account" asChild>
        <SettingNavButton text="Delete Account" isFirstInGroup={false} />
      </Link>
    </View>
  );
}
