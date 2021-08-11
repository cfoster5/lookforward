import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TMDB } from '../../types';
import Poster from '../components/Poster';
import { getDiscoverMovies } from '../helpers/requests';

function MovieDiscover({ route, navigation }: any) {
  const [movies, setMovies] = useState<TMDB.Movie.Movie[]>([]);
  const scrollRef = useRef<FlatList>(null);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [initHeaderHeight, setInitHeaderHeight] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (initHeaderHeight === 0) {
      setInitHeaderHeight(headerHeight);
    }
  }, [headerHeight])

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
    getDiscoverMovies(discoverBy).then(results => setMovies(results));
  }, [route.params])

  return (
    movies.length > 0
      ?
      <FlatList
        contentContainerStyle={{ paddingTop: initHeaderHeight + 16, paddingBottom: tabBarheight, marginHorizontal: 16 }}
        scrollIndicatorInsets={{ top: initHeaderHeight - insets.top + 16, bottom: tabBarheight - 16 }}
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
      />
      :
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
  );
};

export default MovieDiscover;
