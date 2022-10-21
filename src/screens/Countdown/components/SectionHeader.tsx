import React from "react";
import { PlatformColor, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

export const SectionHeader = ({ section }) => (
  <View style={{ backgroundColor: PlatformColor("systemGray6") }}>
    <Text
      style={[
        iOSUIKit.title3EmphasizedWhite,
        { marginLeft: 16, marginVertical: 8 },
      ]}
    >
      {section.title}
    </Text>
  </View>
);
