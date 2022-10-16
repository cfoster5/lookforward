import auth from "@react-native-firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  PlatformColor,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { iOSUIKit } from "react-native-typography";

import { AuthStackParams } from "@/types";

type Props = NativeStackScreenProps<AuthStackParams, "Create Account">;

function CreateAccount({ navigation, route }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function createAccount() {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      console.log("User account created & signed in!");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Email Already in Use",
          "That email address is already in use!"
        );
      }
      if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid Email", "That email address is invalid!");
      }
      if (error.code === "auth/weak-password") {
        Alert.alert("Weak Password", "That password is invalid!");
      }
    }
  }

  async function skipAccountCreation() {
    try {
      await auth().signInAnonymously();
    } catch (error) {}
  }

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", marginHorizontal: 16 }}
        behavior="padding"
      >
        <View>
          <Text style={{ ...iOSUIKit.largeTitleEmphasizedWhiteObject }}>
            Hello!
          </Text>
          <Text
            style={{
              ...iOSUIKit.bodyObject,
              color: PlatformColor("systemGray"),
              marginBottom: 8,
            }}
          >
            Create an account for the best experience
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
          <TextInput
            style={{
              ...iOSUIKit.bodyObject,
              backgroundColor: PlatformColor("systemGray6"),
              color: "white",
              padding: 16,
              borderRadius: 8,
              marginVertical: 8,
            }}
            placeholder="Password"
            placeholderTextColor={PlatformColor("systemGray")}
            secureTextEntry
            textContentType="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Pressable
            style={{ alignItems: "flex-end" }}
            onPress={() => skipAccountCreation()}
          >
            <Text
              style={{
                ...iOSUIKit.bodyObject,
                color: PlatformColor("systemGray"),
                marginVertical: 8,
              }}
            >
              Skip?
            </Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: PlatformColor("systemBlue"),
              width: "100%",
              marginTop: 16,
              paddingVertical: 16,
              borderRadius: 8,
              opacity: email && password ? 1 : 0.5,
            }}
            onPress={() => (email && password ? createAccount() : null)}
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

export default CreateAccount;
