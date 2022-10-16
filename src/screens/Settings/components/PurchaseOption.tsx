import { IAPItemDetails, purchaseItemAsync } from "expo-in-app-purchases";
import { reusableStyles } from "helpers/styles";
import React from "react";
import { PlatformColor, Pressable, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";

function Icon({ details }: { details: IAPItemDetails }) {
  let name = "";
  let color = "";
  if (details.title === "Coffee-Sized Tip") {
    name = "cafe";
    color = PlatformColor("systemBrown");
  } else if (details.title === "Snack-Sized Tip") {
    name = "ice-cream";
    color = "lightgreen";
  } else if (details.title === "Pizza-Sized Tip") {
    name = "pizza";
    color = PlatformColor("systemYellow");
  }
  return <Ionicons name={name} color={color} size={28} />;
}

type Props = { item: IAPItemDetails };

export const PurchaseOption = ({ item }: Props) => (
  <Pressable
    onPress={() => purchaseItemAsync(item.productId)}
    style={({ pressed }) => ({
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    })}
  >
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <Icon details={item} />
      <Text
        style={
          // theme === "dark"
          //   ? {
          //       ...iOSUIKit.bodyWhiteObject,
          //     }
          //   : iOSUIKit.body
          [iOSUIKit.bodyWhite, { paddingLeft: 16 }]
        }
      >
        {item.title}
      </Text>
    </View>
    <Text style={reusableStyles.date}>{item.price}</Text>
  </Pressable>
);
