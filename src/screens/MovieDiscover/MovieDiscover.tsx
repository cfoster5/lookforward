import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMovieWatchProviders } from "@/api/getMovieWatchProviders";
import ButtonMultiState from "@/components/ButtonMultiState";
import { DynamicHeightModal } from "@/components/DynamicHeightModal";
import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { targetedProviders } from "@/helpers/helpers";
import { Movie } from "interfaces/tmdb";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
// import { useDiscoverFilterCreation } from "../hooks/useDiscoverFilterCreation";

import { useDiscoverMovies } from "./api/getDiscoverMovies";

import { FindStackParams, BottomTabParams } from "@/types";

type MovieDiscoverScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParams, "MovieDiscover">,
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParams, "FindTabStack">,
    BottomTabScreenProps<BottomTabParams, "CountdownTabStack">
  >
>;

function MovieDiscover({
  route,
  navigation,
}: MovieDiscoverScreenNavigationProp) {
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { genre, company, keyword, provider } = route.params;
  const scrollRef = useRef<FlatList>(null);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [sortMethod, setSortMethod] = useState("popularity.desc");
  const [selectedMovieWatchProvider, setSelectedMovieWatchProvider] =
    useState<number>(0);
  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isPreviousData,
  } = useDiscoverMovies({
    genreId: genre?.id,
    companyId: company?.id,
    keywordId: keyword?.id,
    watchProvider:
      provider?.provider_id !== selectedMovieWatchProvider
        ? selectedMovieWatchProvider
        : provider.provider_id,
    sortMethod,
  });
  const { data: movieWatchProviders, isLoading } = useMovieWatchProviders();
  const modalRef = useRef<BottomSheetModal>();

  useEffect(() => {
    if (provider) {
      setSelectedMovieWatchProvider(provider.provider_id);
    }
  }, [provider]);

  const sortOptions = [
    { actual: "popularity.desc", friendly: "Popularity", direction: "Down" },
    {
      actual: "release_date.desc",
      friendly: "Release Date",
      direction: "Down",
    },
    {
      actual: "vote_average.desc",
      friendly: "Average Score",
      direction: "Down",
    },
    { actual: "popularity.asc", friendly: "Popularity", direction: "Up" },
    { actual: "release_date.asc", friendly: "Release Date", direction: "Up" },
    { actual: "vote_average.asc", friendly: "Average Score", direction: "Up" },
    // "revenue.asc",
    // "revenue.desc",
    // "primary_release_date.asc",
    // "primary_release_date.desc",
    // "original_title.asc",
    // "original_title.desc",

    // "vote_count.asc",
    // "vote_count.desc"
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons
          HeaderButtonComponent={(props) =>
            IoniconsHeaderButton({ ...props, iconSize: 23 })
          }
        >
          <Item
            title="search"
            iconName="funnel-outline"
            onPress={() => modalRef.current?.present()}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    let title = "";
    if (genre) {
      title = genre.name;
    } else if (company) {
      title = company.name;
    } else if (keyword) {
      title = keyword.name;
    } else if (provider) {
      if (provider.provider_id !== selectedMovieWatchProvider) {
        title = movieWatchProviders.find(
          (provider, i) => provider.provider_id === selectedMovieWatchProvider
        )?.provider_name;
      } else {
        title = provider.provider_name;
      }
    }

    navigation.setOptions({ title });
  }, [genre, company, keyword, selectedMovieWatchProvider]);

  function ModalListWrapper({
    text,
    children,
  }: {
    text: string;
    children: any;
  }) {
    return (
      <>
        <Text
          style={{
            ...iOSUIKit.bodyEmphasizedWhiteObject,
            marginTop: 16,
            marginHorizontal: 16,
          }}
        >
          {text}
        </Text>
        {/* // Wrap FlatList in ScrollView with horizontal prop so that scrollEnabled within FlatList can be disabled */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {children}
        </ScrollView>
      </>
    );
  }

  function DiscoveryFilterModal({ modalRef }) {
    return (
      <DynamicHeightModal modalRef={modalRef}>
        <View style={{ paddingBottom: safeBottomArea }}>
          <ModalListWrapper text="Sort By">
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{
                alignSelf: "flex-start",
                paddingLeft: 16,
                paddingRight: 8,
              }}
              numColumns={Math.ceil(sortOptions.length / 2)}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={sortOptions}
              renderItem={({ item }) => (
                <ButtonMultiState
                  text={item.friendly}
                  selectedVal={sortMethod}
                  onPress={() => setSortMethod(item.actual)}
                  test={item.actual}
                  children={
                    <Ionicons
                      name={item.direction === "Up" ? "arrow-up" : "arrow-down"}
                      color="white"
                    />
                  }
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </ModalListWrapper>
          <ModalListWrapper text="Provider">
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{
                alignSelf: "flex-start",
                paddingLeft: 16,
                paddingRight: 8,
              }}
              numColumns={Math.ceil(targetedProviders.length / 3)}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={[
                {
                  display_priority: 0,
                  logo_path: "",
                  provider_id: 0,
                  provider_name: "Any",
                },
                ...movieWatchProviders,
              ]
                .filter(
                  (provider) =>
                    targetedProviders.indexOf(provider.provider_name) > -1
                )
                .filter(
                  (v, i, a) =>
                    a.findIndex((t) => t.provider_name === v.provider_name) ===
                    i
                )
                .sort((a, b) =>
                  a.provider_name
                    .toLowerCase()
                    .localeCompare(b.provider_name.toLowerCase())
                )}
              renderItem={({ item }) => (
                <ButtonMultiState
                  text={item.provider_name}
                  selectedVal={selectedMovieWatchProvider}
                  onPress={() =>
                    setSelectedMovieWatchProvider(item.provider_id)
                  }
                  test={item.provider_id}
                />
              )}
              keyExtractor={(item) => item.provider_id.toString()}
            />
          </ModalListWrapper>
        </View>
      </DynamicHeightModal>
    );
  }

  if (isPreviousData) return <LoadingScreen />;

  return (
    <>
      <FlatList
        contentContainerStyle={{
          paddingTop: Platform.OS === "ios" ? headerHeight + 16 : 16,
          paddingBottom: Platform.OS === "ios" ? tabBarheight : undefined,
          marginHorizontal: 16,
        }}
        scrollIndicatorInsets={
          Platform.OS === "ios"
            ? {
                top: 16,
                bottom: tabBarheight - 16,
              }
            : undefined
        }
        data={movies}
        renderItem={({ item }: { item: Movie }) => (
          <MoviePoster
            pressHandler={() =>
              navigation.push("Movie", {
                movieId: item.id,
                movieTitle: item.title,
              })
            }
            movie={item}
            posterPath={item.poster_path}
            style={{
              width: windowWidth / 2 - 24,
              height: (windowWidth / 2 - 24) * 1.5,
            }}
          />
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        ref={scrollRef}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={6}
        onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
        onEndReachedThreshold={1.5}
      />
      <DiscoveryFilterModal modalRef={modalRef} />
    </>
  );
}

export default MovieDiscover;
