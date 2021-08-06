import React, { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  Text,
  Pressable
} from 'react-native';
import { Navigation, TMDB } from '../../../types';
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

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList | Navigation.CountdownStackParamList, 'Details'>,
  movie: TMDB.Movie.Movie
}

function MovieDetails({ navigation, movie }: Props) {
  const [movieDetails, setMovieDetails] = useState<TMDB.Movie.Details>();
  const [detailIndex, setDetailIndex] = useState(0)
  const colorScheme = useContext(ThemeContext)
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
    setMovieDetails(undefined)
    getMovieDetails(movie.id).then(movie => {
      setMovieDetails(movie);
    })
  }, [movie])

  function getReleaseDate(): string {
    let monthIndex = new Date(movie.release_date).getUTCMonth();
    return `${months[monthIndex].toUpperCase()} ${new Date(movie.release_date).getUTCDate()}, ${new Date(movie.release_date).getUTCFullYear()}`;
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingTop: initHeaderHeight, paddingBottom: tabBarheight }}
        scrollIndicatorInsets={{ top: initHeaderHeight - insets.top, bottom: tabBarheight - 16 }}
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
          <View style={{ flexDirection: "row", paddingTop: 16, flexWrap: "wrap" }}>
            {/* <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>Genres: </Text> */}
            {/* {movieDetails?.genres?.map((genre, i) =>
              // <View style={{ flexDirection: "row" }} key={i}>
              //   {i > 0 ? <View style={{ width: 5, height: 5, borderRadius: 5, marginHorizontal: 5, backgroundColor: iOSColors.blue, alignSelf: "center" }} /> : null}
              //   {i > 0 ? <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>{genre.name}</Text> : <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>{genre.name}</Text>}
              // </View>
              <View
                key={i}
                style={{
                  backgroundColor: iOSColors.gray,
                  borderRadius: 16,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  marginRight: 8,
                  marginBottom: 16
                }}
              >
                <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>{genre.name}</Text>
              </View>
            )} */}
            {movieDetails?.genres?.map((genre, i) =>
              <Pressable
                onPress={() => navigation.push("MovieGenre", genre)}
                key={i}
                style={{
                  backgroundColor: "rgb(91, 91, 96)",
                  borderRadius: 16,
                  paddingHorizontal: 24,
                  paddingVertical: 8,
                  marginRight: 8,
                  marginBottom: 16,
                  justifyContent: "center"
                }}
              >
                <Text style={colorScheme === "dark" ? { ...iOSUIKit.footnoteEmphasizedObject, color: "white" } : { ...iOSUIKit.bodyObject }}>{genre.name}</Text>
              </Pressable>
            )}
          </View>
          <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>Status: {movieDetails?.status}</Text>
        </View>
        <CategoryControl
          buttons={["Cast & Crew", "Trailers"]}
          categoryIndex={detailIndex}
          handleCategoryChange={(index: number) => setDetailIndex(index)}
        />
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <View style={detailIndex !== 0 ? { display: "none" } : {}}>
            {movieDetails?.credits?.crew?.find(person => person?.job === "Director") &&
              <Person
                navigation={navigation}
                profilePath={(movieDetails?.credits?.crew?.find(person => person?.job === "Director") as TMDB.Movie.Crew).profile_path}
                name={(movieDetails?.credits?.crew?.find(person => person?.job === "Director") as TMDB.Movie.Crew).name}
                job={(movieDetails?.credits?.crew?.find(person => person?.job === "Director") as TMDB.Movie.Crew).job}
                character={undefined}
              />
            }
            {movieDetails?.credits.cast.map((person, i) => (
              <Person
                key={i}
                navigation={navigation}
                profilePath={person.profile_path}
                name={person.name}
                job={undefined}
                character={person.character}
              />
            ))}
          </View>
          <View style={detailIndex !== 1 ? { display: "none" } : {}}>
            {movieDetails?.videos?.results?.map((video, i) => <Trailer key={i} video={video} index={i} />)}
            {movieDetails?.videos?.results?.length === 0 &&
              <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>No trailers yet! Come back later!</Text>
            }
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default MovieDetails;
