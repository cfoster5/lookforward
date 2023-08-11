import auth from "@react-native-firebase/auth";
import { useState } from "react";
import {
  Alert,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";

import { reusableStyles } from "@/helpers/styles";

const SettingsItem = ({
  handlePress,
  text,
  style,
}: {
  handlePress: () => void;
  text: string;
  style?: ViewStyle;
}) => (
  <Pressable style={styles.itemContainer} onPress={handlePress}>
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

export const DeleteAccountScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");
  function deleteAccount() {
    auth()
      .currentUser?.delete()
      .then(() => console.log("User deleted"));
  }

  return (
    <View style={{ flex: 1, margin: 16 }}>
      <Text style={[iOSUIKit.title3EmphasizedWhite, { marginBottom: 16 }]}>
        Confirm request
      </Text>
      <Text
        style={{
          ...iOSUIKit.bodyObject,
          color: PlatformColor("systemGray"),
          marginBottom: 8,
        }}
      >
        Complete your deletion request by entering "DELETE".
      </Text>
      <TextInput
        style={{
          ...iOSUIKit.bodyObject,
          backgroundColor: PlatformColor("systemGray6"),
          color: "white",
          padding: 16,
          borderRadius: 8,
          marginVertical: 8,
        }}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Pressable
        style={{
          backgroundColor: PlatformColor("systemRed"),
          width: "100%",
          marginTop: 16,
          paddingVertical: 16,
          borderRadius: 8,
          opacity: password === "DELETE" ? 1 : 0.5,
        }}
        onPress={() =>
          password
            ? Alert.alert(
                "Delete your account?",
                "Your account will be deleted.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteAccount(),
                  },
                ]
              )
            : null
        }
      >
        <Text
          style={{
            ...iOSUIKit.bodyEmphasizedWhiteObject,
            textAlign: "center",
          }}
        >
          Delete
        </Text>
      </Pressable>
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

export default DeleteAccountScreen;
