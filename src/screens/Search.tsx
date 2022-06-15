import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { Modalize } from "react-native-modalize";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { useInfiniteQuery, useQuery } from "react-query";
import {
  BottomTabNavigationProp,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  RouteProp,
  useScrollToTop,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DateTime } from "luxon";

import CategoryControl from "../components/CategoryControl/CategoryControl";
import GameReleaseModal from "../components/GamePlatformPicker";
import { LoadingScreen } from "../components/LoadingScreen";
import MovieSearchModal from "../components/MovieSearchModal";
import { GamePoster } from "../components/Posters/GamePoster";
import { MoviePoster } from "../components/Posters/MoviePoster";
import SearchPerson from "../components/SearchPerson";
import { Text as ThemedText } from "../components/Themed";
import GameContext from "../contexts/GamePlatformPickerContexts";
import TabStackContext from "../contexts/TabStackContext";
import useDebounce from "../hooks/useDebounce";
import getGames from "../hooks/useGetGames";
import { IGDB } from "../interfaces/igdb";
import { Navigation } from "../interfaces/navigation";
import {
  Movie,
  MoviesPlayingNow,
  Person,
  PopularMovies,
  TMDB,
  TV,
  UpcomingMovies,
} from "../interfaces/tmdb";
import { Search as SearchInterface } from "../interfaces/tmdb/search";

function reducer(
  state: any,
  action: {
    type: string;
    categoryIndex?: number;
    searchValue?: string;
  }
) {
  switch (action.type) {
    case "set-categoryIndex":
      return {
        ...state,
        categoryIndex: action.categoryIndex,
        searchValue: "",
      };
    case "set-searchValue":
      return {
        ...state,
        searchValue: action.searchValue,
      };
    default:
      return state;
  }
}

interface Props {
  navigation: CompositeNavigationProp<
    StackNavigationProp<Navigation.FindStackParamList, "Find">,
    BottomTabNavigationProp<Navigation.TabNavigationParamList, "FindTab">
  >;
  route: RouteProp<Navigation.FindStackParamList, "Find">;
}

export function ListLabel({ text, style }: { text: string; style?: any }) {
  return (
    <ThemedText
      style={{
        ...iOSUIKit.bodyEmphasizedObject,
        marginBottom: 8,
        ...style,
      }}
    >
      {text}
    </ThemedText>
  );
}

const key = "68991fbb0b75dba5ae0ecd8182e967b1";

async function getMovies({ pageParam = 1, queryKey }) {
  const { type, searchValue } = queryKey[1];

  const endpoints = {
    "Coming Soon": `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=${pageParam}&region=US`,
    "Now Playing": `https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=${pageParam}&region=US`,
    Popular: `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=${pageParam}&region=US`,
    Trending: `https://api.themoviedb.org/3/trending/movie/day?api_key=${key}&page=${pageParam}`,
    Search: `https://api.themoviedb.org/3/search/multi?api_key=${key}&language=en-US&query=${searchValue}&page=${pageParam}&include_adult=false&region=US`,
  };
  const response = await fetch(
    !searchValue ? endpoints[type] : endpoints.Search
  );
  const json: UpcomingMovies | MoviesPlayingNow | PopularMovies =
    await response.json();
  // return json;
  return {
    ...json,
    nextPage: json.page !== json.total_pages ? json.page + 1 : undefined,
  };
}

