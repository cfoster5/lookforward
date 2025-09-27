import * as Colors from "@bacons/apple-colors";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
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
      borderColor: Colors.separator,
    }}
  />
);

export const TipModal = ({ modalRef }: Props) => {
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const [isPurchasing, setIsPurchasing] = useState<
    PurchasesPackage["identifier"] | null
  >(null);

  const { data: packages } = useQuery({
    queryKey: ["purchasePackages"],
    queryFn: async () => await Purchases.getOfferings(),
    select: (data) => data.current?.availablePackages,
  });

  return (
    <DynamicHeightModal modalRef={modalRef}>
      <BottomSheetFlatList
        data={packages?.sort(({ product: a, product: b }) => a.price - b.price)}
        ListHeaderComponent={
          <Text
            style={[iOSUIKit.body, { color: Colors.label, paddingBottom: 32 }]}
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
