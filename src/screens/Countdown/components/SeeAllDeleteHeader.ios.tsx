import {
  getFirestore,
  writeBatch,
  doc,
  arrayRemove,
} from "@react-native-firebase/firestore";
import { useCallback } from "react";
import { PlatformColor } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { useStore, useCountdownStore } from "@/stores/store";

export const SeeAllDeleteHeader = () => {
  const {
    movies: selectedMovies,
    games: selectedGames,
    people: selectedPeople,
    showDeleteButton,
    toggleDeleteButton,
    clearSelections,
  } = useCountdownStore();
  const { user } = useStore();

  const deleteItems = useCallback(async () => {
    const db = getFirestore();
    const batch = writeBatch(db);
    selectedMovies.map((selection) => {
      const docRef = doc(db, "movies", selection.toString());
      batch.update(docRef, { subscribers: arrayRemove(user!.uid) });
    });
    selectedGames.map((selection) => {
      const docRef = doc(db, "gameReleases", selection.toString());
      batch.update(docRef, { subscribers: arrayRemove(user!.uid) });
    });
    selectedPeople.map((selection) => {
      const docRef = doc(db, "people", selection.toString());
      batch.update(docRef, { subscribers: arrayRemove(user!.uid) });
    });
    await batch.commit();
    toggleDeleteButton();
    clearSelections();
  }, [
    clearSelections,
    selectedGames,
    selectedMovies,
    selectedPeople,
    toggleDeleteButton,
    user,
  ]);

  // Only show the delete button when in edit mode
  // When not in edit mode, let the default back button show
  return showDeleteButton ? (
    <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton} left>
      <Item
        title="Delete"
        buttonStyle={{
          ...iOSUIKit.bodyEmphasizedObject,
          color:
            selectedMovies.concat(selectedGames, selectedPeople).length === 0
              ? PlatformColor("systemGray3")
              : PlatformColor("systemRed"),
        }}
        onPress={deleteItems}
      />
    </HeaderButtons>
  ) : null; // Return null to show default back button
};
