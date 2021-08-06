import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Platform, FlatList, ActivityIndicator } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { getUpcomingMovies, searchMovies, getUpcomingGameReleases, searchGames } from '../helpers/requests';
import { IGDB, Navigation, TMDB } from '../../types';
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

  useEffect(() => {
    let isMounted = true;
    getUpcomingMovies().then(movies => {
      if (isMounted) {
        setInitMovies(movies);
        setMovies(movies);
      };
    })
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
  }, [categoryIndex])

  useEffect(() => {
    // Open GamePlatformPicker if game is changed
    modalizeRef.current?.open()
  }, [game])

  function getMovies() {
    const date = new Date();
    const years = [date.getFullYear(), date.getFullYear() + 1, date.getFullYear() + 2, date.getFullYear() + 3];
    let tempMovies: TMDB.Movie.Movie[] = [];
    years.forEach(async year => {
      const searchData = await searchMovies(searchValue, year)
      tempMovies = [...tempMovies, ...searchData]
      // Updating state for each year, need to only update once 
      setMovies(tempMovies)
    });
  }

  function reinitialize() {
    if (categoryIndex === 0) { setMovies(initMovies) }
    if (categoryIndex === 1) { setGames(initGames) }
  }

  return (
    <>
      <View style={{ backgroundColor: colorScheme === "dark" ? "black" : "white" }}>
        <CategoryControl
          buttons={['Movies', 'Games']}
          categoryIndex={categoryIndex}
          handleCategoryChange={index => setCategoryIndex(index)}
        />
      </View>
      <View style={{ backgroundColor: colorScheme === "dark" ? "black" : "white" }}>
        <SearchBar
          cancelIcon={{ color: "white" }}
          clearIcon={Platform.OS === "android" ? { color: "white" } : undefined}
          containerStyle={colorScheme === "dark" ? { backgroundColor: "black", marginHorizontal: Platform.OS === "ios" ? 8 : 16 } : { marginHorizontal: 8 }}
          inputContainerStyle={colorScheme === "dark" ? { backgroundColor: "#1f1f1f" } : {}}
          placeholderTextColor={colorScheme === "dark" ? "#999999" : undefined}
          searchIcon={colorScheme === "dark" ? { color: "#999999" } : {}}
          inputStyle={colorScheme === "dark" ? { color: "white" } : {}}
          cancelButtonProps={colorScheme === "dark" ? { buttonTextStyle: { color: "#428cff" } } : {}}
          placeholder="Search"
          onChangeText={value => setSearchValue(value)}
          value={searchValue}
          platform={Platform.OS === "ios" ? "ios" : "android"}
          onSubmitEditing={searchValue ? async () => {
            if (categoryIndex === 0) {
              setMovies([]);
              getMovies()
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
        (
          movies.length > 0
            ?
            <FlatList
              data={movies}
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
            />
            :
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" />
            </View>
        )
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
