import auth from "@react-native-firebase/auth";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { Colors } from "@/constants/Colors";

export const DeleteAccountScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");
  function deleteAccount() {
    auth()
      .currentUser?.delete()
      .then(() => console.log("User deleted"));
  }

  return (
    <View style={{ flex: 1, margin: 16 }}>
      <Text
        style={[
          iOSUIKit.title3Emphasized,
          { color: Colors.label, marginBottom: 16 },
        ]}
      >
        Confirm request
      </Text>
      <Text
        style={[
          iOSUIKit.body,
          {
            color: Colors.secondaryLabel,
            marginBottom: 8,
          },
        ]}
      >
        Complete your deletion request by entering "DELETE".
      </Text>
      <TextInput
        style={{
          ...iOSUIKit.bodyObject,
          backgroundColor: Colors.gray6,
          color: "white",
          padding: 16,
          borderRadius: 12,
          marginVertical: 8,
        }}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Pressable
        style={{
          backgroundColor: Colors.red,
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

export default DeleteAccountScreen;
