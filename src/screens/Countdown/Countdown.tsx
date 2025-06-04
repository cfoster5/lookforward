import { getAnalytics } from "@react-native-firebase/analytics";
import { useScrollToTop } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useLayoutEffect } from "react";
import { Platform, PlatformColor, SectionList, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

import { LargeBorderlessButton } from "@/components/LargeBorderlessButton";
import { LoadingScreen } from "@/components/LoadingScreen";
import { BANNER_AD_UNIT_ID } from "@/constants/AdUnits";
import { useAppConfigStore } from "@/stores/appConfig";
import { useStore } from "@/stores/store";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

import { useGameCountdowns } from "./api/getGameCountdowns";
import { useMovieCountdowns } from "./api/getMovieCountdowns";
import { CountdownItem } from "./components/CountdownItem";
import { SectionHeader } from "./components/SectionHeader";
import { DeleteHeader } from "./components/DeleteHeader.ios";
import { MyHeaderRight } from "./components/MyHeaderRight.ios";
import type { CountdownStackParamList } from "@/types";
import { useCountdownStore } from "@/stores/store";

type Props = NativeStackScreenProps<CountdownStackParamList, "Countdown">;
function Countdown({ navigation }: Props) {
  const { isPro, proModalRef } = useStore();
  const { showDeleteButton } = useCountdownStore();
  const { requestNonPersonalizedAdsOnly } = useAppConfigStore();
  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DeleteHeader />,
      headerRight: () => <MyHeaderRight />,
    });
  }, [navigation, showDeleteButton]);
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
        <>
          {!isPro && (
            <View style={{ paddingBottom: 16 }}>
              <LargeBorderlessButton
                handlePress={async () => {
                  proModalRef.current?.present();
                  await getAnalytics().logEvent("select_promotion", {
                    name: "Pro",
                    id: "com.lookforward.pro",
                  });
                }}
                text="Explore Pro Features"
                style={{ paddingBottom: 0 }}
              />
              <View style={{ alignItems: "center", paddingTop: 16 }}>
                <BannerAd
                  unitId={BANNER_AD_UNIT_ID}
                  size={BannerAdSize.BANNER}
                  requestOptions={{ requestNonPersonalizedAdsOnly }}
                />
              </View>
            </View>
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
