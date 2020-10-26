import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { iOSColors, iOSUIKit } from 'react-native-typography';

function Welcome() {
  return (
    <View style={{ flex: 1, justifyContent: "center", marginHorizontal: 16 }}>
      <Text style={iOSUIKit.title3EmphasizedWhite}>Create an account to add items to your countdown list.</Text>
      <Pressable style={{ backgroundColor: iOSColors.blue, width: "100%", marginVertical: 16, paddingVertical: 16, borderRadius: 8 }} onPress={() => navigation.navigate("Create Account")}>
        <Text style={{ ...iOSUIKit.bodyEmphasizedWhiteObject, textAlign: "center" }}>Create Account</Text>
      </Pressable>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ ...iOSUIKit.bodyObject, color: iOSColors.gray, alignSelf: "center" }}>Already have an account?</Text>
        <Pressable style={{ marginHorizontal: 8 }} onPress={() => navigation.navigate("Sign In", { emailSent: false })}>
          <Text style={{ ...iOSUIKit.bodyObject, color: iOSColors.blue }}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Welcome;
