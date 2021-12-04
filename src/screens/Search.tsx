import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { Modalize } from "react-native-modalize";
import { iOSColors, iOSUIKit } from "react-native-typography";
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

import CategoryControl from "../components/CategoryControl";
import GameReleaseModal from "../components/GamePlatformPicker";
import MovieSearchModal from "../components/MovieSearchModal";
import { NewPoster } from "../components/NewPoster";
import SearchPerson from "../components/SearchPerson";
import { Text as ThemedText } from "../components/Themed";
import GameContext from "../contexts/GamePlatformPickerContexts";
import MovieSearchFilterContext from "../contexts/MovieSearchFilterContexts";
import TabStackContext from "../contexts/TabStackContext";
import { convertReleasesToGames } from "../helpers/helpers";
import { getUpcomingGameReleases, searchGames } from "../helpers/igdbRequests";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTrendingMovies,
  getUpcomingMovies,
  searchMovies,
} from "../helpers/tmdbRequests";
import { IGDB } from "../interfaces/igdb";
import { Navigation } from "../interfaces/navigation";
import { TMDB } from "../interfaces/tmdb";

interface Props {
  navigation: CompositeNavigationProp<
    StackNavigationProp<Navigation.FindStackParamList, "Find">,
    BottomTabNavigationProp<Navigation.TabNavigationParamList, "FindTab">
  >;
  route: RouteProp<Navigation.FindStackParamList, "Find">;
}

