import { Color } from "expo-router";
import { deleteUser, getAuth } from "@react-native-firebase/auth";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { reusableStyles } from "@/helpers/styles";
import { revokeAppleToken } from "@/utils/appleAuth";

export default function DeleteAccountScreen() {
  const [password, setPassword] = useState("");
  async function deleteAccount() {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Revoke Apple token if user signed in with Apple
      // This is required by Apple's guidelines
      await revokeAppleToken();

      // Delete the user account
      await deleteUser(currentUser);
      console.log("User deleted");
    }
  }

  return (
    <ScrollView style={{ marginHorizontal: 16 }}>
      <Text
        style={[
          iOSUIKit.title3Emphasized,
          { color: Color.ios.label, marginBottom: 16 },
        ]}
      >
        Confirm request
      </Text>
      <Text
        style={[
          iOSUIKit.body,
          {
            color: Color.ios.secondaryLabel,
            marginBottom: 8,
          },
        ]}
      >
        {`Complete your deletion request by entering "DELETE"`}.
      </Text>
      <TextInput
        style={reusableStyles.textInput}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Pressable
        style={{
          backgroundColor: Color.ios.systemRed,
          width: "100%",
          marginTop: 16,
          paddingVertical: 16,
          borderRadius: 12,
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
                ],
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
    </ScrollView>
  );
}
