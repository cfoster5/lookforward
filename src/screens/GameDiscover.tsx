import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IGDB } from '../../types';
import Poster from '../components/Poster';
import GameContext from '../contexts/GamePlatformPickerContexts';
import { discoverGames } from '../helpers/requests';
import GameReleaseModal from '../components/GamePlatformPicker';
import { Modalize } from 'react-native-modalize';
import { convertReleasesToGames } from '../helpers/helpers';

function GameDiscover({ route, navigation }: any) {
  const [games, setGames] = useState<IGDB.Game.Game[]>([]);
  const scrollRef = useRef<FlatList>(null);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [initHeaderHeight, setInitHeaderHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const modalizeRef = useRef<Modalize>(null)
  const [game, setGame] = useState();

  useEffect(() => {
    if (initHeaderHeight === 0) {
      setInitHeaderHeight(headerHeight);
    }
  }, [headerHeight])

  useEffect(() => {
    const { genre, company, keyword } = route.params;
    console.log(`genre`, genre)
    // console.log(`company`, company)
    // console.log(`keyword`, keyword)
    setGames([]);
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
    discoverGames({ genreId: genre.id }).then(async releaseDates => {
      await convertReleasesToGames(releaseDates).then(games => {
        setGames(games);
      })
    })
  }, [route.params])

  useEffect(() => {
    // Open GamePlatformPicker if game is changed
    modalizeRef.current?.open()
  }, [game])

  return (
    games?.length > 0
      ?
      <GameContext.Provider value={{ game, setGame }}>
        <FlatList
          contentContainerStyle={{ paddingTop: Platform.OS === "ios" ? initHeaderHeight + 16 : undefined, paddingBottom: Platform.OS === "ios" ? tabBarheight : undefined, marginHorizontal: 16 }}
          scrollIndicatorInsets={Platform.OS === "ios" ? { top: initHeaderHeight - insets.top + 16, bottom: tabBarheight - 16 } : undefined}
          indicatorStyle="white"
          data={games}
          renderItem={({ item }: { item: IGDB.Game.Game }) => (
            <Poster
              navigation={navigation}
              data={item}
              categoryIndex={1}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          ref={scrollRef}
          keyExtractor={(item, index) => item.id.toString()}
          initialNumToRender={6}
        />
        <GameReleaseModal modalizeRef={modalizeRef} game={game} />
      </GameContext.Provider>
      :
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
  );
};

export default GameDiscover;
