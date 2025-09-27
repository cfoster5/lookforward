import * as Colors from "@bacons/apple-colors";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import Purchases, { PurchasesOffering } from "react-native-purchases";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { DynamicHeightModal } from "@/components/DynamicHeightModal";
import { Row } from "@/components/Row";
import { useAuthStore, useInterfaceStore } from "@/stores";

import { LargeFilledButton } from "./LargeFilledButton";

export const ExplorePro = () => {
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const { setIsPro } = useAuthStore();
  const { proModalRef } = useInterfaceStore();
  const [products, setProducts] = useState<PurchasesOffering>();
  // const [selectedProduct, setSelectedProduct] = useState<PurchasesPackage>();
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    // Get current available packages
    const getPackages = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (
          offerings.all["pro"] !== null &&
          offerings.all["pro"].availablePackages.length !== 0
        ) {
          // console.log('offerings.all["pro"]', offerings.all["pro"]);
          setProducts(offerings.all["pro"]);
          // setSelectedProduct(offerings.all["pro"]?.annual!);
          // Display packages for sale
        }
      } catch (error) {
        console.error(error);
      }
    };

    getPackages();
  }, []);

  async function handlePurchase() {
    setIsPurchasing(true);
    // Using Offerings/Packages
    try {
      if (!products?.lifetime) {
        console.error("No lifetime package available");
        return;
      }
      const { customerInfo } = await Purchases.purchasePackage(
        // selectedProduct!
        products.lifetime,
      );
      if (typeof customerInfo.entitlements.active.pro !== "undefined") {
        // Unlock that great "pro" content
        setIsPro(true);
        Alert.alert(
          "Thank you!",
          "Thank you so much for your support. Please enjoy your Pro content.",
        );
      }
    } catch (error) {
      if (!error.userCancelled) {
        Alert.alert("Error purchasing package", e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  }

  async function handleRestorePurchase() {
    try {
      const restore = await Purchases.restorePurchases();
      // ... check restored purchaserInfo to see if entitlement is now active
      if (restore.entitlements.active.pro) {
        setIsPro(true);
        Alert.alert("Purchase restored");
      }
    } catch (error) {
      console.error(error);
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
          Pro Features
        </Text>
        <Text
          style={[
            iOSUIKit.title3Emphasized,
            { color: Colors.systemBlue, textAlign: "center" },
          ]}
        >
          {products?.lifetime?.product.priceString}
        </Text>
        <Text
          style={[
            iOSUIKit.title3,
            {
              color: Colors.label,
              textAlign: "center",
              paddingBottom: 16,
            },
          ]}
        >
          Unlock once. Enjoy forever.
        </Text>
        <Row
          icon="megaphone"
          title="No Ads"
          body="Enjoy an ad-free experience."
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
        <Row
          icon="clock.arrow.circlepath"
          title="Search History"
          body="See your recent searches for titles and people."
          useAltIcon
        />
        {/* <SubscriptionOption
          handlePress={() => setSelectedProduct(products?.monthly!)}
          text={`${products?.monthly?.product.priceString} Monthly`}
          isSelected={
            products?.monthly?.identifier === selectedProduct?.identifier
          }
          style={{ marginTop: 16, marginBottom: 8 }}
        />
        <SubscriptionOption
          handlePress={() => setSelectedProduct(products?.annual!)}
          text={`${products?.annual?.product.priceString} Yearly`}
          isSelected={
            products?.annual?.identifier === selectedProduct?.identifier
          }
          style={{ marginTop: 8, marginBottom: 16 }}
        /> */}
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
              Unlock forever for {products?.lifetime?.product.priceString}
              {/* Unlock for {selectedProduct?.product.priceString} */}
            </Text>
          )}
        </LargeFilledButton>
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
          <Pressable
            style={{
              minHeight: 28,
              minWidth: 28,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              Linking.openURL(
                "https://www.apple.com/legal/internet-services/itunes/dev/stdeula",
              )
            }
          >
            <Text style={[iOSUIKit.footnote, { color: Colors.systemBlue }]}>
              Terms of Service
            </Text>
          </Pressable>
          <Pressable
            style={{
              minHeight: 28,
              minWidth: 28,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              Linking.openURL("https://getlookforward.app/privacy")
            }
          >
            <Text style={[iOSUIKit.footnote, { color: Colors.systemBlue }]}>
              Privacy Policy
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </DynamicHeightModal>
  );
};
