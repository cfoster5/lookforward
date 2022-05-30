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
import { DateTime } from "luxon";

import CategoryControl from "../components/CategoryControl";
import GameReleaseModal from "../components/GamePlatformPicker";
import { LoadingScreen } from "../components/LoadingScreen";
import MovieSearchModal from "../components/MovieSearchModal";
import { GamePoster } from "../components/Posters/GamePoster";
import { MoviePoster } from "../components/Posters/MoviePoster";
import SearchPerson from "../components/SearchPerson";
import { Text as ThemedText } from "../components/Themed";
import GameContext from "../contexts/GamePlatformPickerContexts";
import TabStackContext from "../contexts/TabStackContext";
import { convertReleasesToGames } from "../helpers/helpers";
import { searchGames } from "../helpers/igdbRequests";
import { useGetMovies } from "../hooks/useGetMovies";
import { IGDB } from "../interfaces/igdb";
import { Navigation } from "../interfaces/navigation";
import { TMDB } from "../interfaces/tmdb";
import { reducer } from "./reducer";
import { useGetUpcomingGameReleases } from "./useGetUpcomingGameReleases";

interface Props {
  navigation: CompositeNavigationProp<
    StackNavigationProp<Navigation.FindStackParamList, "Find">,
    BottomTabNavigationProp<Navigation.TabNavigationParamList, "FindTab">
  >;
  route: RouteProp<Navigation.FindStackParamList, "Find">;
}

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

function Search({ navigation, route }: Props) {
  const [
    {
      categoryIndex,
      searchValue,
      isSearchTriggered,
      page,
      initGames,
      games,
      option,
    },
    dispatch,
  ] = useReducer(reducer, {
    categoryIndex: 0,
    searchValue: "",
    isSearchTriggered: false,
    page: 1,
    initGames: [],
    games: [],
    option: "Coming Soon",
  });

  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const { theme } = useContext(TabStackContext);
  const modalizeRef = useRef<Modalize>(null);
  const [game, setGame] = useState();
  const tabBarheight = useBottomTabBarHeight();
  const filterModalRef = useRef<Modalize>(null);
  const gameReleaseDates = useGetUpcomingGameReleases();
  const { movies, loading } = useGetMovies(
    option,
    page,
    searchValue,
    isSearchTriggered
  );

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
    const games = convertReleasesToGames(gameReleaseDates);
    dispatch({ type: "set-initGames", initGames: games });
  }, [gameReleaseDates]);

  useEffect(() => {
    // Open GamePlatformPicker if game is changed
    modalizeRef.current?.open();
  }, [game]);

  function reinitialize() {
    console.log("reinit");
    if (categoryIndex === 0) {
      dispatch({ type: "set-isSearchTriggered", isSearchTriggered: false });
    }
    if (categoryIndex === 1) {
      dispatch({ type: "set-games", games: initGames });
    }
  }

  useEffect(() => {
    filterModalRef.current?.close();
  }, [option]);

  const scrollIndicatorInsets =
    Platform.OS === "ios" ? { bottom: tabBarheight - 16 } : undefined;

  async function handleSearch() {
    if (searchValue && categoryIndex === 0) {
      dispatch({
        type: "set-isSearchTriggered",
        isSearchTriggered: true,
      });
    }
    if (searchValue && categoryIndex === 1) {
      dispatch({ type: "set-games", games: [] });
      dispatch({
        type: "set-games",
        games: await searchGames(searchValue),
      });
    }
  }

  function filteredMovies() {
    if (isSearchTriggered) {
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
        onChangeText={(value) =>
          dispatch({ type: "set-searchValue", searchValue: value })
        }
        value={searchValue}
        platform={Platform.OS === "ios" ? "ios" : "android"}
        onSubmitEditing={handleSearch}
        onClear={reinitialize}
        onCancel={Platform.OS === "ios" ? reinitialize : () => undefined}
      />

      {((!isSearchTriggered && categoryIndex === 0) || categoryIndex === 1) && (
        <View
          style={{
            // flex: 1,
            marginHorizontal: 16,
            marginBottom: 16,
            flexDirection: "row",
            flexWrap: "nowrap",
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
                style={{
                  ...iOSUIKit.bodyObject,
                  color: iOSColors.blue,
                }}
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
          {!loading ? (
            <FlatList
              data={filteredMovies()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => navigation.push("Movie", { movie: item })}
                >
                  <MoviePoster movie={item} />
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
                dispatch({ type: "set-page", page: page + 1 })
              }
              onEndReachedThreshold={4}
              ListHeaderComponent={
                // isSearchTriggered ? (
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
              }
            />
          ) : (
            <LoadingScreen />
          )}
          <MovieSearchModal
            navigation={navigation}
            filterModalRef={filterModalRef}
            selectedOption={option}
            setSelectedOption={(option) =>
              dispatch({ type: "set-option", option: option })
            }
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
                  onPress={() => navigation.push("Game", { game: item })}
                >
                  <GamePoster item={item} />
                </Pressable>
              )}
              numColumns={2}
              contentContainerStyle={styles.flatlistContentContainer}
              columnWrapperStyle={styles.flatlistColumnWrapper}
              ref={scrollRef}
              keyExtractor={(item, index) => item.id.toString()}
              initialNumToRender={6}
              scrollIndicatorInsets={scrollIndicatorInsets}
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
