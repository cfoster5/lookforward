import * as Colors from "@bacons/apple-colors";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
} from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { iOSUIKit } from "react-native-typography";

import { LargeFilledButton } from "@/components/LargeFilledButton";
import { reusableStyles } from "@/helpers/styles";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function createAccount() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // If user is anonymous, convert to permanent account
      if (user?.isAnonymous) {
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(user, credential);
      } else {
        // Otherwise, create a new account
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Account Created", "Your account has been created.");
        router.dismissAll();
      }
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
      if (error.code === "auth/credential-already-in-use") {
        Alert.alert(
          "Email Already in Use",
          "That email address is already in use!",
        );
      }
    }
  }

  return (
    <ScrollView style={{ marginHorizontal: 16 }}>
      <View>
        <Text
          style={[
            iOSUIKit.body,
            { color: Colors.secondaryLabel, marginBottom: 8 },
          ]}
        >
          {`Create an account with an email to get your countdown items across devices.`}
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
        <LargeFilledButton
          disabled={false}
          style={{ marginTop: 16 }}
          handlePress={() => (email && password ? createAccount() : null)}
          text="Continue"
        />
      </View>
    </ScrollView>
  );
}
