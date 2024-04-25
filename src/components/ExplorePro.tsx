import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import {
  PlatformColor,
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { LargeFilledButton } from "./LargeFilledButton";
import { SubscriptionOption } from "./SubscriptionOption";

import { DynamicHeightModal } from "@/components/DynamicHeightModal";
import { Row } from "@/components/Row";
import { useStore } from "@/stores/store";

type Props = { modalRef: any };

export const ExplorePro = ({ modalRef }: Props) => {
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const { setIsPro } = useStore();
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
      } catch (e) {}
    };

    getPackages();
  }, []);

  async function handlePurchase() {
    setIsPurchasing(true);
    // Using Offerings/Packages
    try {
      const { customerInfo } = await Purchases.purchasePackage(
        // selectedProduct!
        products?.lifetime!
      );
      if (typeof customerInfo.entitlements.active.pro !== "undefined") {
        // Unlock that great "pro" content
        setIsPro(true);
        Alert.alert(
          "Thank you!",
          "Thank you so much for your support. Please enjoy your Pro content."
        );
      }
    } catch (e) {
      if (!e.userCancelled) {
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
    } catch (e) {}
  }

  return (
    <DynamicHeightModal modalRef={modalRef}>
      <BottomSheetView
        style={{
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
              Unlock for {products?.lifetime?.product.priceString}
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
          <Text
            style={[
              iOSUIKit.bodyEmphasized,
              { color: PlatformColor("systemBlue") },
            ]}
          >
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
                "https://www.apple.com/legal/internet-services/itunes/dev/stdeula"
              )
            }
          >
            <Text
              style={[
                iOSUIKit.footnote,
                { color: PlatformColor("systemBlue") },
              ]}
            >
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
            <Text
              style={[
                iOSUIKit.footnote,
                { color: PlatformColor("systemBlue") },
              ]}
            >
              Privacy Policy
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </DynamicHeightModal>
  );
};
