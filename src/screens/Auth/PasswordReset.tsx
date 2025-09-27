import * as Colors from "@bacons/apple-colors";
import { getAuth, sendPasswordResetEmail } from "@react-native-firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { iOSUIKit } from "react-native-typography";

import { LargeFilledButton } from "@/components/LargeFilledButton";
import { AuthStackParams } from "@/types";

type Props = NativeStackScreenProps<AuthStackParams, "Password Reset">;

function PasswordReset({ navigation }: Props) {
  const [email, setEmail] = useState("");

  async function signIn() {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      navigation.navigate("Sign In", { emailSent: true, email });
    } catch (error: any) {
      if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid Email", "That email address is invalid!");
      }
      if (error.code === "auth/user-not-found") {
        Alert.alert("User Not Found", "That user does not exist!");
      }
      console.log(error);
    }
  }

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", marginHorizontal: 16 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View>
          <Text style={{ ...iOSUIKit.largeTitleEmphasizedWhiteObject }}>
            Enter your email
          </Text>
          <Text
            style={{
              ...iOSUIKit.bodyObject,
              color: Colors.systemGray,
              marginBottom: 8,
            }}
          >
            {`We'll send a link to reset your password`}
          </Text>
          <TextInput
            style={{
              ...iOSUIKit.bodyObject,
              backgroundColor: Colors.systemGray6,
              color: "white",
              padding: 16,
              borderRadius: 12,
              marginVertical: 8,
            }}
            placeholder="Email"
            placeholderTextColor={Colors.systemGray}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="username"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <LargeFilledButton
            disabled={!email}
            style={{ marginTop: 8 }}
            handlePress={() => (email ? signIn() : null)}
            text="Continue"
          />
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

export default PasswordReset;
