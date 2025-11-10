import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import {
  useLocalSearchParams,
  useNavigation,
  useRouter,
  useSegments,
} from "expo-router";
import { useLayoutEffect, useRef, useState } from "react";
import { FlatList, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Movie } from "tmdb-ts";

import { useMovieWatchProviders } from "@/api/getMovieWatchProviders";
import ButtonMultiState from "@/components/ButtonMultiState";
import { CustomBottomSheetModal } from "@/components/CustomBottomSheetModal";
import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { calculateWidth, targetedProviders } from "@/helpers/helpers";
import { useDiscoverMovies } from "@/screens/MovieDiscover/api/getDiscoverMovies";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

const spacing = 16;

export default function MovieDiscover() {
  const segments = useSegments();
  const stack = segments[1] as "(find)" | "(countdown)";
  const navigation = useNavigation();
  const router = useRouter();
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const {
    genre: genreString,
    company: companyString,
    keyword: keywordString,
    provider: providerString,
  } = useLocalSearchParams();

  const genre = genreString ? JSON.parse(genreString) : undefined;
  const company = companyString ? JSON.parse(companyString) : undefined;
  const keyword = keywordString ? JSON.parse(keywordString) : undefined;
  const provider = providerString ? JSON.parse(providerString) : undefined;
  const scrollRef = useRef<FlatList>(null);
  const paddingBottom = useBottomTabOverflow();
  const [sortMethod, setSortMethod] = useState("popularity.desc");
  const [selectedMovieWatchProvider, setSelectedMovieWatchProvider] =
    useState<number>(provider?.provider_id ?? 0);
  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useDiscoverMovies({
    genreId: genre?.id,
    companyId: company?.id,
    keywordId: keyword?.id,
    watchProvider: selectedMovieWatchProvider,
    sortMethod,
  });
  const { data: movieWatchProviders } = useMovieWatchProviders();
  const modalRef = useRef<BottomSheetModal>();

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
      <CustomBottomSheetModal modalRef={modalRef}>
        <BottomSheetView style={{ paddingBottom: safeBottomArea }}>
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
                >
                  {" "}
                  <Ionicons
                    name={item.direction === "Up" ? "arrow-up" : "arrow-down"}
                    color="white"
                  />
                </ButtonMultiState>
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
                    targetedProviders.indexOf(provider.provider_name) > -1,
                )
                .filter(
                  (v, i, a) =>
                    a.findIndex((t) => t.provider_name === v.provider_name) ===
                    i,
                )
                .sort((a, b) =>
                  a.provider_name
                    .toLowerCase()
                    .localeCompare(b.provider_name.toLowerCase()),
                )}
              renderItem={({ item }) => (
                <ButtonMultiState
                  text={item.provider_name}
                  selectedVal={selectedMovieWatchProvider}
                  onPress={() => {
                    setSelectedMovieWatchProvider(item.provider_id);
                    navigation.setOptions({ title: item.provider_name });
                  }}
                  test={item.provider_id}
                />
              )}
              keyExtractor={(item) => item.provider_id.toString()}
            />
          </ModalListWrapper>
        </BottomSheetView>
      </CustomBottomSheetModal>
    );
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <FlatList
        data={movies}
        renderItem={({ item, index }) => (
          <MoviePoster
            movie={item}
            posterPath={item.poster_path}
            style={{
              width: calculateWidth(spacing, spacing, 2),
              aspectRatio: 2 / 3,
            }}
            buttonStyle={{
              marginRight: index % 2 === 0 ? spacing / 2 : 0,
              marginLeft: index % 2 === 1 ? spacing / 2 : 0,
            }}
          />
        )}
        automaticallyAdjustsScrollIndicatorInsets
        contentInsetAdjustmentBehavior="automatic"
        // contentInset={{ bottom: paddingBottom }}
        // scrollIndicatorInsets={{ bottom: paddingBottom }}
        contentContainerStyle={{ marginHorizontal: 16 }}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: spacing,
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
