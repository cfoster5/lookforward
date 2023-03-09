import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GamePlatformPicker } from "components/GamePlatformPicker";
import { IoniconsHeaderButton } from "components/IoniconsHeaderButton";
import { removeSub } from "helpers/helpers";
import { FirestoreGame } from "interfaces/firebase";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Modalize } from "react-native-modalize";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import GameDetails from "./components/GameDetails";

import { useStore } from "@/stores/store";
import { FindStackParamList, TabNavigationParamList } from "@/types";

type GameScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParamList, "Game">,
  BottomTabScreenProps<TabNavigationParamList, "FindTab">
>;

function Game({ navigation, route }: GameScreenNavigationProp) {
  const { game } = route.params;
  const modalizeRef = useRef<Modalize>(null);
  const [countdownId, setCountdownId] = useState<FirestoreGame["documentID"]>();
  const { user, gameSubs } = useStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: game.name,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="search"
            iconName={countdownId ? "checkmark-outline" : "add-outline"}
            onPress={() =>
              !countdownId
                ? modalizeRef.current?.open()
                : removeSub("gameReleases", countdownId, user!.uid)
            }
          />
        </HeaderButtons>
      ),
    });
  }, [game, navigation, countdownId]);

  useEffect(() => {
    const documentID = gameSubs.find(
      (releaseDate) => releaseDate.game.id === game.id
    )?.documentID;

    setCountdownId(documentID);
  }, [gameSubs]);

  return (
    <>
      <GameDetails navigation={navigation} game={game} />
      <GamePlatformPicker modalizeRef={modalizeRef} game={game} />
    </>
  );
}

export default Game;
