import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import produce from "immer";
import { FirestoreGame } from "interfaces/firebase";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useMMKVString } from "react-native-mmkv";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import GameDetails from "./components/GameDetails";

import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { removeSub } from "@/helpers/helpers";
import { useStore } from "@/stores/store";
import { FindStackParamList, Recent, TabNavigationParamList } from "@/types";
import { timestamp } from "@/utils/dates";

type GameScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParamList, "Game">,
  BottomTabScreenProps<TabNavigationParamList, "FindTab">
>;

function Game({ navigation, route }: GameScreenNavigationProp) {
  const { game } = route.params;
  const [countdownId, setCountdownId] = useState<FirestoreGame["documentID"]>();
  const { user, gameSubs, bottomSheetModalRef, setGame } = useStore();

  const [storedGames, setStoredGames] = useMMKVString("recent.games");

  const composeRecentGames = useCallback(
    () => (storedGames ? (JSON.parse(storedGames) as Recent[]) : []),
    [storedGames]
  );

  useEffect(() => {
    const recentGame: Recent = {
      id: game.id,
      name: game.name,
      img_path: game.cover?.url ?? "",
      last_viewed: timestamp,
      media_type: "game",
    };

    const updatedRecentGames = produce(
      composeRecentGames(),
      (draft: Recent[]) => {
        const index = draft.findIndex((recent) => recent.id === game.id);
        if (index === -1) draft.unshift(recentGame);
        else {
          draft.splice(index, 1);
          draft.unshift(recentGame);
        }
      }
    );

    setStoredGames(JSON.stringify(updatedRecentGames));
  }, [composeRecentGames, game.cover?.url, game.id, game.name, setStoredGames]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: game.name,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="search"
            iconName={countdownId ? "checkmark-outline" : "add-outline"}
            onPress={() => {
              if (!countdownId) {
                setGame(game);
                bottomSheetModalRef.current?.present();
              } else {
                removeSub("gameReleases", countdownId, user!.uid);
              }
            }}
          />
        </HeaderButtons>
      ),
    });
  }, [bottomSheetModalRef, countdownId, game, navigation, setGame, user]);

  useEffect(() => {
    const documentID = gameSubs.find(
      (releaseDate) => releaseDate.game.id === game.id
    )?.documentID;

    setCountdownId(documentID);
  }, [gameSubs]);

  return <GameDetails navigation={navigation} game={game} />;
}

export default Game;
