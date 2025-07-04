import { getAuth } from "@react-native-firebase/auth";
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

type Props = NativeStackScreenProps<AuthStackParams, "Sign In">;

function Login({ navigation, route }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    try {
      await getAuth().signInWithEmailAndPassword(email, password);
      // console.log('User account created & signed in!');
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid Email", "That email address is invalid!");
      }
      if (error.code === "auth/wrong-password") {
        Alert.alert(
          "Wrong Password",
          "That password is invalid or the user does not have a password!",
        );
      }
    }
  }

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", marginHorizontal: 16 }}
        behavior="padding"
      >
        {/* Wrapping with View fixes jump that Text elements experienced when keyboard is opening/dismissing */}
        <View>
          <Text
            style={[
              iOSUIKit.largeTitleEmphasized,
              { color: PlatformColor("label") },
            ]}
          >
            {route.params.email ? "Check your email inbox" : "Welcome back!"}
          </Text>
          <Text
            style={[
              iOSUIKit.body,
              { color: PlatformColor("secondaryLabel"), marginBottom: 8 },
            ]}
          >
            {route.params.email
              ? "Sign in after resetting your password"
              : "Sign in to your account"}
          </Text>
          <TextInput
            style={{
              ...iOSUIKit.bodyObject,
              backgroundColor: PlatformColor("systemGray6"),
              color: "white",
              padding: 16,
              borderRadius: 12,
              marginVertical: 8,
            }}
            placeholder="Email"
            placeholderTextColor={PlatformColor("secondaryLabel")}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="username"
            value={route.params?.email ?? email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={{
              ...iOSUIKit.bodyObject,
              backgroundColor: PlatformColor("systemGray6"),
              color: "white",
              padding: 16,
              borderRadius: 12,
              marginVertical: 8,
            }}
            placeholder="Password"
            placeholderTextColor={PlatformColor("secondaryLabel")}
            secureTextEntry
            textContentType="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          {!route.params.email && (
            <Pressable
              style={{ alignItems: "flex-end" }}
              onPress={() => navigation.navigate("Password Reset")}
            >
              <Text
                style={[
                  iOSUIKit.body,
                  {
                    color: PlatformColor("secondaryLabel"),
                    marginVertical: 8,
                  },
                ]}
              >
                Forgot password?
              </Text>
            </Pressable>
          )}
          <LargeFilledButton
            disabled={!email || !password}
            style={{ marginTop: route.params.email ? 16 : 8 }}
            handlePress={() => (email && password ? signIn() : null)}
            text="Continue"
          />
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

export default Login;
