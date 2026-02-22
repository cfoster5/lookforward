import { useRouter } from "expo-router";

import { useCountdownStore } from "@/stores";

import { useGameCountdowns } from "../api/getGameCountdowns";
import { useMovieCountdowns } from "../api/getMovieCountdowns";
import { PersonCountdownData } from "../api/getPersonCountdowns";
import { SectionName, getDocumentId } from "../utils/countdownItemHelpers";

type MovieCountdown = ReturnType<typeof useMovieCountdowns>[number]["data"];
type GameCountdown = ReturnType<typeof useGameCountdowns>[number]["data"];
type CountdownItem = MovieCountdown | GameCountdown | PersonCountdownData;

export function useCountdownItemNavigation(
  item: CountdownItem,
  sectionName: SectionName,
) {
  const router = useRouter();
  const { isEditing, toggleSelection } = useCountdownStore();

  const navigateToMovie = () => {
    const movieItem = item as MovieCountdown;
    router.navigate({
      pathname: "/(tabs)/(countdown)/movie/[id]",
      params: {
        id: movieItem.id,
        name: movieItem.title,
      },
    });
  };

  const navigateToGame = () => {
    const gameItem = item as GameCountdown;
    router.navigate({
      pathname: "/(tabs)/(countdown)/game/[id]",
      params: {
        id: gameItem.id,
        game: JSON.stringify({
          id: gameItem.game.id,
          name: gameItem.game.name,
          cover: { url: gameItem.game.cover.url },
        }),
      },
    });
  };

  const navigateToPerson = () => {
    const personItem = item as PersonCountdownData;
    router.navigate({
      pathname: "/(tabs)/(countdown)/person/[id]",
      params: {
        id: personItem.personId,
        name: personItem.personName,
      },
    });
  };

  const toggleItemSelection = () => {
    const documentId = getDocumentId(item, sectionName);
    const section =
      sectionName === "Movies"
        ? "movies"
        : sectionName === "Games"
          ? "games"
          : "people";
    toggleSelection(documentId, section);
  };

  const handlePress = () => {
    if (isEditing) {
      toggleItemSelection();
    } else if (sectionName === "Movies") {
      navigateToMovie();
    } else if (sectionName === "Games") {
      navigateToGame();
    } else {
      navigateToPerson();
    }
  };

  return { handlePress };
}
