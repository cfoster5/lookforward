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

    async function getGames() {
      const releaseDates = await getUpcomingGameReleases();
      const games = await convertReleasesToGames(releaseDates);
      if (isMounted) {
        setInitGames(games);
        setGames(games);
      }
    }

    getGames();

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

  async function getMovieSearch() {
    let json = await searchMovies(searchValue);
    setMovies(
      json.results.sort((a, b) => {
        return b.popularity - a.popularity;
      })
    );
  }

  async function getMovies(method: Promise<any>) {
    const json = await method;
    setInitMovies([...initMovies, ...json.results]);
    setMovies([...movies, ...json.results]);
  }

  useEffect(() => {
    async function getData() {
      if (pageIndex > 1 && triggeredSearch) {
        const json = await searchMovies(searchValue, pageIndex);
        setMovies([...movies, ...json.results]);
      }
      if (pageIndex > 1 && !triggeredSearch) {
        if (selectedOption === "Coming Soon") {
          getMovies(getUpcomingMovies(pageIndex));
        }
        if (selectedOption === "Now Playing") {
          getMovies(getNowPlayingMovies(pageIndex));
        }
        if (selectedOption === "Popular") {
          getMovies(getPopularMovies(pageIndex));
        }
        if (selectedOption === "Trending") {
          getMovies(getTrendingMovies(pageIndex));
        }
      }
    }
    getData();
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
    async function getData() {
      if (selectedOption === "Coming Soon") {
        const json = await getUpcomingMovies();
        setInitMovies(json.results);
        setMovies(json.results);
      }
      if (selectedOption === "Now Playing") {
        const json = await getNowPlayingMovies();
        setInitMovies(json.results);
        setMovies(json.results);
      }
      if (selectedOption === "Popular") {
        const json = await getPopularMovies();
        setInitMovies(json.results);
        setMovies(json.results);
      }
      // if (selectedOption === "Top Rated") {
      //   getTopRatedMovies().then(json => { setInitMovies(json); setMovies(json) });
      // }
      if (selectedOption === "Trending") {
        const json = await getTrendingMovies();
        setInitMovies(json.results);
        setMovies(json.results);
      }
    }
    getData();
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
                  getMovieSearch();
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
        <>
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
            setSelectedOption={setSelectedOption}
          />
        </>
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
