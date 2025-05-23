import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import {
  Alert,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { iOSUIKit } from "react-native-typography";

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
      pressed ? { backgroundColor: PlatformColor("systemGray5") } : null,
    ]}
    // style={styles.itemContainer}
    onPress={handlePress}
  >
    <View style={[styles.item, style]}>
      <Text style={{ ...iOSUIKit.bodyWhiteObject }}>{text}</Text>
      <Ionicons
        name="chevron-forward"
        color={PlatformColor("systemGray")}
        size={iOSUIKit.bodyObject.fontSize}
        style={{ alignSelf: "center", marginRight: 16 }}
      />
    </View>
  </Pressable>
);

const AccountScreen = ({ navigation }) => {
  function signOut() {
    getAuth()
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
    backgroundColor: PlatformColor("systemGray6"),
    paddingLeft: 16,
    alignItems: "center",
  },
  item: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderColor: PlatformColor("separator"),
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    paddingVertical: 16,
  },
});

export default AccountScreen;
