import { getAuth, signOut } from "@react-native-firebase/auth";
import { Link } from "expo-router";
import { Alert, ScrollView } from "react-native";

import { ViewSeparator } from "@/components/ViewSeparator";
import { SettingNavButton } from "@/screens/Settings/components/SettingNavButton";
import { useAuthStore } from "@/stores";

function handleSignOut() {
  const auth = getAuth();
  signOut(auth);
}

export default function AccountScreen() {
  const { user } = useAuthStore();
  const isAnonymous = user?.isAnonymous;

  return (
    <ScrollView style={{ paddingHorizontal: 16 }}>
      {isAnonymous ? (
        <>
          <Link href="/(tabs)/(settings)/create-account" asChild>
            <SettingNavButton
              text="Create Account"
              isFirstInGroup
              style={{ borderTopLeftRadius: 26, borderTopRightRadius: 26 }}
            />
          </Link>
          <ViewSeparator />
          <Link href="/(tabs)/(settings)/login" asChild>
            <SettingNavButton text="Sign In" />
          </Link>
          <ViewSeparator />
          <Link href="/(tabs)/(settings)/delete-account" asChild>
            <SettingNavButton
              text="Delete Account"
              style={{
                borderBottomLeftRadius: 26,
                borderBottomRightRadius: 26,
              }}
            />
          </Link>
        </>
      ) : (
        <>
          <SettingNavButton
            onPress={() =>
              Alert.alert("Sign out?", undefined, [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Sign Out",
                  style: "destructive",
                  onPress: handleSignOut,
                },
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
              style={{
                borderBottomLeftRadius: 26,
                borderBottomRightRadius: 26,
              }}
            />
          </Link>
        </>
      )}
    </ScrollView>
  );
}
