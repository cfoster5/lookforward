import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { useScrollToTop } from "@react-navigation/native";
import { useRef } from "react";
import { Platform, PlatformColor, SectionList, View } from "react-native";

import { useGameCountdowns } from "./api/getGameCountdowns";
import { useMovieCountdowns } from "./api/getMovieCountdowns";
import { CountdownItem } from "./components/CountdownItem";
import { SectionHeader } from "./components/SectionHeader";

import { LoadingScreen } from "@/components/LoadingScreen";
import { compareDates, isoToUTC } from "@/utils/dates";

function Countdown() {
  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);
  const tabBarHeight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const movies = useMovieCountdowns();
  const gameReleases = useGameCountdowns();

  const isLoading =
    movies.some((movie) => movie.isLoading) ||
    gameReleases.some((release) => release.isLoading);

  if (isLoading) return <LoadingScreen />;

  const contentContainerStyle = {
    marginHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? headerHeight + 16 : 16,
    paddingBottom: Platform.OS === "ios" ? tabBarHeight + 16 : 16,
  };

  const scrollIndicatorInsets =
    Platform.OS === "ios" ? { top: 16, bottom: tabBarHeight - 16 } : undefined;

  return (
    <SectionList
      contentContainerStyle={contentContainerStyle}
      scrollIndicatorInsets={scrollIndicatorInsets}
      sections={[
        {
          data: movies
            .flatMap((movie) => movie.data)
            .sort((a, b) =>
              compareDates(isoToUTC(a!.releaseDate), isoToUTC(b!.releaseDate)),
            ),
          title: "Movies",
        },
        {
          data: gameReleases
            .flatMap((release) => release.data)
            .sort((a, b) => a!.date - b!.date),
          title: "Games",
        },
      ]}
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item, section, index }) => (
        <CountdownItem
          item={item}
          sectionName={section.title}
          isLastInSection={
            section.title === "Movies"
              ? index + 1 === movies.flatMap((movie) => movie.data).length
              : index + 1 ===
                gameReleases.flatMap((release) => release.data).length
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
