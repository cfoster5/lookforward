import auth from "@react-native-firebase/auth";
import { reusableStyles } from "helpers/styles";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
  <Pressable style={styles.itemContainer} onPress={handlePress}>
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
          color: iOSColors.gray,
          marginBottom: 8,
        }}
      >
        Complete your deletion request by entering "DELETE".
      </Text>
      <TextInput
        style={{
          ...iOSUIKit.bodyObject,
          backgroundColor: "#1c1c1e",
          color: "white",
          padding: 16,
          borderRadius: 8,
          marginVertical: 8,
        }}
        // placeholder="Password"
        // placeholderTextColor="#9898a1"
        // textContentType=""
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Pressable
        style={{
          backgroundColor: iOSColors.red,
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

export default DeleteAccountScreen;
