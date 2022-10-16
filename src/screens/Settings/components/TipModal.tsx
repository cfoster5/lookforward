import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import TabStackContext from "contexts/TabStackContext";
import { connectAsync, IAPItemDetails } from "expo-in-app-purchases";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  PlatformColor,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { iOSUIKit } from "react-native-typography";

import { useGetPurchaseOptions } from "../hooks/useGetPurchaseOptions";
import { PurchaseOption } from "./PurchaseOption";

type Props = { modalizeRef: any };

export const TipModal = ({ modalizeRef }: Props) => {
  const tabBarheight = useBottomTabBarHeight();
  const { theme } = useContext(TabStackContext);
  const [connected, setConnected] = useState(false);
  const { purchaseOptions, loadingOptions } = useGetPurchaseOptions(connected);

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
    <Modalize
      ref={modalizeRef}
      flatListProps={{
        data: purchaseOptions,
        ListHeaderComponent: (
          <Text
            style={[
              { paddingBottom: 32 },
              theme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body,
            ]}
          >
            If you're feeling generous and would like to support LookForward's
            development further, any tip helps!
          </Text>
        ),
        renderItem: PurchaseOption,
        ItemSeparatorComponent: () => (
          <View
            style={{
              marginVertical: 16,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: PlatformColor("separator"),
            }}
          />
        ),
        keyExtractor: (item: IAPItemDetails) => item.productId,
        ListEmptyComponent: <ActivityIndicator />,
        showsVerticalScrollIndicator: false,
      }}
      adjustToContentHeight
      childrenStyle={{
        marginBottom: Platform.OS === "ios" ? tabBarheight + 16 : 16,
      }}
      modalStyle={{
        backgroundColor: PlatformColor("systemGray6"),
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
    />
  );
};
