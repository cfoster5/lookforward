import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef } from "react";
import { SectionList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LoadingScreen } from "@/components/LoadingScreen";
import { CountdownStackParamList } from "@/types/navigation";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

import { useGameCountdowns } from "./api/getGameCountdowns";
import { useMovieCountdowns } from "./api/getMovieCountdowns";
import { usePeopleCountdowns } from "./api/getPeopleCountdowns";
import { CountdownItem } from "./components/CountdownItem";

type SeeAllRouteProp = RouteProp<CountdownStackParamList, "SeeAll">;

function SeeAllScreen() {
  const route = useRoute<SeeAllRouteProp>();
  const { sectionType, title } = route.params;
  const scrollRef = useRef<SectionList>(null);
  const paddingBottom = useBottomTabOverflow();
  const { top: statusBarInset } = useSafeAreaInsets();
  const movies = useMovieCountdowns();
  const gameReleases = useGameCountdowns();
  const people = usePeopleCountdowns();

  const isLoading =
    movies.some((movie) => movie.isLoading) ||
    gameReleases.some((release) => release.isLoading) ||
    people.some((person) => person.isLoading);

  if (isLoading) return <LoadingScreen />;

  let data: unknown[] = [];
  if (sectionType === "Movies") {
    data = movies
      .flatMap((movie) => movie.data)
      .sort((a, b) => {
        if (!a?.releaseDate) return 1;
        if (!b?.releaseDate) return -1;
        return (
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
        );
      });
  } else if (sectionType === "Games") {
    data = gameReleases
      .flatMap((release) => release.data)
      .sort((a, b) => {
        if (!a?.date) return 1;
        if (!b?.date) return -1;
        return a.date - b.date;
      });
  } else if (sectionType === "People") {
    data = people
      .flatMap((person) => person.data)
      .sort((a, b) => {
        if (!a?.name) return 1;
        if (!b?.name) return -1;
        return a.name.localeCompare(b.name);
      });
  }

  const largeHeaderInset = statusBarInset + 92;

  return (
    <SectionList
      ref={scrollRef}
      contentContainerStyle={{
        marginHorizontal: 16,
        paddingTop: largeHeaderInset + 16,
        paddingBottom: 16,
      }}
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{
        bottom: paddingBottom,
        top: -largeHeaderInset,
      }}
      scrollIndicatorInsets={{
        bottom: paddingBottom,
        top: largeHeaderInset,
      }}
      sections={[{ data, title }]}
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) =>
        `${sectionType}-${(item as { id?: number })?.id || index}`
      }
      renderItem={({ item, section, index }) => (
        <CountdownItem
          item={item}
          sectionName={sectionType}
          isLastInSection={index + 1 === data.length}
        />
      )}
    />
  );
}

export default SeeAllScreen;
