import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "@react-native-firebase/firestore";
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission,
} from "@react-native-firebase/messaging";
import Purchases from "react-native-purchases";

export async function promptForNotificationsAfterCountdownAdd(uid: string) {
  try {
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled) return;

    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    const docSnapshot = await getDoc(userRef);

    if (!docSnapshot.data()?.notifications) {
      await updateDoc(userRef, {
        notifications: { day: true, week: true },
      });
    }

    const token = await getToken(messaging);
    await updateDoc(userRef, { deviceToken: token });
    await Purchases.setPushToken(token);
  } catch (error) {
    console.error("Error prompting/syncing notifications:", error);
  }
}
