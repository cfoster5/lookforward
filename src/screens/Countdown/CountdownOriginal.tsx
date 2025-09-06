import { getAnalytics } from "@react-native-firebase/analytics";
import { useScrollToTop } from "@react-navigation/native";
import { useRef } from "react";
import {
  Animated,
  FlatList,
  Platform,
  PlatformColor,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LargeBorderlessButton } from "@/components/LargeBorderlessButton";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useStore } from "@/stores/store";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

import { useGameCountdowns } from "./api/getGameCountdowns";
import { useMovieCountdowns } from "./api/getMovieCountdowns";
import { usePeopleCountdowns } from "./api/getPeopleCountdowns";
import { CountdownCard } from "./components/CountdownCard";
import { HorizontalSectionHeader } from "./components/HorizontalSectionHeader";

function Countdown() {
  const { isPro, proModalRef } = useStore();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
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

  // Precompute flattened and sorted data
  const flattenedMovies = movies
    .flatMap((movie) => movie.data)
    .sort((a, b) => {
      if (!a?.releaseDate) return 1;
      if (!b?.releaseDate) return -1;
      return (
        new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      );
    })
    .slice(0, 10); // Limit to 10 items for horizontal scroll

  const flattenedGames = gameReleases
    .flatMap((release) => release.data)
    .sort((a, b) => {
      if (!a?.date) return 1;
      if (!b?.date) return -1;
      return a.date - b.date;
    })
    .slice(0, 10); // Limit to 10 items for horizontal scroll

  const flattenedPeople = people
    .flatMap((person) => person.data)
    .sort((a, b) => {
      if (!a?.name) return 1;
      if (!b?.name) return -1;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 10); // Limit to 10 items for horizontal scroll

  const largeHeaderInset = statusBarInset + 92;

  return (
    <Animated.ScrollView
      ref={scrollRef}
      scrollToOverflowEnabled
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{
        bottom: paddingBottom,
        top: -largeHeaderInset,
      }}
      scrollIndicatorInsets={{
        bottom: paddingBottom - (Platform.OS === "ios" ? 0 : 0),
        top: largeHeaderInset,
      }}
      style={{
        backgroundColor: PlatformColor("systemGroupedBackground"),
      }}
      contentContainerStyle={{
        paddingTop: largeHeaderInset,
        paddingBottom: paddingBottom,
      }}
    >
      {!isPro && (
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
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
        </View>
      )}

      {/* Movies Section */}
      {flattenedMovies.length > 0 && (
        <>
          <HorizontalSectionHeader title="Movies" sectionType="Movies" />
          <FlatList
            data={flattenedMovies}
            renderItem={({ item }) => (
              <CountdownCard item={item} sectionName="Movies" />
            )}
            keyExtractor={(item, index) => `movie-${item.id}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 8,
            }}
          />
        </>
      )}

      {/* Games Section */}
      {flattenedGames.length > 0 && (
        <>
          <HorizontalSectionHeader title="Games" sectionType="Games" />
          <FlatList
            data={flattenedGames}
            renderItem={({ item }) => (
              <CountdownCard item={item} sectionName="Games" />
            )}
            keyExtractor={(item, index) => `game-${item.id}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 8,
            }}
          />
        </>
      )}

      {/* People Section */}
      {flattenedPeople.length > 0 && (
        <>
          <HorizontalSectionHeader title="People" sectionType="People" />
          <FlatList
            data={flattenedPeople}
            renderItem={({ item }) => (
              <CountdownCard item={item} sectionName="People" />
            )}
            keyExtractor={(item, index) => `person-${item.id}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 8,
            }}
          />
        </>
      )}

      {/* Add some bottom padding */}
      <View style={{ height: 32 }} />
    </Animated.ScrollView>
  );
}

export default Countdown;
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
