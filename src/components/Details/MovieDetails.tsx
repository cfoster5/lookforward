import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  Text,
  ColorSchemeName
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
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList | Navigation.CountdownStackParamList, 'Details'>,
  movie: TMDB.Movie.Movie,
  colorScheme: ColorSchemeName
}

function MovieDetails({ navigation, movie, colorScheme }: Props) {
  const [movieDetails, setMovieDetails] = useState<TMDB.Movie.Details>();
  const [detailIndex, setDetailIndex] = useState(0)

  useEffect(() => {
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
      <ScrollView>
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
            <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>Genres: </Text>
            {movieDetails?.genres?.map((genre, i) =>
              <View style={{ flexDirection: "row" }} key={i}>
                {i > 0 ? <View style={{ width: 5, height: 5, borderRadius: 5, marginHorizontal: 5, backgroundColor: iOSColors.blue, alignSelf: "center" }} /> : null}
                {i > 0 ? <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, } : { ...iOSUIKit.bodyObject }}>{genre.name}</Text> : <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>{genre.name}</Text>}
              </View>
            )}
          </View>
          <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>Status: {movieDetails?.status}</Text>
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
                colorScheme={colorScheme}
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
                colorScheme={colorScheme}
              />
            ))}
          </View>
          <View style={detailIndex !== 1 ? { display: "none" } : {}}>
            {movieDetails?.videos?.results?.map((video, i) => <Trailer key={i} video={video} index={i} colorScheme={colorScheme} />)}
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
