import { getAnalytics } from "@react-native-firebase/analytics";
import { useScrollToTop } from "@react-navigation/native";
import { useRef } from "react";
import { Platform, PlatformColor, SectionList, View } from "react-native";

import { LargeBorderlessButton } from "@/components/LargeBorderlessButton";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useStore } from "@/stores/store";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

import { useGameCountdowns } from "./api/getGameCountdowns";
import { useMovieCountdowns } from "./api/getMovieCountdowns";
import { usePeopleCountdowns } from "./api/getPeopleCountdowns";
import { CountdownItem } from "./components/CountdownItem";
import { SectionHeader } from "./components/SectionHeader";

function Countdown() {
  const { isPro, proModalRef } = useStore();
  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);
  const paddingBottom = useBottomTabOverflow();
  const movies = useMovieCountdowns();
  const gameReleases = useGameCountdowns();
  const people = usePeopleCountdowns();

  const isLoading =
    movies.some((movie) => movie.isLoading) ||
    gameReleases.some((release) => release.isLoading) ||
    people.some((person) => person.isLoading);

  if (isLoading) return <LoadingScreen />;

  // Precompute flattened and sorted data
  const flattenedMovies = movies
    .flatMap((movie) => movie.data)
    .sort((a, b) => {
      if (!a?.releaseDate) return 1; // Place undefined dates at the end
      if (!b?.releaseDate) return -1; // Place undefined dates at the end
      return (
        new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      );
    });

  const flattenedGames = gameReleases
    .flatMap((release) => release.data)
    .sort((a, b) => {
      if (!a?.date) return 1; // Place undefined dates at the end
      if (!b?.date) return -1; // Place undefined dates at the end
      return a.date - b.date; // Numeric comparison for valid dates
    });

  const flattenedPeople = people
    .flatMap((person) => person.data)
    .sort((a, b) => {
      // Sort people alphabetically by name since they don't have release dates
      if (!a?.name) return 1;
      if (!b?.name) return -1;
      return a.name.localeCompare(b.name);
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
        { data: flattenedPeople, title: "People" },
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
              : section.title === "Games"
                ? index + 1 === flattenedGames.length
                : index + 1 === flattenedPeople.length
          }
        />
      )}
      renderSectionHeader={SectionHeader}
      ListHeaderComponent={
        <>
          {!isPro && (
            <LargeBorderlessButton
              handlePress={async () => {
                proModalRef.current?.present();
                await getAnalytics().logEvent("select_promotion", {
                  name: "Pro",
                  id: "com.lookforward.pro",
                });
              }}
              text="Explore Pro Features"
            />
          )}
          <View
            style={{
              height: 16,
              backgroundColor: PlatformColor("systemGray6"),
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
        </>
      }
      ref={scrollRef}
    />
  );
}

export default Countdown;
