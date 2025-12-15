import * as Colors from "@bacons/apple-colors";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { iOSUIKit } from "react-native-typography";

import { AppleSignInButton } from "@/components/AppleSignInButton";
import { IconSymbol } from "@/components/IconSymbol";
import { LargeFilledButton } from "@/components/LargeFilledButton";
import { reusableStyles } from "@/helpers/styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { email: emailParam } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (emailParam) setEmail(emailParam as string);
  }, [emailParam]);

  async function signIn() {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Signed In", "You have successfully signed in.");
      router.dismissAll();
      // console.log('User account created & signed in!');
    } catch (error) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === "auth/invalid-email") {
        Alert.alert("Invalid Email", "That email address is invalid!");
      }
      if (firebaseError.code === "auth/wrong-password") {
        Alert.alert(
          "Wrong Password",
          "That password is invalid or the user does not have a password!",
        );
      }
    }
  }

  return (
    <ScrollView style={{ marginHorizontal: 16 }}>
      {/* Wrapping with View fixes jump that Text elements experienced when keyboard is opening/dismissing */}
      <View>
        <Text
          style={[
            iOSUIKit.body,
            { color: Colors.secondaryLabel, marginBottom: 8 },
          ]}
        >
          {!emailParam
            ? "Sign in with an email to get your countdown items across devices."
            : "Check your email inbox and sign in after resetting your password."}
        </Text>
        <TextInput
          style={reusableStyles.textInput}
          placeholder="Email"
          placeholderTextColor={Colors.secondaryLabel}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="username"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={reusableStyles.textInput}
          placeholder="Password"
          placeholderTextColor={Colors.secondaryLabel}
          secureTextEntry
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {!emailParam && (
          <Pressable
            onPress={() => router.push("/(tabs)/(settings)/reset-password")}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <IconSymbol
                name="info.circle.fill"
                size={iOSUIKit.bodyObject.fontSize}
                color={Colors.systemBlue}
              />
              <Text
                style={[
                  iOSUIKit.body,
                  { color: Colors.systemBlue, marginVertical: 8 },
                ]}
              >
                Forgot your password?
              </Text>
            </View>
          </Pressable>
        )}
        <LargeFilledButton
          disabled={false}
          style={{ marginTop: !emailParam ? 16 : 16 }}
          handlePress={() => (email && password ? signIn() : null)}
          text="Continue"
        />
        <Text
          style={[
            iOSUIKit.footnote,
            {
              color: Colors.secondaryLabel,
              textAlign: "center",
              marginVertical: 16,
            },
          ]}
        >
          or
        </Text>
        <AppleSignInButton buttonType="sign-in" />
      </View>
    </ScrollView>
  );
}
