import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  PlatformColor,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { DynamicHeightModal } from "@/components/DynamicHeightModal";

import { PurchaseOption } from "./PurchaseOption";

type Props = { modalRef: any };

const ItemSeparator = () => (
  <View
    style={{
      marginVertical: 4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: PlatformColor("separator"),
    }}
  />
);

export const TipModal = ({ modalRef }: Props) => {
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isPurchasing, setIsPurchasing] = useState<
    PurchasesPackage["identifier"] | null
  >(null);

  useEffect(() => {
    // Get current available packages
    const getPackages = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (error) {
        Alert.alert("Error getting offers", error.message);
      }
    };

    getPackages();
  }, []);

  return (
    <DynamicHeightModal modalRef={modalRef}>
      <BottomSheetFlatList
        data={packages?.sort(({ product: a, product: b }) => a.price - b.price)}
        ListHeaderComponent={
          <Text
            style={[
              iOSUIKit.body,
              { color: PlatformColor("label"), paddingBottom: 32 },
            ]}
          >
            {`If you're feeling generous and would like to support LookForward's development further, any tip helps!`}
          </Text>
        }
        renderItem={({ item }) => (
          <PurchaseOption
            item={item}
            isPurchasing={isPurchasing}
            setIsPurchasing={setIsPurchasing}
          />
        )}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(item) => item.identifier}
        ListEmptyComponent={ActivityIndicator}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{
          paddingBottom: safeBottomArea,
          paddingHorizontal: 16,
        }}
      />
    </DynamicHeightModal>
  );
};
