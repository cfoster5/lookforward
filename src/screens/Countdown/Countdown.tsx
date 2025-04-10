import { useScrollToTop } from "@react-navigation/native";
import { useRef } from "react";
import { Platform, PlatformColor, SectionList, View } from "react-native";

import { LoadingScreen } from "@/components/LoadingScreen";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

import { useGameCountdowns } from "./api/getGameCountdowns";
import { useMovieCountdowns } from "./api/getMovieCountdowns";
import { CountdownItem } from "./components/CountdownItem";
import { SectionHeader } from "./components/SectionHeader";

function Countdown() {
  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);
  const paddingBottom = useBottomTabOverflow();
  const movies = useMovieCountdowns();
  const gameReleases = useGameCountdowns();

  const isLoading =
    movies.some((movie) => movie.isLoading) ||
    gameReleases.some((release) => release.isLoading);

  if (isLoading) return <LoadingScreen />;

  // Precompute flattened and sorted data
  const flattenedMovies = movies
    .flatMap((movie) => movie.data)
    .sort((a, b) => {
      if (!a?.releaseDate) return 1; // Place undefined dates at the end
      if (!b?.releaseDate) return -1; // Place undefined dates at the end
      return a.releaseDate.localeCompare(b.releaseDate); // Lexicographical comparison
    });

  const flattenedGames = gameReleases
    .flatMap((release) => release.data)
    .sort((a, b) => {
      if (!a?.date) return 1; // Place undefined dates at the end
      if (!b?.date) return -1; // Place undefined dates at the end
      return a.date - b.date; // Numeric comparison for valid dates
    });

  return (
    <SectionList
      contentContainerStyle={{
        marginHorizontal: 16,
        ...Platform.select({ ios: { paddingVertical: 16 } }),
      }}
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{ bottom: paddingBottom }}
      scrollIndicatorInsets={{ bottom: paddingBottom }}
      sections={[
        { data: flattenedMovies, title: "Movies" },
        { data: flattenedGames, title: "Games" },
      ]}
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item, section, index }) => (
        <CountdownItem
          item={item}
          sectionName={section.title}
          isLastInSection={
            section.title === "Movies"
              ? index + 1 === flattenedMovies.length
              : index + 1 === flattenedGames.length
          }
        />
      )}
      renderSectionHeader={SectionHeader}
      ListHeaderComponent={
        <View
          style={{
            height: 16,
            backgroundColor: PlatformColor("systemGray6"),
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      }
      ListFooterComponent={
        <View
          style={{
            height: 16,
            backgroundColor: PlatformColor("systemGray6"),
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        />
      }
      ref={scrollRef}
    />
  );
}

export default Countdown;
