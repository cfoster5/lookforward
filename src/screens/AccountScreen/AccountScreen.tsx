import auth from "@react-native-firebase/auth";
import { reusableStyles } from "helpers/styles";
import React from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";

const SettingsItem = ({
  handlePress,
  text,
  style,
}: {
  handlePress: () => void;
  text: string;
  style?: ViewStyle;
}) => (
  <Pressable
    style={({ pressed }) => [
      styles.itemContainer,
      pressed ? { backgroundColor: "#2c2c2e" } : null,
    ]}
    // style={styles.itemContainer}
    onPress={handlePress}
  >
    <View style={[styles.item, style]}>
      <Text style={{ ...iOSUIKit.bodyWhiteObject }}>{text}</Text>
      <Ionicons
        name="chevron-forward"
        color={iOSColors.gray}
        size={iOSUIKit.bodyObject.fontSize}
        style={{ alignSelf: "center", marginRight: 16 }}
      />
    </View>
  </Pressable>
);

export const AccountScreen = ({ navigation }) => {
  function signOut() {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  }

  return (
    <View style={{ flex: 1, paddingTop: 24 }}>
      {/* <Text
        style={{
          ...reusableStyles.date,
          paddingTop: 24,
          paddingLeft: 16,
          paddingBottom: 8,
        }}
      >
        COUNTDOWN NOTIFICATIONS
      </Text> */}
      <SettingsItem
        handlePress={() =>
          Alert.alert("Sign out?", undefined, [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Out", style: "destructive", onPress: signOut },
          ])
        }
        text="Sign Out"
      />
      <SettingsItem
        handlePress={() => navigation.navigate("DeleteAccount")}
        text="Delete Account"
        style={{ borderBottomWidth: 0 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "#1c1c1e",
    paddingLeft: 16,
    alignItems: "center",
  },
  item: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderColor: "#3c3d41",
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    paddingVertical: 16,
  },
});

export default AccountScreen;
