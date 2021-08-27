import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Platform, FlatList, ActivityIndicator, Text, SafeAreaView, Pressable } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { getUpcomingMovies, searchMovies, getUpcomingGameReleases, searchGames, getPopularPeople, getTrendingMovies, getPopularMovies, getNowPlayingMovies } from '../helpers/requests';
import { IGDB } from '../interfaces/igdb';
import Poster from '../components/Poster';
import usePrevious, { convertReleasesToGames } from '../helpers/helpers';
import { RouteProp, useScrollToTop } from '@react-navigation/native';
import CategoryControl from '../components/CategoryControl';
import { StackNavigationProp } from '@react-navigation/stack';
import ThemeContext from '../contexts/ThemeContext';
import GameContext from '../contexts/GamePlatformPickerContexts';
import GameReleaseModal from '../components/GamePlatformPicker';
import { Modalize } from 'react-native-modalize';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import SearchPerson from '../components/SearchPerson';
import MovieSearchModal from '../components/MovieSearchModal';
import MovieSearchFilterContext from '../contexts/MovieSearchFilterContexts';
import { Navigation } from '../interfaces/navigation';
import { TMDB } from '../interfaces/tmdb';

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, 'Find'>,
  route: RouteProp<Navigation.FindStackParamList, 'Find'>,
}

