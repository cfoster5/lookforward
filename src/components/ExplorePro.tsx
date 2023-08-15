import { useEffect, useState } from "react";
import {
  PlatformColor,
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { DynamicHeightModal } from "@/components/DynamicHeightModal";
import { Row } from "@/components/Row";
import { useStore } from "@/stores/store";

type Props = { modalRef: any };

export const ExplorePro = ({ modalRef }: Props) => {
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const { proModalRef } = useStore();
  const [isPurchasing, setIsPurchasing] = useState(false);

  async function handlePress() {
    setIsPurchasing(true);
    try {
      const { customerInfo, productIdentifier } =
        await Purchases.purchaseProduct("com.lookforward.pro");
      console.log("customerInfo", customerInfo);
      console.log("productIdentifier", productIdentifier);
      // if (
      //   typeof purchaserInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined"
      // ) {
      //   navigation.goBack();
      // }
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert("Error purchasing package", e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  }

  return (
    <DynamicHeightModal modalRef={modalRef}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 16,
          // paddingHorizontal: 32,
          // backgroundColor: PlatformColor("systemBackground"),
          paddingBottom: safeBottomArea,
          backgroundColor: PlatformColor("secondarySystemBackground"),
        }}
      >
        <Text
          style={[
            iOSUIKit.largeTitleEmphasized,
            {
              color: PlatformColor("label"),
              textAlign: "center",
              paddingBottom: 16,
            },
          ]}
        >
          Pro Features
        </Text>
        <Row
          icon="star"
          title="Movie Ratings"
          body="Find ratings from IMDb, Rotten Tomatoes, and Metacritic."
          useAltIcon
        />
        <Row
          icon="ticket"
          title="Box Office"
          body="See your recent searches for titles and people"
          useAltIcon
        />
        <Row
          icon="clock.arrow.circlepath"
          title="Search History"
          body="See your recent searches for titles and people"
          useAltIcon
        />
        <Pressable
          style={{
            backgroundColor: PlatformColor("systemBlue"),
            minHeight: 44,
            minWidth: 44,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 16,
          }}
          onPress={() => {
            // proModalRef.current?.dismiss();
            handlePress();
          }}
        >
          {isPurchasing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={[iOSUIKit.bodyEmphasized, { color: "white" }]}>
              Unlock for $0.99
            </Text>
          )}
        </Pressable>
      </View>
    </DynamicHeightModal>
  );
};