function Search({ navigation, route }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const [{ categoryIndex, searchValue }, dispatch] = useReducer(reducer, {
    categoryIndex: 0,
    searchValue: "",
  });

  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const { theme } = useContext(TabStackContext);
  const modalizeRef = useRef<Modalize>(null);
  const [game, setGame] = useState();
  const tabBarheight = useBottomTabBarHeight();
  const filterModalRef = useRef<Modalize>(null);
  const debouncedSearch = useDebounce(searchValue, 400);
  const [option, setOption] = useState<
    "Coming Soon" | "Now Playing" | "Popular" | "Trending"
  >("Coming Soon");

  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isPreviousData,
  } = useInfiniteQuery(
    [
      "movies",
      {
        type: option,
        searchValue: debouncedSearch,
      },
    ],
    getMovies,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      select: (movieData) => movieData.pages.flatMap((page) => page.results),
      keepPreviousData: true,
    }
  );

  const { data: games, isPreviousData: isPreviousGamesData } = useQuery(
    ["games", { searchValue: debouncedSearch }],
    getGames,
    { keepPreviousData: true }
  );

  useEffect(() => {
    // Open GamePlatformPicker if game is changed
    modalizeRef.current?.open();
  }, [game]);

  useEffect(() => {
    filterModalRef.current?.close();
    if (movies) {
      scrollRef.current?.scrollToIndex({ index: 0 });
    }
  }, [option]);

  // const scrollIndicatorInsets =
  //   Platform.OS === "ios" ? { bottom: tabBarheight - 16 } : undefined;

  function filteredMovies() {
    if (debouncedSearch) {
      return movies.filter((movie) => movie.media_type === "movie");
    } else {
      if (option == "Coming Soon") {
        return movies?.filter((movie) => {
          return movie.release_date
            ? DateTime.fromFormat(movie?.release_date, "yyyy-MM-dd") >=
                DateTime.now()
            : null;
        });
        // return movies;
      } else {
        return movies;
      }
    }
  }

  const styles = StyleSheet.create({
    flatlistContentContainer: {
      marginHorizontal: 16,
      // paddingBottom: Platform.OS === "ios" ? tabBarheight : undefined,
    },
    flatlistColumnWrapper: {
      justifyContent: "space-between",
      marginBottom: 16,
    },
  });

  return (
    <>
      <SafeAreaView
        style={{ backgroundColor: theme === "dark" ? "black" : "white" }}
      >
        <CategoryControl
          buttons={["Movies", "Games"]}
          categoryIndex={categoryIndex}
          handleCategoryChange={(index) =>
            dispatch({ type: "set-categoryIndex", categoryIndex: index })
          }
        />
      </SafeAreaView>
      <SearchBar
        cancelIcon={{ color: "white" }}
        clearIcon={Platform.OS === "android" ? { color: "white" } : undefined}
        containerStyle={
          theme === "dark"
            ? {
                backgroundColor: "black",
                marginHorizontal: Platform.OS === "ios" ? 8 : 16,
                paddingVertical: 16,
              }
            : { marginHorizontal: 8 }
        }
        inputContainerStyle={
          theme === "dark"
            ? Platform.OS === "android"
              ? {
                  backgroundColor: "rgb(28, 28, 31)",
                  height: 36,
                  borderRadius: 8,
                }
              : { backgroundColor: "rgb(28, 28, 31)", height: 36 }
            : {}
        }
        // placeholderTextColor={theme === "dark" ? "#999999" : undefined}
        placeholderTextColor={
          theme === "dark" ? "rgb(141, 142, 146)" : undefined
        }
        // searchIcon={theme === "dark" ? { color: "#999999" } : {}}
        searchIcon={theme === "dark" ? { color: "rgb(149, 153, 162)" } : {}}
        // inputStyle={theme === "dark" ? { color: "white" } : {}}
        leftIconContainerStyle={{ marginLeft: 6 }}
        inputStyle={
          theme === "dark" ? { ...iOSUIKit.bodyWhiteObject, marginLeft: 0 } : {}
        }
        cancelButtonProps={
          theme === "dark"
            ? {
                buttonTextStyle: {
                  color: iOSColors.blue,
                  fontSize: iOSUIKit.bodyObject.fontSize,
                  lineHeight: iOSUIKit.bodyObject.lineHeight,
                },
              }
            : {}
        }
        placeholder={categoryIndex === 0 ? "Movies & People" : "Search"}
        onChangeText={(text) =>
          dispatch({ type: "set-searchValue", searchValue: text })
        }
        value={searchValue}
        platform={Platform.OS === "ios" ? "ios" : "android"}
      />

      {!debouncedSearch && (
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ListLabel
            text={categoryIndex === 0 ? option : "Coming Soon"}
            style={{ marginBottom: 0 }}
          />
          {categoryIndex === 0 && (
            <Pressable onPress={() => filterModalRef.current?.open()}>
              <Text style={[iOSUIKit.body, { color: iOSColors.blue }]}>
                More
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Hiding list while loading prevents crashing caused by scrollToIndex firing before data is loaded, especially for TV data */}
      {categoryIndex === 0 && (
        <>
          {!isPreviousData ? (
            <KeyboardAwareFlatList
              extraScrollHeight={tabBarheight}
              viewIsInsideTabBar={true}
              enableResetScrollToCoords={false}
              data={filteredMovies()}
              renderItem={({ item }) => (
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
              contentContainerStyle={styles.flatlistContentContainer}
              columnWrapperStyle={styles.flatlistColumnWrapper}
              ref={scrollRef}
              keyExtractor={(item) => item.id.toString()}
              initialNumToRender={6}
              // scrollIndicatorInsets={scrollIndicatorInsets}
              showsVerticalScrollIndicator={false}
              onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
              onEndReachedThreshold={1.5}
              ListHeaderComponent={
                debouncedSearch ? (
                  <>
                    {(movies as TMDB.Search.MultiSearchResult[]).filter(
                      (movie) => movie.media_type === "person"
                    ).length > 0 && (
                      <>
                        <ListLabel text="People" />
                        <FlatList
                          keyExtractor={(item) => item.id.toString()}
                          data={movies.filter(
                            (movie) => movie.media_type === "person"
                          )}
                          renderItem={(person) => (
                            <SearchPerson
                              navigation={navigation}
                              person={person.item}
                            />
                          )}
                          horizontal={true}
                          contentContainerStyle={{
                            marginBottom: 16,
                            paddingRight: 16,
                          }}
                          style={{
                            marginHorizontal: -16,
                            paddingHorizontal: 16,
                          }}
                          showsHorizontalScrollIndicator={false}
                        />
                      </>
                    )}
                    {movies.filter((movie) => movie.media_type === "movie")
                      .length > 0 && <ListLabel text="Movies" />}
                  </>
                ) : null
              }
            />
          ) : (
            <LoadingScreen />
          )}
          <MovieSearchModal
            navigation={navigation}
            filterModalRef={filterModalRef}
            selectedOption={option}
            setSelectedOption={(option) => setOption(option)}
          />
        </>
      )}
      {categoryIndex === 1 &&
        (!isPreviousGamesData ? (
          <GameContext.Provider value={{ game, setGame }}>
            <KeyboardAwareFlatList
              extraScrollHeight={tabBarheight}
              viewIsInsideTabBar={true}
              enableResetScrollToCoords={false}
              data={games}
              renderItem={({ item }: { item: IGDB.Game.Game }) => (
                <Pressable
                  onPress={() => navigation.push("Game", { game: item })}
                >
                  <GamePoster item={item} />
                </Pressable>
              )}
              numColumns={2}
              contentContainerStyle={styles.flatlistContentContainer}
              columnWrapperStyle={styles.flatlistColumnWrapper}
              ref={scrollRef}
              keyExtractor={(item) => item.id.toString()}
              initialNumToRender={6}
              // scrollIndicatorInsets={scrollIndicatorInsets}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                debouncedSearch ? (
                  <ListLabel text="Games" style={{ marginBottom: 16 }} />
                ) : null
              }
            />
            <GameReleaseModal modalizeRef={modalizeRef} game={game} />
          </GameContext.Provider>
        ) : (
          <LoadingScreen />
        ))}
    </>
  );
}

export default Search;
