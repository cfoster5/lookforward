import { getAuth, sendPasswordResetEmail } from "@react-native-firebase/auth";
import { Color, router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { LargeFilledButton } from "@/components/LargeFilledButton";
import { reusableStyles } from "@/helpers/styles";

export default function PasswordReset() {
  const [email, setEmail] = useState("");

  async function signIn() {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      router.dismissTo({
        pathname: "/(tabs)/(settings)/login",
        params: { email },
      });
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
    <ScrollView style={{ marginHorizontal: 16 }}>
      <Text
        style={[
          iOSUIKit.body,
          { color: Color.ios.secondaryLabel, marginBottom: 8 },
        ]}
      >
        {`Enter your email. We'll send a link to reset your password.`}
      </Text>
      <TextInput
        style={reusableStyles.textInput}
        placeholder="Email"
        placeholderTextColor={Color.ios.systemGray}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="username"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <LargeFilledButton
        disabled={false}
        style={{ marginTop: 16 }}
        handlePress={() => (email ? signIn() : null)}
        text="Continue"
      />
    </ScrollView>
  );
}
