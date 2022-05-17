import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { iOSColors, iOSUIKit } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  connectAsync,
  IAPItemDetails,
  purchaseItemAsync,
} from "expo-in-app-purchases";

import TabStackContext from "../contexts/TabStackContext";
import { reusableStyles } from "../helpers/styles";
import { useFirstRender } from "../hooks/useFirstRender";
import { useGetPurchaseOptions } from "../hooks/useGetPurchaseOptions";
import { Navigation } from "../interfaces/navigation";

type ProfileScreenRouteProp = RouteProp<
  Navigation.ProfileStackParamList,
  "Profile"
>;
type ProfileScreenNavigationProp = StackNavigationProp<
  Navigation.ProfileStackParamList,
  "Profile"
>;
type ProfileScreenProps = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
  dayNotifications: boolean;
  weekNotifications: boolean;
};

function Profile({ route, navigation }: ProfileScreenProps) {
  const { user } = useContext(TabStackContext);
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
    if (Platform.OS === "ios") {
      async function connect() {
        try {
          await connectAsync();
          setConnected(true);
        } catch {
          console.log(`connection error`);
        }
      }
      connect();
    }
  }, []);

  useEffect(() => {
    if (user) {
      getNotificationPermissions();
      const preferenceSubscription = firestore()
        .collection("users")
        .doc(user)
        .collection("contentPreferences")
        .doc("preferences")
        .onSnapshot(
          (querySnapshot) => {
            let preferences = querySnapshot.data();
            setNotifications({
              dayNotifications: preferences?.dayNotifications ? true : false,
              weekNotifications: preferences?.weekNotifications ? true : false,
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
        .doc(user)
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
  }: {
    title: string;
    onValueChange: (value: boolean) => void;
    value: boolean;
  }) {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.item}>
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
        adjustToContentHeight={true}
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
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" />
          </View>
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
            style={{ ...styles.buttonContainer }}
            onPress={() => modalizeRef.current?.open()}
          >
            <View style={styles.button}>
              <Text style={{ ...iOSUIKit.bodyObject, color: iOSColors.blue }}>
                Tip Jar
              </Text>
            </View>
          </Pressable>
        )}
        <Pressable
          style={{ ...styles.buttonContainer }}
          // onPress={() => signOut()}
          onPress={() =>
            Alert.alert("Sign out?", undefined, [
              { text: "Cancel", style: "cancel" },
              { text: "Sign Out", style: "destructive", onPress: signOut },
            ])
          }
        >
          <View style={styles.button}>
            <Text style={{ ...iOSUIKit.bodyObject, color: iOSColors.red }}>
              Sign Out
            </Text>
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
    backgroundColor: "#1f1f1f",
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
    backgroundColor: "#1f1f1f",
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

export default Profile;
