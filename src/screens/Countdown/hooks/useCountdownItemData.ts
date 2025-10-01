import { useGameCountdowns } from "../api/getGameCountdowns";
import { useMovieCountdowns } from "../api/getMovieCountdowns";
import {
  calculateDaysUntil,
  formatReleaseDate,
  getAspectRatio,
  getImageSource,
  getTitle,
} from "../utils/countdownItemHelpers";

type MovieCountdown = ReturnType<typeof useMovieCountdowns>[number]["data"];
type GameCountdown = ReturnType<typeof useGameCountdowns>[number]["data"];
type CountdownItem = MovieCountdown | GameCountdown;

export function useCountdownItemData(
  item: CountdownItem,
  sectionName: "Movies" | "Games",
) {
  const imageSource = getImageSource(item, sectionName);
  const title = getTitle(item, sectionName);
  const formattedDate = formatReleaseDate(item, sectionName);
  const daysUntil = calculateDaysUntil(item, sectionName);
  const aspectRatio = getAspectRatio(sectionName);

  return { imageSource, title, formattedDate, daysUntil, aspectRatio };
}
