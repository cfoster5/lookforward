import * as Colors from "@bacons/apple-colors";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { DynamicHeightModal } from "@/components/DynamicHeightModal";
import { Row } from "@/components/Row";
import { useAuthStore, useInterfaceStore } from "@/stores";
import { tryCatch } from "@/utils/try-catch";

import { LargeFilledButton } from "./LargeFilledButton";
import { SubscriptionOption } from "./SubscriptionOption";

type FooterButtonProps = {
  url: string;
  text: string;
};

const FooterButton = ({ url, text }: FooterButtonProps) => (
  <Pressable
    style={{
      minHeight: 28,
      minWidth: 28,
      alignItems: "center",
      justifyContent: "center",
    }}
    onPress={() => Linking.openURL(url)}
  >
    <Text style={[iOSUIKit.footnote, { color: Colors.systemBlue }]}>
      {text}
    </Text>
  </Pressable>
);

export const ExplorePro = () => {
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const { setIsPro } = useAuthStore();
  const { proModalRef } = useInterfaceStore();
  const [selectedProduct, setSelectedProduct] = useState<PurchasesPackage>();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { data: purchaseOfferings } = useQuery({
    queryKey: ["purcaseOfferings"],
    queryFn: async () => await Purchases.getOfferings(),
  });

  useEffect(() => {
    if (purchaseOfferings && purchaseOfferings.all["pro"].annual) {
      setSelectedProduct(purchaseOfferings.all["pro"].annual);
    }
  }, [purchaseOfferings]);

  async function handlePurchase() {
    if (!selectedProduct) return;
    setIsPurchasing(true);
    const { data, error } = await tryCatch(
      Purchases.purchasePackage(selectedProduct),
    );

    if (error) {
      setIsPurchasing(false);
      if (!error.userCancelled) {
        // Only show alert if not cancelled by user
        Alert.alert(error.message);
      }
      return;
    }

    const { customerInfo } = data;
    if (typeof customerInfo.entitlements.active["pro"] !== "undefined") {
      setIsPro(true);
      Alert.alert(
        "Thank you!",
        "Thank you so much for your support. Please enjoy your Pro content.",
      );
    }
    setIsPurchasing(false); // Add here at the end
  }

  async function handleRestorePurchase() {
    const { data: customerInfo, error } = await tryCatch(
      Purchases.restorePurchases(),
    );
    if (error) {
      Alert.alert("Error restoring purchases", error.message);
      return;
    }
    if (customerInfo.entitlements.active["pro"]) {
      setIsPro(true);
      Alert.alert("Purchase restored");
    }
  }

  return (
    <DynamicHeightModal modalRef={proModalRef}>
      <BottomSheetView
        style={{
          justifyContent: "center",
          paddingHorizontal: 16,
          // paddingHorizontal: 32,
          // backgroundColor: Colors.systemBackground,
          paddingBottom: safeBottomArea,
          backgroundColor: Colors.secondarySystemBackground,
        }}
      >
        <Text
          style={[
            iOSUIKit.largeTitleEmphasized,
            {
              color: Colors.label,
              textAlign: "center",
              paddingBottom: 16,
            },
          ]}
        >
          LookForward Pro
        </Text>
        <Row
          icon="list.dash"
          title="Unlimited Countdown Items"
          body="Don't stop at 5. Add every title you're excited for."
          useAltIcon
        />
        <Row
          icon="clock.arrow.circlepath"
          title="Search History"
          body="See your recent searches for titles and people."
          useAltIcon
        />
        <Row
          icon="star"
          title="Movie Ratings"
          body="Find ratings from IMDb, Rotten Tomatoes, and Metacritic."
          useAltIcon
        />
        <Row
          icon="ticket"
          title="Box Office"
          body="View ticket sales at the theaters."
          useAltIcon
        />
        {purchaseOfferings?.all["pro"]?.monthly && (
          <SubscriptionOption
            handlePress={() => {
              if (purchaseOfferings.all["pro"].monthly) {
                setSelectedProduct(purchaseOfferings.all["pro"].monthly);
              }
            }}
            text={`${purchaseOfferings.all["pro"].monthly.product.priceString} Monthly`}
            isSelected={
              purchaseOfferings.all["pro"].monthly.identifier ===
              selectedProduct?.identifier
            }
            style={{ marginTop: 16, marginBottom: 8 }}
          />
        )}
        {purchaseOfferings?.all["pro"]?.annual && (
          <SubscriptionOption
            handlePress={() => {
              if (purchaseOfferings.all["pro"].annual) {
                setSelectedProduct(purchaseOfferings.all["pro"].annual);
              }
            }}
            text={`${purchaseOfferings.all["pro"].annual.product.priceString} Yearly`}
            isSelected={
              purchaseOfferings.all["pro"].annual.identifier ===
              selectedProduct?.identifier
            }
            style={{ marginTop: 8, marginBottom: 16 }}
          />
        )}
        {selectedProduct && (
          <LargeFilledButton
            disabled={false}
            style={{ marginVertical: 16 }}
            handlePress={() => handlePurchase()}
          >
            {isPurchasing ? (
              <ActivityIndicator
                color="white"
                // Match size to below text's lineHeight so pressable height isn't changed
                size={iOSUIKit.bodyEmphasizedObject.lineHeight}
              />
            ) : (
              <Text
                style={[
                  iOSUIKit.bodyEmphasized,
                  { color: "white", textAlign: "center" },
                ]}
              >
                Unlock for {selectedProduct.product.priceString}
              </Text>
            )}
          </LargeFilledButton>
        )}
        <Pressable
          style={{
            minHeight: 44,
            minWidth: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleRestorePurchase}
        >
          <Text style={[iOSUIKit.bodyEmphasized, { color: Colors.systemBlue }]}>
            Restore Purchase
          </Text>
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 16,
          }}
        >
          <FooterButton
            url="https://www.apple.com/legal/internet-services/itunes/dev/stdeula"
            text="Terms of Service"
          />
          <FooterButton
            url="https://getlookforward.app/privacy"
            text="Privacy Policy"
          />
        </View>
      </BottomSheetView>
    </DynamicHeightModal>
  );
};
