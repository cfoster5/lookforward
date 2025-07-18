import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "@react-native-firebase/firestore";
import * as Haptics from "expo-haptics";

import { tryCatch } from "@/utils/try-catch";

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

type AddCountdownProps = CountdownToggleProps & {
  limitCheckCallback?: () => boolean;
};

export async function addCountdownItem({
  collection,
  id,
  user,
  limitCheckCallback,
}: AddCountdownProps) {
  // Check limit if callback provided
  if (limitCheckCallback && !limitCheckCallback()) {
    return { error: null, limitReached: true };
  }

  const db = getFirestore();
  const docRef = doc(db, collection, id.toString());
  const { error } = await tryCatch(
    setDoc(docRef, { subscribers: arrayUnion(user!.uid) }, { merge: true }),
  );
  if (error) {
    console.error("Error writing document: ", error);
    return { error };
  }
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  return { error: null, limitReached: false };
}
