import * as Colors from "@bacons/apple-colors";
import {
  arrayRemove,
  doc,
  getFirestore,
  writeBatch,
} from "@react-native-firebase/firestore";
import { useCallback } from "react";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { useAuthStore, useCountdownStore } from "@/stores";

export const DeleteHeader = () => {
  const {
    movies: selectedMovies,
    games: selectedGames,
    showDeleteButton,
    toggleDeleteButton,
    clearSelections,
  } = useCountdownStore();
  const { user } = useAuthStore();

  const deleteItems = useCallback(async () => {
    const db = getFirestore();
    const batch = writeBatch(db);
    selectedMovies.map((selection) => {
      const docRef = doc(db, "movies", selection.toString());
      batch.update(docRef, {
        subscribers: arrayRemove(user!.uid),
      });
    });
    selectedGames.map((selection) => {
      const docRef = doc(db, "gameReleases", selection.toString());
      batch.update(docRef, {
        subscribers: arrayRemove(user!.uid),
      });
    });
    await batch.commit();
    toggleDeleteButton();
    clearSelections();
  }, [
    clearSelections,
    selectedGames,
    selectedMovies,
    toggleDeleteButton,
    user,
  ]);

  return (
    showDeleteButton && (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton} left>
        <Item
          title="Delete"
          buttonStyle={{
            ...iOSUIKit.bodyEmphasizedObject,
            color:
              selectedMovies.concat(selectedGames).length === 0
                ? Colors.systemGray3
                : Colors.systemRed,
          }}
          onPress={deleteItems}
        />
      </HeaderButtons>
    )
  );
};
