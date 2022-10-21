import { IoniconsHeaderButton } from "components/IoniconsHeaderButton";
import React from "react";
import { PlatformColor, StyleProp, TextStyle, ViewStyle } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

type Props = {
  text: string;
  handlePress: any;
  style?: StyleProp<TextStyle | ViewStyle>;
};

export const MyHeaderRight = ({ text, handlePress, style }: Props) => (
  <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
    <Item
      title={text}
      buttonStyle={[style, { color: PlatformColor("systemBlue") }]}
      onPress={handlePress}
    />
  </HeaderButtons>
);
