import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LoadingScreen } from "components/LoadingScreen";
import TabStackContext from "contexts/TabStackContext";
import {
  connectAsync,
  IAPItemDetails,
  purchaseItemAsync,
} from "expo-in-app-purchases";
import { reusableStyles } from "helpers/styles";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { iOSColors, iOSUIKit } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useFirstRender } from "./hooks/useFirstRender";
import { useGetPurchaseOptions } from "./hooks/useGetPurchaseOptions";

import { useStore } from "@/stores/store";

function Settings({ navigation }) {
  const { user } = useStore();
  const [hasPermissions, setHasPermissions] = useState(true);

  const [notifications, setNotifications] = useState({
    dayNotifications: false,
    weekNotifications: false,
  });

  const modalizeRef = useRef<Modalize>(null);
  const tabBarheight = useBottomTabBarHeight();
  const { theme } = useContext(TabStackContext);
  const [connected, setConnected] = useState(false);
  const { purchaseOptions, loadingOptions } = useGetPurchaseOptions(connected);
  const firstRender = useFirstRender();

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

  useEffect(() => {
    if (user) {
      getNotificationPermissions();
      const preferenceSubscription = firestore()
        .collection("users")
        .doc(user!.uid)
        .collection("contentPreferences")
        .doc("preferences")
        .onSnapshot(
          (querySnapshot) => {
            const preferences = querySnapshot.data();
            setNotifications({
              dayNotifications: !!preferences?.dayNotifications,
              weekNotifications: !!preferences?.weekNotifications,
            });
          },
          (error) => console.log(error)
        );

      // Stop listening for updates when no longer required
      return () => preferenceSubscription();
    }
  }, [user]);

  useEffect(() => {
    if (!firstRender) {
      console.log("notifications update", notifications);
      getNotificationPermissions();
      firestore()
        .collection("users")
        .doc(user!.uid)
        .collection("contentPreferences")
        .doc("preferences")
        .set(notifications, { merge: true });
    }
  }, [notifications]);

  function signOut() {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  }

  async function getNotificationPermissions() {
    const res = await messaging().hasPermission();
    if (!res) {
      setHasPermissions(false);
    } else {
      setHasPermissions(true);
    }
  }

  function NotificationSetting({
    title,
    onValueChange,
    value,
    style,
  }: {
    title: string;
    onValueChange: (value: boolean) => void;
    value: boolean;
    style?: ViewStyle;
  }) {
    return (
      <View style={styles.itemContainer}>
        <View style={[styles.item, style]}>
          <Text style={{ ...iOSUIKit.bodyWhiteObject }}>{title}</Text>
          <Switch
            trackColor={{ false: "red", true: iOSColors.blue }}
            style={{ marginRight: 16 }}
            onValueChange={onValueChange}
            value={value}
          />
        </View>
      </View>
    );
  }

  function Icon({ details }: { details: IAPItemDetails }) {
    let name = "";
    let color = "";
    if (details.title === "Coffee-Sized Tip") {
      name = "cafe";
      color = "brown";
    } else if (details.title === "Snack-Sized Tip") {
      name = "ice-cream";
      color = "lightgreen";
    } else if (details.title === "Pizza-Sized Tip") {
      name = "pizza";
      color = iOSColors.yellow;
    }
    return <Ionicons name={name} color={color} size={28} />;
  }

  function TipModal() {
    return (
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        childrenStyle={{
          marginBottom: Platform.OS === "ios" ? tabBarheight + 16 : 16,
        }}
        modalStyle={theme === "dark" ? { backgroundColor: "#121212" } : {}}
        onClosed={() => null}
      >
        <Text
          style={
            theme === "dark"
              ? {
                  ...iOSUIKit.bodyWhiteObject,
                  marginHorizontal: 16,
                  marginVertical: 16,
                }
              : iOSUIKit.body
          }
        >
          If you're feeling generous and would like to support LookForward's
          development further, any tip helps!
        </Text>
        {!loadingOptions ? (
          purchaseOptions?.map((details, i) => {
            return (
              <Pressable
                key={i}
                onPress={() => purchaseItemAsync(details.productId)}
                style={{
                  marginHorizontal: 16,
                  marginTop: 16,
                  paddingBottom: i < purchaseOptions.length - 1 ? 16 : 0,
                  borderBottomWidth:
                    i < purchaseOptions.length - 1
                      ? StyleSheet.hairlineWidth
                      : 0,
                  borderColor:
                    i < purchaseOptions.length - 1 ? "#3c3d41" : undefined,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {/* <Text style={theme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{JSON.stringify(details)}</Text> */}
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Icon details={details} />
                    <Text
                      style={
                        theme === "dark"
                          ? {
                              ...iOSUIKit.bodyWhiteObject,
                              marginHorizontal: 16,
                            }
                          : iOSUIKit.body
                      }
                    >
                      {details.title}
                    </Text>
                  </View>
                  <Text style={reusableStyles.date}>{details.price}</Text>
                </View>
              </Pressable>
            );
          })
        ) : (
          <LoadingScreen />
        )}
      </Modalize>
    );
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            ...reusableStyles.date,
            paddingTop: 24,
            paddingLeft: 16,
            paddingBottom: 8,
          }}
        >
          COUNTDOWN NOTIFICATIONS
        </Text>
        <NotificationSetting
          title="Day Before"
          onValueChange={(value) =>
            setNotifications({ ...notifications, dayNotifications: value })
          }
          value={notifications.dayNotifications}
        />
        <NotificationSetting
          title="Week Before"
          onValueChange={(value) =>
            setNotifications({ ...notifications, weekNotifications: value })
          }
          value={notifications.weekNotifications}
          style={{ borderBottomWidth: 0 }}
        />
        {!hasPermissions && (
          <Text
            style={{ ...reusableStyles.date, paddingTop: 8, paddingLeft: 16 }}
          >
            Please enable notifications in your device's settings
          </Text>
        )}
        {Platform.OS === "ios" && (
          <Pressable
            style={({ pressed }) => [
              styles.buttonContainer,
              pressed ? { backgroundColor: "#2c2c2e" } : null,
            ]}
            onPress={() => modalizeRef.current?.open()}
          >
            {/* <View
              style={{
                backgroundColor: iOSColors.green,
                // padding: 2,
                borderRadius: 8,
                marginLeft: 16,
              }}
            >
              <Ionicons
                name="wallet"
                color="white"
                size={iOSUIKit.bodyObject.lineHeight}
                style={{
                  textAlign: "center",
                  margin: 4,
                }}
              />
            </View> */}
            {/* <View style={styles.button}>
              <Text style={iOSUIKit.bodyWhite}>Tip Jar</Text>
            </View> */}
            <View style={[styles.button, { justifyContent: "space-between" }]}>
              <Text style={iOSUIKit.bodyWhite}>Tip Jar</Text>
              <Ionicons
                name="chevron-forward"
                color={iOSColors.gray}
                size={iOSUIKit.bodyObject.fontSize}
                style={{ alignSelf: "center" }}
              />
            </View>
          </Pressable>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.buttonContainer,
            pressed ? { backgroundColor: "#2c2c2e" } : null,
          ]}
          onPress={() => navigation.navigate("Account")}
          // onPress={() =>
          //   Alert.alert("Sign out?", undefined, [
          //     { text: "Cancel", style: "cancel" },
          //     { text: "Sign Out", style: "destructive", onPress: signOut },
          //   ])
          // }
        >
          <View style={[styles.button, { justifyContent: "space-between" }]}>
            <Text style={iOSUIKit.bodyWhite}>Account</Text>
            <Ionicons
              name="chevron-forward"
              color={iOSColors.gray}
              size={iOSUIKit.bodyObject.fontSize}
              style={{ alignSelf: "center" }}
            />
          </View>
        </Pressable>
      </View>
      <TipModal />
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "#1c1c1e",
    paddingLeft: 16,
    alignItems: "center",
  },
  item: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderColor: "#3c3d41",
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    paddingVertical: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#1c1c1e",
    alignItems: "center",
    marginTop: 32,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    borderColor: "#3c3d41",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
});

export default Settings;
