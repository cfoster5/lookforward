import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
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
import Poster from "../components/Poster";
import TabStackContext from "../contexts/TabStackContext";
import { targetedProviders } from "../helpers/helpers";
import {
  getDiscoverMovies,
  getMovieWatchProviders,
} from "../helpers/tmdbRequests";
import { Movie, MovieWatchProvider } from "../interfaces/tmdb";

function MovieDiscover({ route, navigation }: any) {
  const { genre, company, keyword, provider } = route.params;
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollRef = useRef<FlatList>(null);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [pageIndex, setPageIndex] = useState(1);
  const { theme } = useContext(TabStackContext);
  const [sortMethod, setSortMethod] = useState("popularity.desc");
  const modalRef = useRef<Modalize>(null);
  const [movieWatchProviders, setMovieWatchProviders] = useState<
    MovieWatchProvider[]
  >([
    {
      display_priority: 0,
      logo_path: "",
      provider_id: 0,
      provider_name: "Any",
    },
  ]);
  const [selectedMovieWatchProvider, setSelectedMovieWatchProvider] =
    useState<number>(0);

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

  useEffect(() => {
    getMovieWatchProviders().then((json: { results: MovieWatchProvider[] }) =>
      setMovieWatchProviders([...movieWatchProviders, ...json.results])
    );
  }, []);

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
            <Poster navigation={navigation} movie={item} />
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
          // ListHeaderComponent={
          //   showSortOptions
          //     ?
          //     <FlatList
          //       style={{ flexDirection: "row" }}
          //       horizontal={true}
          //       data={sortOptions}
          //       renderItem={({ item }) => <SortMethod method={item} />}
          //       keyExtractor={index => index.toString()}
          //     />
          //     :
          //     <></>
          // }
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <Modalize
        ref={modalRef}
        adjustToContentHeight={true}
        childrenStyle={{
          marginBottom: Platform.OS === "ios" ? tabBarheight + 16 : 16,
        }}
        modalStyle={theme === "dark" ? { backgroundColor: "#121212" } : {}}
      >
        <Text
          style={{
            ...iOSUIKit.bodyEmphasizedWhiteObject,
            marginTop: 16,
            marginHorizontal: 16,
          }}
        >
          Sort by
        </Text>
        {/* Wrap FlatList in ScrollView with horizontal prop so that scrollEnabled within FlatList can be disabled  */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
        </ScrollView>
        <Text
          style={{
            ...iOSUIKit.bodyEmphasizedWhiteObject,
            marginTop: 16,
            marginHorizontal: 16,
          }}
        >
          Provider
        </Text>
        {/* Wrap FlatList in ScrollView with horizontal prop so that scrollEnabled within FlatList can be disabled  */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
              .sort((a, b) => b.provider_name < a.provider_name)}
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
        </ScrollView>
      </Modalize>
    </>
  );
}

export default MovieDiscover;
