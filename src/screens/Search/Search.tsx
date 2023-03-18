import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useScrollToTop } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CategoryControl from "components/CategoryControl/CategoryControl";
import { GamePlatformPicker } from "components/GamePlatformPicker";
import { LoadingScreen } from "components/LoadingScreen";
import { Poster } from "components/Poster";
import { GamePoster } from "components/Posters/GamePoster";
import { MoviePoster } from "components/Posters/MoviePoster";
import TabStackContext from "contexts/TabStackContext";
import { Movie, Person, TMDB, TV } from "interfaces/tmdb";
import { Search as SearchInterface } from "interfaces/tmdb/search";
import { DateTime } from "luxon";
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
  PlatformColor,
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
import { iOSUIKit } from "react-native-typography";

import { useGames } from "./api/getGames";
import { useMovieData } from "./api/getMovies";
import MovieSearchModal from "./components/MovieSearchModal";
import SearchPerson from "./components/SearchPerson";
import useDebounce from "./hooks/useDebounce";
import { MovieOption } from "./types";
import { ListLabel } from "../../components/ListLabel";

import { useStore } from "@/stores/store";
import {
  FindStackParamList,
  Game,
  ReleaseDate,
  TabNavigationParamList,
} from "@/types";

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

type FindScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParamList, "Find">,
  BottomTabScreenProps<TabNavigationParamList, "FindTab">
>;

function Search({ navigation, route }: FindScreenNavigationProp) {
  const { width: windowWidth } = useWindowDimensions();
  const [{ categoryIndex, searchValue }, dispatch] = useReducer(reducer, {
    categoryIndex: 0,
    searchValue: "",
  });

  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const { theme } = useContext(TabStackContext);
  const modalizeRef = useRef<Modalize>(null);
  const { game } = useStore();
  const tabBarheight = useBottomTabBarHeight();
  const filterModalRef = useRef<Modalize>(null);
  const debouncedSearch = useDebounce(searchValue, 400);
  const [option, setOption] = useState<MovieOption>("Coming Soon");

  const {
    data: movieData,
    fetchNextPage,
    hasNextPage,
    isPreviousData,
  } = useMovieData(option, debouncedSearch);

  const movies = movieData?.pages.flatMap((page) => page.results);

  useEffect(() => {
    // Manually get second page on load to fix cases where empty space is rendered before scrolling
    if (movieData?.pages.filter((page) => page.page === 2).length === 0) {
      fetchNextPage({ pageParam: 2 });
    }
  }, [movieData]);

  const { data: games, isPreviousData: isPreviousGamesData } =
    useGames(debouncedSearch);

  useEffect(() => {
    // Open GamePlatformPicker if game is changed
    modalizeRef.current?.open();
  }, [game]);

  useEffect(() => {
    filterModalRef.current?.close();
    // https://stackoverflow.com/a/64232399/5648619
    if (scrollRef !== null && scrollRef.current !== null && movies) {
      if (typeof scrollRef.current.scrollToIndex === "function") {
        scrollRef.current?.scrollToIndex({ index: 0 });
      }
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
        clearIcon={
          Platform.OS === "android"
            ? { color: "white" }
            : { color: PlatformColor("systemGray") }
        }
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
              : {
                  backgroundColor: PlatformColor("secondarySystemBackground"),
                  height: 36,
                }
            : {}
        }
        // placeholderTextColor={theme === "dark" ? "#999999" : undefined}
        placeholderTextColor={
          theme === "dark" ? PlatformColor("systemGray") : undefined
        }
        // searchIcon={theme === "dark" ? { color: "#999999" } : {}}
        searchIcon={
          theme === "dark" ? { color: PlatformColor("systemGray") } : {}
        }
        // inputStyle={theme === "dark" ? { color: "white" } : {}}
        leftIconContainerStyle={{ marginLeft: 6 }}
        inputStyle={
          theme === "dark" ? { ...iOSUIKit.bodyWhiteObject, marginLeft: 0 } : {}
        }
        cancelButtonProps={
          theme === "dark"
            ? {
                buttonTextStyle: {
                  color: PlatformColor("systemBlue"),
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
              <Text
                style={[iOSUIKit.body, { color: PlatformColor("systemBlue") }]}
              >
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
              viewIsInsideTabBar
              enableResetScrollToCoords={false}
              data={filteredMovies()}
              renderItem={({ item: movie }) => (
                // <MoviePoster
                //   pressHandler={() =>
                //     navigation.push("Movie", {
                //       movieId: item.id,
                //       movieTitle: item.title,
                //     })
                //   }
                //   movie={item}
                //   posterPath={item.poster_path}
                //   style={{
                //     width: windowWidth / 2 - 24,
                //     height: (windowWidth / 2 - 24) * 1.5,
                //   }}
                // />
                <Poster
                  handlePress={() =>
                    navigation.push("Movie", {
                      movieId: movie.id,
                      movieTitle: movie.title,
                    })
                  }
                  id={movie.id}
                  imageUrl={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : undefined
                  }
                  title={movie.title}
                  style={{ width: windowWidth / 2 - 24, aspectRatio: 2 / 3 }}
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
                          horizontal
                          style={{
                            marginHorizontal: -16,
                            marginBottom: 16,
                          }}
                          showsHorizontalScrollIndicator={false}
                          ListHeaderComponent={<View style={{ width: 16 }} />}
                          ItemSeparatorComponent={() => (
                            <View style={{ width: 16 }} />
                          )}
                          ListFooterComponent={<View style={{ width: 16 }} />}
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
          <>
            <KeyboardAwareFlatList
              extraScrollHeight={tabBarheight}
              viewIsInsideTabBar
              enableResetScrollToCoords={false}
              data={games}
              renderItem={({
                item: game,
              }: {
                item: Game & { release_dates: ReleaseDate[] };
              }) => (
                // <Pressable onPress={() => navigation.push("Game", { game })}>
                //   <GamePoster game={game} />
                // </Pressable>
                <Poster
                  handlePress={() => navigation.push("Game", { game })}
                  id={game.id}
                  imageUrl={
                    game.cover?.url
                      ? `https:${game.cover.url.replace(
                          "thumb",
                          "cover_big_2x"
                        )}`
                      : undefined
                  }
                  title={game.name}
                  style={{ width: windowWidth / 2 - 24, aspectRatio: 3 / 4 }}
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
              ListHeaderComponent={
                debouncedSearch ? (
                  <ListLabel text="Games" style={{ marginBottom: 16 }} />
                ) : null
              }
            />
            <GamePlatformPicker modalizeRef={modalizeRef} game={game} />
          </>
        ) : (
          <LoadingScreen />
        ))}
    </>
  );
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

export default Search;
