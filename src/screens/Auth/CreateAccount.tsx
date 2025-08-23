import {
  createUserWithEmailAndPassword,
  getAuth,
  signInAnonymously,
} from "@react-native-firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
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

import { LargeFilledButton } from "@/components/LargeFilledButton";
import { AuthStackParams } from "@/types";

type Props = NativeStackScreenProps<AuthStackParams, "Create Account">;

function CreateAccount({ navigation, route }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function createAccount() {
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Email Already in Use",
          "That email address is already in use!",
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
      const auth = getAuth();
      await signInAnonymously(auth);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", marginHorizontal: 16 }}
        behavior="padding"
      >
        <View>
          <Text
            style={[
              iOSUIKit.largeTitleEmphasized,
              { color: PlatformColor("label") },
            ]}
          >
            Hello!
          </Text>
          <Text
            style={[
              iOSUIKit.body,
              {
                color: PlatformColor("secondaryLabel"),
                marginBottom: 8,
              },
            ]}
          >
            Create an account for the best experience
          </Text>
          <TextInput
            style={[
              iOSUIKit.body,
              {
                backgroundColor: PlatformColor("systemGray6"),
                color: PlatformColor("label"),
                padding: 16,
                borderRadius: 12,
                marginVertical: 8,
              },
            ]}
            placeholder="Email"
            placeholderTextColor={PlatformColor("secondaryLabel")}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="username"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={[
              iOSUIKit.body,
              {
                backgroundColor: PlatformColor("systemGray6"),
                color: PlatformColor("label"),
                padding: 16,
                borderRadius: 12,
                marginVertical: 8,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={PlatformColor("secondaryLabel")}
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
                color: PlatformColor("secondaryLabel"),
                marginVertical: 8,
              }}
            >
              Skip?
            </Text>
          </Pressable>
          <LargeFilledButton
            disabled={!email || !password}
            style={{ marginTop: 16 }}
            handlePress={() => (email && password ? createAccount() : null)}
            text="Continue"
          />
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

export default CreateAccount;
