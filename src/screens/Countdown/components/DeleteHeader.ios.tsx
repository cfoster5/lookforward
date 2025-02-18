import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { useStore, useCountdownStore } from "@/stores/store";
import firestore from "@react-native-firebase/firestore";
import { useCallback } from "react";
import { PlatformColor } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

export const DeleteHeader = () => {
  const {
    movies: selectedMovies,
    games: selectedGames,
    showDeleteButton,
    toggleDeleteButton,
    clearSelections,
  } = useCountdownStore();
  const { user } = useStore();

  const deleteItems = useCallback(async () => {
    const batch = firestore().batch();
    selectedMovies.map((selection) => {
      const docRef = firestore().collection("movies").doc(selection.toString());
      batch.update(docRef, {
        subscribers: firestore.FieldValue.arrayRemove(user!.uid),
      });
    });
    selectedGames.map((selection) => {
      const docRef = firestore()
        .collection("gameReleases")
        .doc(selection.toString());
      batch.update(docRef, {
        subscribers: firestore.FieldValue.arrayRemove(user!.uid),
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
                ? PlatformColor("systemGray3")
                : PlatformColor("systemRed"),
          }}
          onPress={deleteItems}
        />
      </HeaderButtons>
    )
  );
};
