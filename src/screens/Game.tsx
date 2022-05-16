import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Modalize } from "react-native-modalize";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import firestore from "@react-native-firebase/firestore";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import GameDetails from "../components/Details/GameDetails";
import GameReleaseModal from "../components/GamePlatformPicker";
import { IoniconsHeaderButton } from "../components/IoniconsHeaderButton";
import SubContext from "../contexts/SubContext";
import TabStackContext from "../contexts/TabStackContext";
import { IGDB } from "../interfaces/igdb";
import { Navigation } from "../interfaces/navigation";

interface Props {
  navigation:
    | CompositeNavigationProp<
        StackNavigationProp<Navigation.FindStackParamList, "Details">,
        BottomTabNavigationProp<Navigation.TabNavigationParamList, "FindTab">
      >
    | CompositeNavigationProp<
        StackNavigationProp<Navigation.CountdownStackParamList, "Details">,
        BottomTabNavigationProp<
          Navigation.TabNavigationParamList,
          "CountdownTab"
        >
      >;
  route: RouteProp<
    Navigation.FindStackParamList | Navigation.CountdownStackParamList,
    "Details"
  >;
}

function Game({ navigation, route }: Props) {
  const { game } = route.params;
  const modalizeRef = useRef<Modalize>(null);
  const [countdownId, setCountdownId] = useState();
  const { user } = useContext(TabStackContext);
  const { games } = useContext(SubContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: game.name,
      headerRight: () => (
        // upcomingRelease() && (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="search"
            iconName={countdownId ? "checkmark-outline" : "add-outline"}
            onPress={() =>
              !countdownId ? modalizeRef.current?.open() : deleteItem()
            }
          />
        </HeaderButtons>
      ),
      // ),
    });
  }, [game, navigation, countdownId]);

  useEffect(() => {
    let documentID = games.find(
      (releaseDate: IGDB.ReleaseDate.ReleaseDate) =>
        releaseDate.game.id === game.id
    )?.documentID;

    setCountdownId(documentID);
  }, [games]);

  async function deleteItem() {
    try {
      await firestore()
        .collection("gameReleases")
        .doc(countdownId)
        .update({
          subscribers: firestore.FieldValue.arrayRemove(user),
        });
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return (
    <>
      <GameDetails navigation={navigation} game={game} />
      <GameReleaseModal modalizeRef={modalizeRef} game={game} />
    </>
  );
}

export default Game;
