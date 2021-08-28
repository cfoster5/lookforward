import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useContext, useEffect, useState } from 'react'
import { Text, Platform, FlatList, Pressable } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { iOSUIKit } from 'react-native-typography';
import MovieSearchFilterContext from '../contexts/MovieSearchFilterContexts';
import ThemeContext from '../contexts/ThemeContext';
import { getMovieWatchProviders } from '../helpers/tmdbRequests';
import ButtonMultiState from './ButtonMultiState';
import ButtonSingleState from './ButtonSingleState';

interface MovieWatchProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export default function MovieSearchModal({ navigation, filterModalRef, selectedOption }: { navigation: any, filterModalRef: Modalize, selectedOption: string }) {
  const colorScheme = useContext(ThemeContext)
  const tabBarheight = useBottomTabBarHeight();
  const { setSelectedOption } = useContext(MovieSearchFilterContext);
  const [movieWatchProviders, setMovieWatchProviders] = useState<MovieWatchProvider[]>([
    {
      display_priority: 0,
      logo_path: "",
      provider_id: 0,
      provider_name: "Any"
    }
  ]);

  const options = [
    "Coming Soon",
    "Now Playing",
    "Popular",
    // "Top Rated",
    "Trending"
  ]

  const targetedProviders = [
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

  return (
    <Modalize
      ref={filterModalRef}
      adjustToContentHeight={true}
      childrenStyle={{ marginBottom: Platform.OS === "ios" ? tabBarheight + 16 : 16 }}
      modalStyle={colorScheme === "dark" ? { backgroundColor: "#121212" } : {}}
    >
      <FlatList
        horizontal={true}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
        showsHorizontalScrollIndicator={false}
        data={options}
        // renderItem={({ item }) => <Option option={item} />}
        renderItem={({ item }) =>
          <ButtonMultiState
            text={item}
            selectedVal={selectedOption}
            onPress={() => setSelectedOption(item)}
          />
        }
        keyExtractor={(item, index) => index.toString()}
      />

      <Text style={{ ...iOSUIKit.bodyEmphasizedWhiteObject, marginTop: 16, marginHorizontal: 16 }}>Providers</Text>
      {/* Wrap FlatList in ScrollView with horizontal prop so that scrollEnabled within FlatList can be disabled  */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <FlatList
          scrollEnabled={false}
          contentContainerStyle={{ alignSelf: 'flex-start', paddingLeft: 16, paddingRight: 8 }}
          numColumns={Math.ceil(targetedProviders.length / 3)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={movieWatchProviders
            .filter(provider => targetedProviders.indexOf(provider.provider_name) > -1)
            .filter((v, i, a) => a.findIndex(t => (t.provider_name === v.provider_name)) === i)
            .sort((a, b) => b.provider_name < a.provider_name)
          }
          renderItem={({ item }) =>
            <ButtonSingleState
              key={item.provider_id}
              text={item.provider_name}
              onPress={() => navigation.push("MovieDiscover", { provider: item })}
            />
          }
          keyExtractor={item => item.provider_id.toString()}
        />
      </ScrollView>
    </Modalize>
  )
}
