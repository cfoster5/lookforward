import React from "react";
import { BlurView } from "@react-native-community/blur";
import { Header, StackHeaderProps } from "@react-navigation/stack";
import { Platform } from "react-native";

export function BlurHeader(props: StackHeaderProps) {
  return (
    Platform.OS === "ios"
      ?
      <BlurView
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0
        }}
      >
        <Header {...props} />
      </BlurView>
      :
      <Header {...props} />
  )
}