function Search({ navigation, route }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState<
    (TMDB.BaseMovie | TMDB.Search.MultiSearchResult | TMDB.Trending.Movie)[]
  >([]);
  const [initMovies, setInitMovies] = useState<TMDB.BaseMovie[]>([]);
  const [games, setGames] = useState<IGDB.Game.Game[]>([]);
  const [initGames, setInitGames] = useState<IGDB.Game.Game[]>([]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const { theme } = useContext(TabStackContext);
  const modalizeRef = useRef<Modalize>(null);
  const [game, setGame] = useState();
  const tabBarheight = useBottomTabBarHeight();
  const [triggeredSearch, setTriggeredSearch] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const filterModalRef = useRef<Modalize>(null);
  const [selectedOption, setSelectedOption] = useState("Coming Soon");

  const styles = StyleSheet.create({
    flatlistContentContainer: {
      marginHorizontal: 16,
      paddingBottom: Platform.OS === "ios" ? tabBarheight : undefined,
    },
    flatlistColumnWrapper: {
      justifyContent: "space-between",
      marginBottom: 16,
    },
  });

  useEffect(() => {
    let isMounted = true;
    // getUpcomingMovies().then(movies => {
    //   if (isMounted) {
    //     setInitMovies(movies);
    //     setMovies(movies);
    //   };
    // })
    // let tempMovies: TMDB.Movie.Movie[] = [];
    // getUpcomingMovies().then(json => {
    //   tempMovies = [...tempMovies, ...json.results];
    //   for (let pageIndex = 2; pageIndex <= json.total_pages; pageIndex++) {
    //     getUpcomingMovies(pageIndex).then(json => {
    //       tempMovies = [...tempMovies, ...json.results];
    //       if (isMounted) {
    //         setInitMovies(tempMovies);
    //         setMovies(tempMovies);
    //       };
    //     })
    //   }
    // });

    getUpcomingGameReleases()
      .then(async (releaseDates) => {
        await convertReleasesToGames(releaseDates)
          .then((games) => {
            if (isMounted) {
              setInitGames(games);
              setGames(games);
            }
          })
          .catch((error) => {
            console.log("error 1", error);
          });
      })
      .catch((error) => {
        console.log("error 2", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Condition eliminates flash when data is reset
    if (categoryIndex === 1) {
      setMovies(initMovies);
    }
    if (categoryIndex === 0) {
      setGames(initGames);
    }
    setSearchValue("");

    setTriggeredSearch(false);
  }, [categoryIndex]);

  useEffect(() => {
    // Open GamePlatformPicker if game is changed
    modalizeRef.current?.open();
  }, [game]);

  useEffect(() => {
    setPageIndex(1);
  }, [triggeredSearch]);

  async function getMovies() {
    let json = await searchMovies(searchValue);
    setMovies(
      json.results.sort((a, b) => {
        return b.popularity - a.popularity;
      })
    );
  }

  useEffect(() => {
    if (pageIndex > 1 && triggeredSearch) {
      searchMovies(searchValue, pageIndex).then((json) => {
        setMovies([...movies, ...json.results]);
      });
    }
    if (pageIndex > 1 && !triggeredSearch && selectedOption === "Coming Soon") {
      getUpcomingMovies(pageIndex).then((json) => {
        setInitMovies([...initMovies, ...json.results]);
        setMovies([...movies, ...json.results]);
      });
    }
    if (pageIndex > 1 && !triggeredSearch && selectedOption === "Now Playing") {
      getNowPlayingMovies(pageIndex).then((json) => {
        setInitMovies([...initMovies, ...json.results]);
        setMovies([...movies, ...json.results]);
      });
    }
    if (pageIndex > 1 && !triggeredSearch && selectedOption === "Popular") {
      getPopularMovies(pageIndex).then((json) => {
        setInitMovies([...initMovies, ...json.results]);
        setMovies([...movies, ...json.results]);
      });
    }
    if (pageIndex > 1 && !triggeredSearch && selectedOption === "Trending") {
      getTrendingMovies(pageIndex).then((json) => {
        setInitMovies([...initMovies, ...json.results]);
        setMovies([...movies, ...json.results]);
      });
    }
  }, [pageIndex]);

  function reinitialize() {
    if (categoryIndex === 0) {
      setMovies(initMovies);
      setTriggeredSearch(false);
    }
    if (categoryIndex === 1) {
      setGames(initGames);
    }
  }

  useEffect(() => {
    setPageIndex(1);
    setInitMovies([]);
    setMovies([]);
    filterModalRef.current?.close();
    if (selectedOption === "Coming Soon") {
      getUpcomingMovies().then((json) => {
        setInitMovies(json.results);
        setMovies(json.results);
      });
    }
    if (selectedOption === "Now Playing") {
      getNowPlayingMovies().then((json) => {
        setInitMovies(json.results);
        setMovies(json.results);
      });
    }
    if (selectedOption === "Popular") {
      getPopularMovies().then((json) => {
        setInitMovies(json.results);
        setMovies(json.results);
      });
    }
    // if (selectedOption === "Top Rated") {
    //   getTopRatedMovies().then(json => { setInitMovies(json); setMovies(json) });
    // }
    if (selectedOption === "Trending") {
      getTrendingMovies().then((json) => {
        setInitMovies(json.results);
        setMovies(json.results);
      });
    }
  }, [selectedOption]);

  const scrollIndicatorInsets =
    Platform.OS === "ios" ? { bottom: tabBarheight - 16 } : undefined;

  return (
    <>
      <SafeAreaView
        style={{ backgroundColor: theme === "dark" ? "black" : "white" }}
      >
        <CategoryControl
          buttons={["Movies", "Games"]}
          categoryIndex={categoryIndex}
          handleCategoryChange={(index) => setCategoryIndex(index)}
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
                },
              }
            : {}
        }
        placeholder={categoryIndex === 0 ? "Movies & People" : "Search"}
        onChangeText={(value) => setSearchValue(value)}
        value={searchValue}
        platform={Platform.OS === "ios" ? "ios" : "android"}
        onSubmitEditing={
          searchValue
            ? async () => {
                if (categoryIndex === 0) {
                  setTriggeredSearch(true);
                  setMovies([]);
                  getMovies();
                }
                if (categoryIndex === 1) {
                  setGames([]);
                  setGames(await searchGames(searchValue));
                }
              }
            : undefined
        }
        onClear={reinitialize}
        onCancel={reinitialize}
      />

      {/* Hiding list while loading prevents crashing caused by scrollToIndex firing before data is loaded, especially for TV data */}
      {categoryIndex === 0 && (
        <MovieSearchFilterContext.Provider
          value={{ selectedOption, setSelectedOption }}
        >
          {movies.length > 0 ? (
            <FlatList
              data={
                triggeredSearch
                  ? movies.filter((movie) => movie.media_type === "movie")
                  : initMovies
              }
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => navigation.push("Details", { movie: item })}
                >
                  <NewPoster movie={item} />
                </Pressable>
              )}
              numColumns={2}
              contentContainerStyle={styles.flatlistContentContainer}
              columnWrapperStyle={styles.flatlistColumnWrapper}
              ref={scrollRef}
              keyExtractor={(item, index) => item.id.toString()}
              initialNumToRender={6}
              scrollIndicatorInsets={scrollIndicatorInsets}
              onEndReached={({ distanceFromEnd }) =>
                setPageIndex(pageIndex + 1)
              }
              onEndReachedThreshold={4}
              ListHeaderComponent={
                triggeredSearch ? (
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
                ) : (
                  <View
                    style={{
                      flex: 1,
                      marginBottom: 16,
                      flexDirection: "row",
                      flexWrap: "nowrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListLabel
                      text={selectedOption}
                      style={{ marginBottom: 0 }}
                    />
                    <Pressable onPress={() => filterModalRef.current?.open()}>
                      <Text
                        style={{
                          ...iOSUIKit.bodyObject,
                          color: iOSColors.blue,
                        }}
                      >
                        More
                      </Text>
                    </Pressable>
                  </View>
                )
              }
            />
          ) : (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" />
            </View>
          )}
          <MovieSearchModal
            navigation={navigation}
            filterModalRef={filterModalRef}
            selectedOption={selectedOption}
          />
        </MovieSearchFilterContext.Provider>
      )}
      {categoryIndex === 1 &&
        (games.length > 0 ? (
          <GameContext.Provider value={{ game, setGame }}>
            <FlatList
              data={games}
              renderItem={({ item }: { item: IGDB.Game.Game }) => (
                <Pressable
                  onPress={() => navigation.push("Details", { game: item })}
                >
                  <NewPoster game={item} />
                </Pressable>
              )}
              numColumns={2}
              contentContainerStyle={styles.flatlistContentContainer}
              columnWrapperStyle={styles.flatlistColumnWrapper}
              ref={scrollRef}
              keyExtractor={(item, index) => item.id.toString()}
              initialNumToRender={6}
              scrollIndicatorInsets={scrollIndicatorInsets}
              ListHeaderComponent={
                <ListLabel text="Coming Soon" style={{ marginBottom: 16 }} />
              }
            />
            <GameReleaseModal modalizeRef={modalizeRef} game={game} />
          </GameContext.Provider>
        ) : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        ))}
    </>
  );

  function ListLabel({ text, style }: { text: string; style?: any }) {
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
}

export default Search;
