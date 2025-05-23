import { Image } from "expo-image";

import { useStore } from "@/stores/store";
import { Game, ReleaseDate } from "@/types";
import { timestamp } from "@/utils/dates";

import { reusableStyles } from "../../helpers/styles";
import PosterButton from "../PosterButton";

import { TextPoster } from "./TextPoster";

export function GamePoster({
  game,
}: {
  game: Game & { release_dates: ReleaseDate[] };
}) {
  const { gameSubs } = useStore();
  const inCountdown = gameSubs.find(
    (releaseDate) => releaseDate.game.id === game.id,
  )?.documentID;
  const hasUpcomingRelease =
    game.release_dates.filter((releaseDate) => releaseDate.date >= timestamp)
      .length !== 0;
  return (
    <>
      {hasUpcomingRelease && (
        <PosterButton game={game} inCountdown={inCountdown} />
      )}
      {game.cover?.url ? (
        <Image
          style={{
            ...reusableStyles.gamePoster,
            // height:
            //   (game.cover.height / game.cover.width) *
            //   reusableStyles.gamePoster.width,
            aspectRatio: 3 / 4,
          }}
          // source={{ uri: `https:${(data as IGDB.ReleaseDate.ReleaseDate)?.game?.cover?.url.replace("thumb", "cover_big_2x")}` }}
          source={{
            uri: `https:${game.cover?.url.replace("thumb", "cover_big_2x")}`,
          }}
          contentFit="cover"
        />
      ) : (
        <TextPoster text={game.name} />
      )}
    </>
  );
}
