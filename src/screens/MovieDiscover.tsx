import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/stack';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons';
import { TMDB } from '../../types';
import Poster from '../components/Poster';
import ThemeContext from '../contexts/ThemeContext';
import { getDiscoverMovies } from '../helpers/requests';

function MovieDiscover({ route, navigation }: any) {
  const [movies, setMovies] = useState<TMDB.Movie.Movie[]>([]);
  const scrollRef = useRef<FlatList>(null);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [initHeaderHeight, setInitHeaderHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const [pageIndex, setPageIndex] = useState(1);
  const colorScheme = useContext(ThemeContext)
  const [sortMethod, setSortMethod] = useState("popularity.asc")
  const [showSortOptions, setShowSortOptions] = useState(false);

  const sortOptions = [
    "popularity.asc",
    "popularity.desc",
    "release_date.asc",
    "release_date.desc",
    // "revenue.asc",
    // "revenue.desc",
    "primary_release_date.asc",
    "primary_release_date.desc",
    "original_title.asc",
    "original_title.desc",
    // "vote_average.asc",
    // "vote_average.desc",
    // "vote_count.asc",
    // "vote_count.desc"
  ]

  useEffect(() => {
    if (initHeaderHeight === 0) {
      setInitHeaderHeight(headerHeight);
    }
  }, [headerHeight])

  // const IoniconsHeaderButton = (props: JSX.IntrinsicAttributes & JSX.IntrinsicClassAttributes<HeaderButton> & Readonly<HeaderButtonProps> & Readonly<any>) => (
  //   // the `props` here come from <Item ... />
  //   // you may access them and pass something else to `HeaderButton` if you like
  //   // <HeaderButton IconComponent={Ionicons} iconSize={30} color={route.params.inCountdown ? iOSColors.red : iOSColors.blue} {...props} />
  //   <HeaderButton IconComponent={Ionicons} iconSize={25} color={iOSColors.blue} {...props} />
  // );

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
  //         <Item
  //           title="search"
  //           iconName={"funnel-outline"}
  //           onPress={() => setShowSortOptions(!showSortOptions)}
  //         />
  //       </HeaderButtons>
  //     )
  //   });
  // }, [navigation, showSortOptions]);

  useEffect(() => {
    const { genre, company, keyword } = route.params;
    // console.log(`genre`, genre)
    // console.log(`company`, company)
    // console.log(`keyword`, keyword)
    setMovies([]);
    let title = "";
    let discoverBy = {};
    if (genre) {
      title = genre.name
      discoverBy = { genreId: genre.id }
    }
    else if (company) {
      title = company.name
      discoverBy = { companyId: company.id }
    }
    else if (keyword) {
      title = keyword.name
      discoverBy = { keywordId: keyword.id }
    }
    navigation.setOptions({ title: title });
    getDiscoverMovies(discoverBy).then(json => {
      setMovies(json.results);
    })
  }, [route.params])

  useEffect(() => {
    if (pageIndex > 1) {
      const { genre, company, keyword } = route.params;
      let discoverBy = {};
      if (genre) {
        discoverBy = { genreId: genre.id }
      }
      else if (company) {
        discoverBy = { companyId: company.id }
      }
      else if (keyword) {
        discoverBy = { keywordId: keyword.id }
      }
      discoverBy.pageIndex = pageIndex;
      getDiscoverMovies(discoverBy).then(json => {
        setMovies([...movies, ...json.results]);
      })
    }
  }, [pageIndex])

  function SortMethod({ method, isLast }: { method: string, isLast?: boolean }) {
    return (
      <Pressable
        onPress={() => setSortMethod(method)}
        style={{
          backgroundColor: sortMethod === method ? "rgb(91, 91, 96)" : undefined,
          borderColor: sortMethod !== method ? "rgb(91, 91, 96)" : undefined,
          borderWidth: 1,
          borderRadius: 16,
          paddingHorizontal: 24,
          paddingVertical: 8,
          marginRight: !isLast ? 8 : 0,
          marginBottom: 16,
          justifyContent: "center"
        }}
      >
        <Text style={colorScheme === "dark" ? { ...iOSUIKit.footnoteEmphasizedObject, color: "white" } : { ...iOSUIKit.bodyObject }}>{method}</Text>
      </Pressable>
    )
  }

  return (
    movies.length > 0
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
  );
};

export default MovieDiscover;
