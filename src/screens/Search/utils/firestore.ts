import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "@react-native-firebase/firestore";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

type CountdownToggleProps = {
  collection: "movies";
  id: number;
  user: FirebaseAuthTypes.User;
};

export async function removeCountdownItem(
  collection: CountdownToggleProps["collection"],
  id: CountdownToggleProps["id"],
  user: CountdownToggleProps["user"],
) {
  try {
    const db = getFirestore();
    const docRef = doc(db, collection, id.toString());
    await updateDoc(docRef, { subscribers: arrayRemove(user!.uid) });
  } catch (error) {
    console.error("Error writing document: ", error);
  }
}

export async function addCountdownItem(
  collection: CountdownToggleProps["collection"],
  id: CountdownToggleProps["id"],
  user: CountdownToggleProps["user"],
) {
  try {
    const db = getFirestore();
    const docRef = doc(db, collection, id.toString());
    await setDoc(
      docRef,
      { subscribers: arrayUnion(user!.uid) },
      { merge: true },
    );
    ReactNativeHapticFeedback.trigger("impactLight", {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  } catch (error) {
    console.error("Error writing document: ", error);
  }
}