function Search({ navigation, route }: Props) {
  const [searchValue, setSearchValue] = useState("")
  const [movies, setMovies] = useState<TMDB.Movie.Movie[]>([])
  const [initMovies, setInitMovies] = useState<TMDB.Movie.Movie[]>([])
  const [games, setGames] = useState<IGDB.Game.Game[]>([])
  const [initGames, setInitGames] = useState<IGDB.Game.Game[]>([])
  const [categoryIndex, setCategoryIndex] = useState(0)
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const prevCategoryIndex = usePrevious(categoryIndex);
  const colorScheme = useContext(ThemeContext)
  const modalizeRef = useRef<Modalize>(null)
  const [game, setGame] = useState();
  const tabBarheight = useBottomTabBarHeight();
  const [triggeredSearch, setTriggeredSearch] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const filterModalRef = useRef<Modalize>(null);
  const [selectedOption, setSelectedOption] = useState("Coming Soon");

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

    getUpcomingGameReleases().then(async releaseDates => {
      await convertReleasesToGames(releaseDates).then(games => {
        if (isMounted) {
          setInitGames(games);
          setGames(games);
        }
      })
        .catch(error => {
          console.log("error 1", error)
        })
    })
      .catch(error => {
        console.log("error 2", error)
      })

    return () => { isMounted = false };
  }, [])

  useEffect(() => {
    // Condition eliminates flash when data is reset
    if (prevCategoryIndex === 0) { setMovies(initMovies) };
    if (prevCategoryIndex === 1) { setGames(initGames) };
    setSearchValue("");

    // Scroll to top on category change; Only after setting initial value
    // I don't think this is needed after splitting results into 3 separate flatlists
    // if (prevCategoryIndex !== undefined && prevCategoryIndex !== categoryIndex) {
    //   scrollRef?.current?.scrollToIndex({
    //     index: 0,
    //     animated: false
    //   })
    // }

    setTriggeredSearch(false);
  }, [categoryIndex])

  useEffect(() => {
    // Open GamePlatformPicker if game is changed
    modalizeRef.current?.open()
  }, [game])

  useEffect(() => {
    setPageIndex(1);
  }, [triggeredSearch])

  async function getMovies() {
    let json = await searchMovies(searchValue);
    setMovies(json.results.sort((a, b) => {
      return b.popularity - a.popularity;
    }));
  }

  useEffect(() => {
    if (pageIndex > 1 && triggeredSearch) {
      searchMovies(searchValue, pageIndex).then(json => {
        setMovies([...movies, ...json.results]);
      })
    }
    if (pageIndex > 1 && !triggeredSearch && selectedOption === "Coming Soon") {
      getUpcomingMovies(pageIndex).then(json => {
        setInitMovies([...initMovies, ...json.results]);
        setMovies([...movies, ...json.results]);
      })
    }
    if (pageIndex > 1 && !triggeredSearch && selectedOption === "Now Playing") {
      getNowPlayingMovies(pageIndex).then(json => {
        setInitMovies([...initMovies, ...json.results]);
        setMovies([...movies, ...json.results]);
      })
    }
    if (pageIndex > 1 && !triggeredSearch && selectedOption === "Popular") {
      getPopularMovies(pageIndex).then(json => {
        setInitMovies([...initMovies, ...json.results]);
        setMovies([...movies, ...json.results]);
      })
    }
    if (pageIndex > 1 && !triggeredSearch && selectedOption === "Trending") {
      getTrendingMovies(pageIndex).then(json => {
        setInitMovies([...initMovies, ...json.results]);
        setMovies([...movies, ...json.results]);
      })
    }
  }, [pageIndex])

  function reinitialize() {
    if (categoryIndex === 0) { setMovies(initMovies); setTriggeredSearch(false); }
    if (categoryIndex === 1) { setGames(initGames) }
  }

  useEffect(() => {
    setPageIndex(1);
    setInitMovies([]);
    setMovies([]);
    filterModalRef.current?.close();
    if (selectedOption === "Coming Soon") {
      getUpcomingMovies().then(json => { setInitMovies(json.results); setMovies(json.results); });
    }
    if (selectedOption === "Now Playing") {
      getNowPlayingMovies().then(json => { setInitMovies(json.results); setMovies(json.results); });
    }
    if (selectedOption === "Popular") {
      getPopularMovies().then(json => { setInitMovies(json.results); setMovies(json.results); });
    }
    // if (selectedOption === "Top Rated") {
    //   getTopRatedMovies().then(json => { setInitMovies(json); setMovies(json) });
    // }
    if (selectedOption === "Trending") {
      getTrendingMovies().then(json => { setInitMovies(json.results); setMovies(json.results); });
    }
  }, [selectedOption])

  return (
    <>
      <SafeAreaView style={{ backgroundColor: colorScheme === "dark" ? "black" : "white" }}>
        <CategoryControl
          buttons={['Movies', 'Games']}
          categoryIndex={categoryIndex}
          handleCategoryChange={index => setCategoryIndex(index)}
        />
      </SafeAreaView>
      <View style={{ backgroundColor: colorScheme === "dark" ? "black" : "white" }}>
        <SearchBar
          cancelIcon={{ color: "white" }}
          clearIcon={Platform.OS === "android" ? { color: "white" } : undefined}
          containerStyle={colorScheme === "dark" ? { backgroundColor: "black", marginHorizontal: Platform.OS === "ios" ? 8 : 16, paddingVertical: 16 } : { marginHorizontal: 8 }}
          inputContainerStyle={colorScheme === "dark" ? (Platform.OS === "android" ? { backgroundColor: "rgb(28, 28, 31)", height: 36, borderRadius: 8 } : { backgroundColor: "rgb(28, 28, 31)", height: 36 }) : {}}
          // placeholderTextColor={colorScheme === "dark" ? "#999999" : undefined}
          placeholderTextColor={colorScheme === "dark" ? "rgb(141, 142, 146)" : undefined}
          // searchIcon={colorScheme === "dark" ? { color: "#999999" } : {}}
          searchIcon={colorScheme === "dark" ? { color: "rgb(149, 153, 162)" } : {}}
          // inputStyle={colorScheme === "dark" ? { color: "white" } : {}}
          leftIconContainerStyle={{ marginLeft: 6 }}
          inputStyle={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, marginLeft: 0 } : {}}
          cancelButtonProps={colorScheme === "dark" ? { buttonTextStyle: { color: iOSColors.blue, fontSize: iOSUIKit.bodyObject.fontSize } } : {}}
          placeholder={categoryIndex === 0 ? "Movies & People" : "Search"}
          onChangeText={value => setSearchValue(value)}
          value={searchValue}
          platform={Platform.OS === "ios" ? "ios" : "android"}
          onSubmitEditing={searchValue ? async () => {
            if (categoryIndex === 0) {
              setTriggeredSearch(true);
              setMovies([]);
              getMovies();
            }
            if (categoryIndex === 1) {
              setGames([]);
              setGames(await searchGames(searchValue));
            }
          } : undefined}
          onClear={reinitialize}
          onCancel={reinitialize}
        />
      </View>

      {/* Hiding list while loading prevents crashing caused by scrollToIndex firing before data is loaded, especially for TV data */}
      {categoryIndex === 0 &&
        <MovieSearchFilterContext.Provider value={{ selectedOption, setSelectedOption }}>
          {movies.length > 0
            ?
            <FlatList
              data={triggeredSearch ? movies.filter(movie => movie.media_type === "movie") : initMovies}
              renderItem={({ item }: { item: TMDB.Movie.Movie }) => (
                <Poster
                  navigation={navigation}
                  data={item}
                  categoryIndex={categoryIndex}
                />
              )}
              numColumns={2}
              contentContainerStyle={{ marginHorizontal: 16, paddingBottom: Platform.OS === "ios" ? tabBarheight : undefined }}
              columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
              ref={scrollRef}
              keyExtractor={(item, index) => item.id.toString()}
              initialNumToRender={6}
              scrollIndicatorInsets={Platform.OS === "ios" ? { bottom: tabBarheight - 16 } : undefined}
              onEndReached={({ distanceFromEnd }) => setPageIndex(pageIndex + 1)}
              onEndReachedThreshold={4}
              ListHeaderComponent={
                <>
                  {triggeredSearch &&
                    <>
                      {movies.filter(movie => movie.media_type === "person").length > 0 &&
                        <>
                          <Text style={{ ...iOSUIKit.bodyEmphasizedWhiteObject, marginBottom: 8 }}>People</Text>
                          <FlatList
                            keyExtractor={item => item.id.toString()}
                            data={movies.filter(movie => movie.media_type === "person")}
                            renderItem={person => <SearchPerson navigation={navigation} person={person.item} />}
                            horizontal={true}
                            contentContainerStyle={{ marginBottom: 16, paddingRight: 16 }}
                            style={{ marginHorizontal: -16, paddingHorizontal: 16 }}
                            showsHorizontalScrollIndicator={false}
                          />
                        </>
                      }
                      {movies.filter(movie => movie.media_type === "movie").length > 0 &&
                        <Text style={{ ...iOSUIKit.bodyEmphasizedWhiteObject, marginBottom: 8 }}>Movies</Text>
                      }
                    </>
                  }
                  {!triggeredSearch &&
                    <View
                      style={{
                        flex: 1,
                        marginBottom: 16,
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "space-between"
                      }}
                    >
                      <Text style={{ ...iOSUIKit.bodyEmphasizedWhiteObject }}>{selectedOption}</Text>
                      <Pressable onPress={() => filterModalRef.current?.open()}>
                        <Text style={{ ...iOSUIKit.bodyObject, color: iOSColors.blue }}>More</Text>
                      </Pressable>
                    </View>
                  }
                </>
              }
            />
            :
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" />
            </View>
          }
          <MovieSearchModal navigation={navigation} filterModalRef={filterModalRef} selectedOption={selectedOption} />
        </MovieSearchFilterContext.Provider>
      }
      {categoryIndex === 1 &&
        (
          games.length > 0
            ?
            <GameContext.Provider value={{ game, setGame }}>
              <FlatList
                data={games}
                renderItem={({ item }: { item: IGDB.Game.Game }) => (
                  <Poster
                    navigation={navigation}
                    data={item}
                    categoryIndex={categoryIndex}
                  />
                )}
                numColumns={2}
                contentContainerStyle={{ marginHorizontal: 16, paddingBottom: Platform.OS === "ios" ? tabBarheight : undefined }}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
                ref={scrollRef}
                keyExtractor={(item, index) => item.id.toString()}
                initialNumToRender={6}
                scrollIndicatorInsets={Platform.OS === "ios" ? { bottom: tabBarheight - 16 } : undefined}
                ListHeaderComponent={<Text style={{ ...iOSUIKit.bodyEmphasizedWhiteObject, marginBottom: 16 }}>Coming Soon</Text>}
              />
              <GameReleaseModal modalizeRef={modalizeRef} game={game} />
            </GameContext.Provider>
            :
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" />
            </View>
        )
      }
    </>
  );
};

export default Search;
