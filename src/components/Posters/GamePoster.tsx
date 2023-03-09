import { DateTime } from "luxon";
import React from "react";
import FastImage from "react-native-fast-image";

import { TextPoster } from "./TextPoster";
import { reusableStyles } from "../../helpers/styles";
import PosterButton from "../PosterButton";

import { useStore } from "@/stores/store";
import { Game, ReleaseDate } from "@/types";

export function GamePoster({
  item,
}: {
  item: Game & { release_dates: ReleaseDate[] };
}) {
  const { gameSubs } = useStore();
  const inCountdown = gameSubs.find(
    (releaseDate) => releaseDate.game.id === item.id
  )?.documentID;
  const hasUpcomingRelease =
    item.release_dates.filter(
      (releaseDate) => DateTime.fromISO(releaseDate.date) >= DateTime.now()
    ).length === 0;
  return (
    <>
      {hasUpcomingRelease && (
        <PosterButton game={item} inCountdown={inCountdown} />
      )}
      {item.cover?.url ? (
        <FastImage
          style={{
            ...reusableStyles.gamePoster,
            height:
              (item.cover.height / item.cover.width) *
              reusableStyles.gamePoster.width,
          }}
          // source={{ uri: `https:${(data as IGDB.ReleaseDate.ReleaseDate)?.game?.cover?.url.replace("thumb", "cover_big_2x")}` }}
          source={{
            uri: `https:${item.cover?.url.replace("thumb", "cover_big_2x")}`,
          }}
        />
      ) : (
        <TextPoster text={item.name} />
      )}
    </>
  );
}
