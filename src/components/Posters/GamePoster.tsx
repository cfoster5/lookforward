import React from "react";
import FastImage from "react-native-fast-image";

import { TextPoster } from "./TextPoster";
import { reusableStyles } from "../../helpers/styles";
import PosterButton from "../PosterButton";

import { useStore } from "@/stores/store";
import { Game, ReleaseDate } from "@/types";
import { timestamp } from "@/utils/dates";

export function GamePoster({
  game,
}: {
  game: Game & { release_dates: ReleaseDate[] };
}) {
  const { gameSubs } = useStore();
  const inCountdown = gameSubs.find(
    (releaseDate) => releaseDate.game.id === game.id
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
        <FastImage
          style={{
            ...reusableStyles.gamePoster,
            height:
              (game.cover.height / game.cover.width) *
              reusableStyles.gamePoster.width,
          }}
          // source={{ uri: `https:${(data as IGDB.ReleaseDate.ReleaseDate)?.game?.cover?.url.replace("thumb", "cover_big_2x")}` }}
          source={{
            uri: `https:${game.cover?.url.replace("thumb", "cover_big_2x")}`,
          }}
        />
      ) : (
        <TextPoster text={game.name} />
      )}
    </>
  );
}
