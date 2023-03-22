import { DynamicHeightModal } from "components/DynamicHeightModal";
import TabStackContext from "contexts/TabStackContext";
import { connectAsync, IAPItemDetails } from "expo-in-app-purchases";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  PlatformColor,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { PurchaseOption } from "./PurchaseOption";
import { useGetPurchaseOptions } from "../hooks/useGetPurchaseOptions";

type Props = { modalRef: any };

export const TipModal = ({ modalRef }: Props) => {
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const { theme } = useContext(TabStackContext);
  const [connected, setConnected] = useState(false);
  const { purchaseOptions } = useGetPurchaseOptions(connected);

  useEffect(() => {
    async function connect() {
      if (Platform.OS === "ios") {
        try {
          await connectAsync();
          setConnected(true);
        } catch {
          console.log(`connection error`);
        }
      }
    }
    connect();
  }, []);

  return (
    <DynamicHeightModal modalRef={modalRef}>
      <FlatList
        data={purchaseOptions?.sort(
          ({ priceAmountMicros: a, priceAmountMicros: b }) => a - b
        )}
        ListHeaderComponent={
          <Text
            style={[
              { paddingBottom: 32 },
              theme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body,
            ]}
          >
            If you're feeling generous and would like to support LookForward's
            development further, any tip helps!
          </Text>
        }
        renderItem={PurchaseOption}
        ItemSeparatorComponent={() => (
          <View
            style={{
              marginVertical: 4,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: PlatformColor("separator"),
            }}
          />
        )}
        keyExtractor={(item: IAPItemDetails) => item.productId}
        ListEmptyComponent={ActivityIndicator}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        style={{ paddingBottom: safeBottomArea, paddingHorizontal: 16 }}
      />
    </DynamicHeightModal>
  );
};
