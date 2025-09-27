import * as Colors from "@bacons/apple-colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { iOSUIKit } from "react-native-typography";

function Icon({ title }) {
  let name = "";
  let color = "";
  if (title === "Coffee-Sized Tip") {
    name = "cafe";
    color = Colors.systemBrown;
  } else if (title === "Snack-Sized Tip") {
    name = "ice-cream";
    color = "lightgreen";
  } else if (title === "Pizza-Sized Tip") {
    name = "pizza";
    color = Colors.systemYellow;
  }
  return <Ionicons name={name} color={color} size={28} />;
}

type Props = {
  item: PurchasesPackage;
  isPurchasing: PurchasesPackage["identifier"] | null;
  setIsPurchasing: (identifier: PurchasesPackage["identifier"] | null) => void;
};

export const PurchaseOption = ({
  item: purchasePackage,
  isPurchasing,
  setIsPurchasing,
}: Props) => {
  const {
    product: { title, priceString, identifier },
  } = purchasePackage;

  async function handlePress() {
    setIsPurchasing(identifier);
    try {
      await Purchases.purchasePackage(purchasePackage);
    } catch (error) {
      if (!error.userCancelled) {
        Alert.alert("Error purchasing package", error.message);
      }
    } finally {
      setIsPurchasing(null);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 44,
      })}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Icon title={title} />
        <Text style={[iOSUIKit.body, { color: Colors.label, paddingLeft: 16 }]}>
          {title}
        </Text>
      </View>
      {isPurchasing === identifier ? (
        <ActivityIndicator />
      ) : (
        <Text style={[iOSUIKit.body, { color: Colors.label }]}>
          {priceString}
        </Text>
      )}
    </Pressable>
  );
};
