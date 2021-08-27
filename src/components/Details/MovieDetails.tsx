import React, { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  Text,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Image } from 'react-native-elements';
import { getMovieDetails } from '../../helpers/requests';
import { reusableStyles } from '../../helpers/styles';
import { iOSColors, iOSUIKit } from 'react-native-typography'
import Trailer from '../Trailer';
import Person from '../Person';
import { months } from '../../helpers/helpers';
import CategoryControl from '../CategoryControl';
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack';
import ThemeContext from '../../contexts/ThemeContext';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ButtonSingleState from '../ButtonSingleState';
import { Navigation } from '../../interfaces/navigation';
import { TMDB } from '../../interfaces/tmdb';

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList | Navigation.CountdownStackParamList, 'Details'>,
  movie: TMDB.Movie.Movie
}

function MovieDetails({ navigation, movie }: Props) {
  const [movieDetails, setMovieDetails] = useState<TMDB.Movie.DetailsExtended>();
  const [detailIndex, setDetailIndex] = useState(0)
  const colorScheme = useContext(ThemeContext)
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [initHeaderHeight, setInitHeaderHeight] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (initHeaderHeight === 0) { setInitHeaderHeight(headerHeight) }
  }, [headerHeight])

  useEffect(() => {
    setMovieDetails(undefined)
    getMovieDetails(movie.id).then(movie => {
      console.log(`movie`, movie)
      setMovieDetails(movie);
    })
  }, [movie])

  function getReleaseDate(): string {
    let monthIndex = new Date(movie.release_date).getUTCMonth();
    return `${months[monthIndex].toUpperCase()} ${new Date(movie.release_date).getUTCDate()}, ${new Date(movie.release_date).getUTCFullYear()}`;
  }

  function DiscoverButton({ genre, company, keyword }: { genre?: TMDB.Genre, company?: TMDB.ProductionCompany, keyword?: any }) {
    let obj = {};
    let key = "";
    if (genre) {
      obj = genre;
      key = "genre";
    }
    else if (company) {
      obj = company;
      key = "company";
    }
    else if (keyword) {
      obj = keyword;
      key = "keyword";
    }

    return (
      <ButtonSingleState
        text={obj.name}
        onPress={() => navigation.push("MovieDiscover", { [key]: obj })}
      />
    )
  }

  return (
    <>
      {movieDetails
        ?
        <ScrollView
          contentContainerStyle={Platform.OS === "ios" ? { paddingTop: initHeaderHeight, paddingBottom: tabBarheight } : undefined}
          scrollIndicatorInsets={Platform.OS === "ios" ? { top: initHeaderHeight - insets.top, bottom: tabBarheight - 16 } : undefined}
        >
          {movie?.backdrop_path &&
            <Image
              style={{ width: Dimensions.get("window").width, height: (720 / 1280) * Dimensions.get("window").width }}
              source={{ uri: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` }}
            />
          }
          <View style={{ margin: 16 }}>
            <Text style={colorScheme === "dark" ? iOSUIKit.largeTitleEmphasizedWhite : iOSUIKit.largeTitleEmphasized}>{movie.title}</Text>
            <Text style={reusableStyles.date}>{getReleaseDate()}</Text>
            <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>{movie.overview}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {movieDetails?.genres?.map((genre, i) =>
                <DiscoverButton key={i} genre={genre} />
              )}
            </View>
            <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, marginTop: 16 } : { ...iOSUIKit.bodyObject }}>Status: {movieDetails?.status}</Text>
          </View>
          <CategoryControl
            buttons={["Cast & Crew", "Trailers", "Discover"]}
            categoryIndex={detailIndex}
            handleCategoryChange={(index: number) => setDetailIndex(index)}
          />
          <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
            {detailIndex === 0 &&
              <View>
                {movieDetails?.credits?.crew?.filter(person => person?.job === "Director").map((person, i) => (
                  <Person
                    key={i}
                    navigation={navigation}
                    person={person}
                  />
                ))}
                {movieDetails?.credits.cast.map((person, i) => (
                  <Person
                    key={i}
                    navigation={navigation}
                    person={person}
                  />
                ))}
              </View>
            }
            {detailIndex === 1 &&
              <View>
                {movieDetails?.videos?.results?.map((video, i) => <Trailer key={i} video={video} index={i} />)}
                {movieDetails?.videos?.results?.length === 0 &&
                  <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>No trailers yet! Come back later!</Text>
                }
              </View>
            }
            {detailIndex === 2 &&
              <>
                <Text style={colorScheme === "dark" ? { ...iOSUIKit.subheadEmphasizedWhiteObject, color: iOSColors.gray, textAlign: "center", marginTop: 16 } : { ...iOSUIKit.bodyObject }}>Production</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {movieDetails?.production_companies?.map((company, i) => (
                    <DiscoverButton key={i} company={company} />
                  ))}
                </View>
                <Text style={colorScheme === "dark" ? { ...iOSUIKit.subheadEmphasizedWhiteObject, color: iOSColors.gray, textAlign: "center", marginTop: 16 } : { ...iOSUIKit.bodyObject }}>Keywords</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {movieDetails?.keywords?.keywords?.map((keyword, i) => (
                    <DiscoverButton key={i} keyword={keyword} />
                  ))}
                </View>
              </>
            }
          </View>
        </ScrollView>
        :
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      }
    </>
  );
};

export default MovieDetails;
