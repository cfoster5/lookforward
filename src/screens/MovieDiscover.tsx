import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import { iOSUIKit } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";

import ButtonMultiState from "../components/ButtonMultiState";
import { IoniconsHeaderButton } from "../components/IoniconsHeaderButton";
import { LoadingScreen } from "../components/LoadingScreen";
import { MoviePoster } from "../components/Posters/MoviePoster";
import TabStackContext from "../contexts/TabStackContext";
import { targetedProviders } from "../helpers/helpers";
import { getDiscoverMovies } from "../helpers/tmdbRequests";
// import { useDiscoverFilterCreation } from "../hooks/useDiscoverFilterCreation";
import { useGetMovieWatchProviders } from "../hooks/useGetMovieWatchProviders";
import { Movie } from "../interfaces/tmdb";

function MovieDiscover({ route, navigation }: any) {
  const { width: windowWidth } = useWindowDimensions();
  const { genre, company, keyword, provider } = route.params;
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollRef = useRef<FlatList>(null);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [pageIndex, setPageIndex] = useState(1);
  const { theme } = useContext(TabStackContext);
  const [sortMethod, setSortMethod] = useState("popularity.desc");
  const [selectedMovieWatchProvider, setSelectedMovieWatchProvider] =
    useState<number>(0);
  const movieWatchProviders = useGetMovieWatchProviders(true);
  // const discoverFilter = useDiscoverFilterCreation(
  //   genre,
  //   company,
  //   keyword,
  //   provider,
  //   selectedMovieWatchProvider,
  //   sortMethod
  // );
  // const movies = useGetDiscoverMovies(discoverFilter, pageIndex);
  const modalRef = useRef<Modalize>(null);

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
            iconName={"funnel-outline"}
            onPress={() => modalRef.current?.open()}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    setMovies([]);
    let title = "";
    let discoverBy = {
      genreId: undefined,
      companyId: undefined,
      keywordId: undefined,
      watchProvider: selectedMovieWatchProvider,
      sortMethod: sortMethod,
    };
    if (genre) {
      title = genre.name;
      discoverBy.genreId = genre.id;
    } else if (company) {
      title = company.name;
      discoverBy.companyId = company.id;
    } else if (keyword) {
      title = keyword.name;
      discoverBy.keywordId = keyword.id;
    } else if (provider) {
      if (provider.provider_id !== selectedMovieWatchProvider) {
        title = movieWatchProviders.find(
          (provider, i) => provider.provider_id === selectedMovieWatchProvider
        )?.provider_name;
        discoverBy.watchProvider = selectedMovieWatchProvider;
      } else {
        title = provider.provider_name;
        discoverBy.watchProvider = provider.provider_id;
      }
    }

    navigation.setOptions({ title: title });
    getDiscoverMovies(discoverBy).then((json) => {
      setMovies(json.results);
      scrollRef?.current?.scrollToIndex({
        index: 0,
        animated: false,
      });
    });
  }, [genre, company, keyword, sortMethod, selectedMovieWatchProvider]);

  useEffect(() => {
    if (pageIndex > 1) {
      let discoverBy = {
        genreId: undefined,
        companyId: undefined,
        keywordId: undefined,
        watchProvider: selectedMovieWatchProvider,
        sortMethod: sortMethod,
        pageIndex: 1,
      };
      if (genre) {
        discoverBy.genreId = genre.id;
      } else if (company) {
        discoverBy.companyId = company.id;
      } else if (keyword) {
        discoverBy.keywordId = keyword.id;
      } else if (provider) {
        if (provider.provider_id !== selectedMovieWatchProvider) {
          discoverBy.watchProvider = selectedMovieWatchProvider;
        } else {
          discoverBy.watchProvider = provider.provider_id;
        }
      }
      discoverBy.pageIndex = pageIndex;
      getDiscoverMovies(discoverBy).then((json) => {
        setMovies([...movies, ...json.results]);
      });
    }
  }, [pageIndex]);

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
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {children}
        </ScrollView>
      </>
    );
  }

  function DiscoveryFilterModal() {
    return (
      <Modalize
        ref={modalRef}
        adjustToContentHeight={true}
        childrenStyle={{
          marginBottom: Platform.OS === "ios" ? tabBarheight + 16 : 16,
        }}
        modalStyle={theme === "dark" ? { backgroundColor: "#121212" } : {}}
      >
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
            data={movieWatchProviders
              .filter(
                (provider) =>
                  targetedProviders.indexOf(provider.provider_name) > -1
              )
              .filter(
                (v, i, a) =>
                  a.findIndex((t) => t.provider_name === v.provider_name) === i
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
                onPress={() => setSelectedMovieWatchProvider(item.provider_id)}
                test={item.provider_id}
              />
            )}
            keyExtractor={(item) => item.provider_id.toString()}
          />
        </ModalListWrapper>
      </Modalize>
    );
  }

  return (
    <>
      {movies.length > 0 ? (
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
          keyExtractor={(item, index) => item.id.toString()}
          initialNumToRender={6}
          onEndReached={({ distanceFromEnd }) => setPageIndex(pageIndex + 1)}
          // Fire onEndReached when 4 screen lengths away from bottom
          onEndReachedThreshold={4}
        />
      ) : (
        <LoadingScreen />
      )}
      <DiscoveryFilterModal />
    </>
  );
}

export default MovieDiscover;
