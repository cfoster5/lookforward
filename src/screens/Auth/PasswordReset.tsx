import auth from "@react-native-firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  PlatformColor,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

import { AuthStackParams } from "@/types";

type Props = NativeStackScreenProps<AuthStackParams, "Password Reset">;

function PasswordReset({ navigation }: Props) {
  const [email, setEmail] = useState("");

  async function signIn() {
    try {
      await auth().sendPasswordResetEmail(email);
      navigation.navigate("Sign In", { emailSent: true, email });
    } catch (error) {
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
              color: PlatformColor("systemGray"),
              marginBottom: 8,
            }}
          >
            We'll send a link to reset your password
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
            placeholder="Email"
            placeholderTextColor={PlatformColor("systemGray")}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="username"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Pressable
            style={{
              backgroundColor: PlatformColor("systemBlue"),
              width: "100%",
              marginTop: 8,
              paddingVertical: 16,
              borderRadius: 8,
              opacity: email ? 1 : 0.5,
            }}
            onPress={() => (email ? signIn() : null)}
          >
            <Text
              style={{
                ...iOSUIKit.bodyEmphasizedWhiteObject,
                textAlign: "center",
              }}
            >
              Continue
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

export default PasswordReset;
