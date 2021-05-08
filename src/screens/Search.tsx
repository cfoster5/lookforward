import React, { useState, useEffect, useRef } from 'react';
import { View, Platform, FlatList, ColorSchemeName, ActivityIndicator } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { getUpcomingMovies, searchMovies, getUpcomingGameReleases, searchGames, getUpcomingTVPremieres, getShowSearch, getShowDetails } from '../helpers/requests';
import { IGDB, Navigation, TMDB, Trakt } from '../../types';
import Poster from '../components/Poster';
import usePrevious, { convertReleasesToGames } from '../helpers/helpers';
import { RouteProp, useScrollToTop } from '@react-navigation/native';
import CategoryControl from '../components/CategoryControl';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, 'Find'>,
  route: RouteProp<Navigation.FindStackParamList, 'Find'>,
  countdownMovies: any,
  showSubs: any,
  colorScheme: ColorSchemeName
}

function Search({ navigation, route, countdownMovies, showSubs, colorScheme }: Props) {
  const [searchValue, setSearchValue] = useState("")
  const [movies, setMovies] = useState<TMDB.Movie.Movie[]>([])
  const [initMovies, setInitMovies] = useState<TMDB.Movie.Movie[]>([])
  const [games, setGames] = useState<IGDB.Game.Game[]>([])
  const [initGames, setInitGames] = useState<IGDB.Game.Game[]>([])
  const [categoryIndex, setCategoryIndex] = useState(0)
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const prevCategoryIndex = usePrevious(categoryIndex);
  const [shows, setShows] = useState<Trakt.ShowPremiere[] | Trakt.ShowSearch[]>([]);
  const [initShows, setInitShows] = useState<Trakt.ShowPremiere[]>([]);

  useEffect(() => {
    let isMounted = true;
    getUpcomingMovies().then(movies => {
      if (isMounted) {
        setInitMovies(movies);
        setMovies(movies);
      };
    })
    getUpcomingGameReleases(route.params.igdbCreds.access_token).then(async releaseDates => {
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

    getUpcomingTVPremieres().then(premieres => {
      for (const premiere of premieres) {
        if (premiere.show.ids.tmdb) {
          getShowDetails(premiere.show.ids.tmdb).then(show => {
            premiere.show.tmdbData = show;
          })
            .catch(err => console.log(`err`, err));
        }
      }
      if (isMounted) {
        setInitShows(premieres);
        setShows(premieres)
      }
    })

    return () => { isMounted = false };
  }, [])

  useEffect(() => {
    // Condition eliminates flash when data is reset
    if (categoryIndex !== 0) { setMovies(initMovies) };
    if (categoryIndex !== 1) { setShows(initShows) };
    if (categoryIndex !== 2) { setGames(initGames) };
    setSearchValue("");

    // Scroll to top on category change; Only after setting initial value
    if (prevCategoryIndex !== undefined && prevCategoryIndex !== categoryIndex) {
      scrollRef?.current?.scrollToIndex({
        index: 0,
        animated: false
      })
    }
  }, [categoryIndex])

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

  async function getMergedShowSearchData() {
    const results = await getShowSearch(searchValue);
    // Using for ... of... instead of forEach fixes issue with shows being returned before additional data is retrieved/set
    for (const result of results) {
      if (result.show.ids.tmdb) {
        // TODO: Should this only get poster data from TMDB or do we need the other data?
        const data = await getShowDetails(result.show.ids.tmdb);
        result.show.tmdbData = data;
      }
    }
    return results;
  }

  function renderItem({ item }: { item: TMDB.Movie.Movie | Trakt.ShowPremiere | Trakt.ShowSearch | IGDB.Game.Game }) {
    let mediaType: "movie" | "tv" | "game" = "movie";
    if (categoryIndex === 0) { mediaType = "movie" };
    if (categoryIndex === 1) { mediaType = "tv" };
    if (categoryIndex === 2) { mediaType = "game" };

    let inCountdown = false;
    if (categoryIndex === 0) { inCountdown = countdownMovies.some((movie: TMDB.Movie.Movie) => movie.id === (item as TMDB.Movie.Movie).id) };
    if (categoryIndex === 1) { inCountdown = showSubs.some((premiere: Trakt.ShowPremiere) => premiere.show.ids.trakt === (item as Trakt.ShowPremiere).show.ids.trakt) };

    return (
      <Poster
        navigation={navigation}
        mediaType={mediaType}
        data={item}
        inCountdown={inCountdown}
        uid={route.params.uid}
        colorScheme={colorScheme}
      />
    )
  };

  function reinitialize() {
    if (categoryIndex === 0) { setMovies(initMovies) }
    if (categoryIndex === 1) { setShows(initShows) }
    if (categoryIndex === 2) { setGames(initGames) }
  }

  function setData() {
    if (categoryIndex === 0) { return movies };
    if (categoryIndex === 1) { return shows };
    if (categoryIndex === 2) { return games };
  }

  return (
    <>
      <View style={{ backgroundColor: colorScheme === "dark" ? "black" : "white" }}>
        <CategoryControl
          buttons={['Movies', 'TV', 'Games']}
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
              setShows([]);
              setShows(await getMergedShowSearchData());
            }
            if (categoryIndex === 2) {
              setGames([]);
              setGames(await searchGames(route.params.igdbCreds.access_token, searchValue));
            }
          } : undefined}
          onClear={reinitialize}
          onCancel={reinitialize}
        />
      </View>

      {/* Hiding list while loading prevents crashing caused by scrollToIndex firing before data is loaded, especially for TV data */}
      {((categoryIndex === 0 && movies.length > 0) || (categoryIndex === 1 && shows.length > 0) || (categoryIndex === 2 && games.length > 0))
        ? <FlatList
          data={setData()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{ marginHorizontal: 16 }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          ref={scrollRef}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={6}
        />
        : <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      }
    </>
  );
};

export default Search;
