import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/stack';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons';
import { TMDB } from '../../types';
import Poster from '../components/Poster';
import ThemeContext from '../contexts/ThemeContext';
import { getDiscoverMovies, getMovieWatchProviders } from '../helpers/requests';

interface MovieWatchProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

function MovieDiscover({ route, navigation }: any) {
  const [movies, setMovies] = useState<TMDB.Movie.Movie[]>([]);
  const scrollRef = useRef<FlatList>(null);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [initHeaderHeight, setInitHeaderHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const [pageIndex, setPageIndex] = useState(1);
  const colorScheme = useContext(ThemeContext)
  const [sortMethod, setSortMethod] = useState("popularity.desc");
  const modalRef = useRef<Modalize>(null);
  const [movieWatchProviders, setMovieWatchProviders] = useState<MovieWatchProvider[]>([
    {
      display_priority: 0,
      logo_path: "",
      provider_id: 0,
      provider_name: "Any"
    }
  ]);
  const [selectedMovieWatchProvider, setSelectedMovieWatchProvider] = useState<number>(0);

  const sortOptions = [
    { actual: "popularity.desc", friendly: "Popularity", direction: "Down" },
    { actual: "release_date.desc", friendly: "Release Date", direction: "Down" },
    { actual: "vote_average.desc", friendly: "Average Score", direction: "Down" },
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
  ]

  const targetedProviders = [
    "Any",
    "Netflix",
    "Apple iTunes",
    "Apple TV Plus",
    "Amazon Prime Video",
    "Amazon Video",
    "Disney Plus",
    // "Starz",
    "Hulu",
    "HBO Max",
    // "Showtime",
    "Google Play Movies",
    "YouTube",
    "Microsoft Store",
    // "Paramount Plus"
  ]

  useEffect(() => {
    getMovieWatchProviders().then((json: { results: MovieWatchProvider[] }) => setMovieWatchProviders([...movieWatchProviders, ...json.results]))
  }, [])

  useEffect(() => {
    if (initHeaderHeight === 0) {
      setInitHeaderHeight(headerHeight);
    }
  }, [headerHeight])

  const IoniconsHeaderButton = (props: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<HeaderButton> & Readonly<HeaderButtonProps> & Readonly<any>) => (
    // the `props` here come from <Item ... />
    // you may access them and pass something else to `HeaderButton` if you like
    // <HeaderButton IconComponent={Ionicons} iconSize={30} color={route.params.inCountdown ? iOSColors.red : iOSColors.blue} {...props} />
    <HeaderButton IconComponent={Ionicons} iconSize={25} color={iOSColors.blue} {...props} />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="search"
            iconName={"funnel-outline"}
            onPress={() => modalRef.current?.open()}
          />
        </HeaderButtons>
      )
    });
  }, [navigation]);

  useEffect(() => {
    const { genre, company, keyword } = route.params;
    // console.log(`genre`, genre)
    // console.log(`company`, company)
    // console.log(`keyword`, keyword)
    setMovies([]);
    let title = "";
    let discoverBy = { sortMethod: sortMethod, watchProvider: selectedMovieWatchProvider };
    if (genre) {
      title = genre.name
      discoverBy.genreId = genre.id;
    }
    else if (company) {
      title = company.name
      discoverBy.companyId = company.id;
    }
    else if (keyword) {
      title = keyword.name
      discoverBy.keywordId = keyword.id;
    }
    navigation.setOptions({ title: title });
    getDiscoverMovies(discoverBy).then(json => {
      setMovies(json.results);
      scrollRef?.current?.scrollToIndex({
        index: 0,
        animated: false
      })
    })
  }, [route.params, sortMethod, selectedMovieWatchProvider])

  useEffect(() => {
    if (pageIndex > 1) {
      const { genre, company, keyword } = route.params;
      let discoverBy = { sortMethod: sortMethod, watchProvider: selectedMovieWatchProvider };
      if (genre) {
        discoverBy.genreId = genre.id;
      }
      else if (company) {
        discoverBy.companyId = company.id;
      }
      else if (keyword) {
        discoverBy.keywordId = keyword.id;
      }
      discoverBy.pageIndex = pageIndex;
      getDiscoverMovies(discoverBy).then(json => {
        setMovies([...movies, ...json.results]);
      })
    }
  }, [pageIndex])

  function SortMethod({ method, isLast }: { method: { actual: string, friendly: string, direction: "Up" | "Down" }, isLast?: boolean }) {
    return (
      <Pressable
        onPress={() => setSortMethod(method.actual)}
        style={{
          backgroundColor: sortMethod === method.actual ? "rgb(91, 91, 96)" : undefined,
          borderColor: sortMethod !== method.actual ? "rgb(91, 91, 96)" : undefined,
          borderWidth: 1,
          borderRadius: 16,
          paddingHorizontal: 24,
          paddingVertical: 8,
          marginRight: !isLast ? 8 : 0,
          marginTop: 16,
          justifyContent: "center"
        }}
      >
        <Text style={colorScheme === "dark" ? { ...iOSUIKit.footnoteEmphasizedObject, color: "white" } : { ...iOSUIKit.bodyObject }}>
          {method.friendly}
          <Ionicons name={method.direction === "Up" ? "arrow-up" : "arrow-down"} color="white" />
        </Text>

      </Pressable>
    )
  }

  function WatchProvider({ provider }: { provider: MovieWatchProvider }) {
    return (
      <Pressable
        onPress={() => setSelectedMovieWatchProvider(provider.provider_id)}
        style={{
          backgroundColor: selectedMovieWatchProvider === provider.provider_id ? "rgb(91, 91, 96)" : undefined,
          borderColor: selectedMovieWatchProvider !== provider.provider_id ? "rgb(91, 91, 96)" : undefined,
          borderWidth: 1,
          borderRadius: 16,
          paddingHorizontal: 24,
          paddingVertical: 8,
          marginRight: 8,
          marginTop: 16,
          justifyContent: "center"
        }}
      >
        <Text style={colorScheme === "dark" ? { ...iOSUIKit.footnoteEmphasizedObject, color: "white" } : { ...iOSUIKit.bodyObject }}>
          {provider.provider_name}
        </Text>

      </Pressable>
    )
  }

  return (
    <>
      {movies.length > 0
        ?
        <FlatList
          contentContainerStyle={{ paddingTop: Platform.OS === "ios" ? initHeaderHeight + 16 : 16, paddingBottom: Platform.OS === "ios" ? tabBarheight : undefined, marginHorizontal: 16 }}
          scrollIndicatorInsets={Platform.OS === "ios" ? { top: initHeaderHeight - insets.top + 16, bottom: tabBarheight - 16 } : undefined}
          data={movies}
          renderItem={({ item }: { item: TMDB.Movie.Movie }) => (
            <Poster
              navigation={navigation}
              data={item}
              categoryIndex={0}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
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
        :
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      }
      <Modalize
        ref={modalRef}
        adjustToContentHeight={true}
        childrenStyle={{ marginBottom: Platform.OS === "ios" ? tabBarheight + 16 : 16 }}
        modalStyle={colorScheme === "dark" ? { backgroundColor: "#121212" } : {}}
      >
        <Text style={{ ...iOSUIKit.bodyEmphasizedWhiteObject, marginTop: 16, marginHorizontal: 16 }}>Sort by</Text>
        <FlatList
          contentContainerStyle={{ alignSelf: 'flex-start', paddingHorizontal: 16 }}
          numColumns={sortOptions.length / 2}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={sortOptions}
          renderItem={({ item }) => <SortMethod method={item} />}
          directionalLockEnabled={true}
        />
        <Text style={{ ...iOSUIKit.bodyEmphasizedWhiteObject, marginTop: 16, marginHorizontal: 16 }}>Provider</Text>
        <FlatList
          contentContainerStyle={{ alignSelf: 'flex-start', paddingHorizontal: 16 }}
          numColumns={targetedProviders.length / 3}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={movieWatchProviders
            .filter(provider => targetedProviders.indexOf(provider.provider_name) > -1)
            .filter((v, i, a) => a.findIndex(t => (t.provider_name === v.provider_name)) === i)
            .sort((a, b) => {
              return b.provider_name < a.provider_name;
            })}
          renderItem={({ item }) => <WatchProvider provider={item} />}
          keyExtractor={item => item.provider_id.toString()}
          directionalLockEnabled={true}
        />
      </Modalize>
    </>
  );
};

export default MovieDiscover;
