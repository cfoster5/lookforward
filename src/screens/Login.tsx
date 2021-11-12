import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

function Login({ route }: any) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (route.params.email) {
      setEmail(route.params.email);
    }
  }, [route.params.email]);

  async function signIn() {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // console.log('User account created & signed in!');
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid Email", "That email address is invalid!");
      }
      if (error.code === "auth/wrong-password") {
        Alert.alert(
          "Wrong Password",
          "That password is invalid or the user does not have a password!"
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
          <Text style={{ ...iOSUIKit.largeTitleEmphasizedWhiteObject }}>
            {route.params.emailSent
              ? "Check your email inbox"
              : "Welcome back!"}
          </Text>
          <Text
            style={{
              ...iOSUIKit.bodyObject,
              color: iOSColors.gray,
              marginBottom: 8,
            }}
          >
            {route.params.emailSent
              ? "Sign in after resetting your password"
              : "Sign in to your account"}
          </Text>
          <TextInput
            style={{
              ...iOSUIKit.bodyObject,
              backgroundColor: "#3a3a3c",
              color: "white",
              padding: 16,
              borderRadius: 8,
              marginVertical: 8,
            }}
            placeholder="Email"
            placeholderTextColor="#6e6f73"
            autoCapitalize="none"
            keyboardType={"email-address"}
            textContentType={"username"}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={{
              ...iOSUIKit.bodyObject,
              backgroundColor: "#3a3a3c",
              color: "white",
              padding: 16,
              borderRadius: 8,
              marginVertical: 8,
            }}
            placeholder="Password"
            placeholderTextColor="#6e6f73"
            secureTextEntry={true}
            textContentType={"password"}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          {!route.params.emailSent && (
            <Pressable
              style={{ alignItems: "flex-end" }}
              onPress={() => navigation.navigate("Password Reset")}
            >
              <Text
                style={{
                  ...iOSUIKit.bodyObject,
                  color: iOSColors.gray,
                  marginVertical: 8,
                }}
              >
                Forgot password?
              </Text>
            </Pressable>
          )}
          <Pressable
            style={{
              backgroundColor: iOSColors.blue,
              width: "100%",
              marginTop: route.params.emailSent ? 16 : 8,
              paddingVertical: 16,
              borderRadius: 8,
              opacity: email && password ? 1 : 0.5,
            }}
            onPress={() => (email && password ? signIn() : null)}
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

export default Login;
