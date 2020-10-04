import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  Pressable,
  Appearance,
  Text
} from 'react-native';

import moment from 'moment';
import { game, Navigation, release, TMDB } from './types';
import { Image } from 'react-native-elements';
import { getMovieDetails } from './helpers/requests';
import { reusableStyles } from './styles';
import { iOSColors, iOSUIKit } from 'react-native-typography'
import MovieTrailer from './components/MovieTrailer';
import Cast from './Cast';
import SegmentedControl from '@react-native-community/segmented-control';
import MediaItem from './components/MediaItem';
import Person from './components/Person';

function Details({ route, navigation }: Navigation.DetailsScreenProps) {
  const media = route.params;
  const [movieDetails, setMovieDetails] = useState<TMDB.Movie.Details>();
  const [detailIndex, setDetailIndex] = useState(0)

  useEffect(() => {
    if (media.type === "movie") {
      // console.log(media.data.id)
      getMovieDetails(media.data.id).then(movie => {
        // console.log(movie);
        setMovieDetails(movie);
      })
    }
  }, [media])

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const colorScheme = Appearance.getColorScheme();

  function getReleaseDate(): string {
    let monthIndex = new Date(media.data.release_date).getUTCMonth();
    return `${months[monthIndex].toUpperCase()} ${new Date(media.data.release_date).getUTCDate()}, ${new Date(media.data.release_date).getUTCFullYear()}`;
  }

  return (
    <ScrollView>
      <Image
        // style={{ width: Dimensions.get("window").width, height: (500 / 889) * Dimensions.get("window").width }}
        style={{ width: Dimensions.get("window").width, height: (720 / 1280) * Dimensions.get("window").width }}
        // source={{ uri: media.type === "game" ? `https:${media.data.game.cover.url.replace("thumb", "screenshot_big")}` : `https://image.tmdb.org/t/p/w1280${media.data.backdrop_path}` }}
        source={{ uri: media.type === "game" ? `https:${media.data.game.cover.url.replace("thumb", "screenshot_big")}` : `https://image.tmdb.org/t/p/w780${media.data.backdrop_path}` }}
      />
      <View style={{ margin: 16 }}>
        <Text style={colorScheme === "dark" ? iOSUIKit.largeTitleEmphasizedWhite : iOSUIKit.largeTitleEmphasized}>{media.type === "game" ? media.data.game.name : media.data.title}</Text>
        {/* <Text style={reusableStyles.date}>{media.type === "movie" ? moment(media.data.release_date, "YYYY-MM-DD").format("LL").toUpperCase() : null}</Text> */}
        <Text style={reusableStyles.date}>{media.type === "movie" ? getReleaseDate() : null}</Text>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{media.type === "movie" ? movieDetails?.release_dates.results.find(result => result.iso_3166_1 === "US").release_dates[0].certification : null}</Text>
          <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{media.type === "movie" ? ` ${movieDetails?.runtime} minutes` : null}</Text>
        </View>
        <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{media.type === "game" ? media.data.game.summary : media.data.overview}</Text>
        {media.type === "game" &&
          <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Genres: {media.data.game.genres.map((genre, i) => <React.Fragment key={i}>{i > 0 ? `, ${genre.name}` : genre.name}</React.Fragment>)}</Text>
        }
        {media.type === "movie" &&
          <View>
            <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Genres: {movieDetails?.genres.map((genre: { id: number, name: string }, i: number) => <React.Fragment key={i}>{i > 0 ? `, ${genre.name}` : genre.name}</React.Fragment>)}</Text>
            <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Status: {movieDetails?.status}</Text>
          </View>
        }
      </View>
      {media.type === "movie" &&
        <>
          <SegmentedControl
            style={{ margin: 16, paddingVertical: 16 }}
            values={["Cast & Crew", "Trailers", "Similar"]}
            selectedIndex={detailIndex}
            onChange={(event) => {
              setDetailIndex(event.nativeEvent.selectedSegmentIndex)
            }}
          />
          <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
            {detailIndex === 0 &&
              <>
                {movieDetails?.credits?.crew?.find(person => person?.job === "Director") &&
                  <Person navigation={navigation} type={"crew"} person={movieDetails?.credits?.crew?.find(person => person?.job === "Director") as TMDB.Movie.Crew} />
                }

                {movieDetails?.credits.cast.map((person, i) => (
                  <Person key={i} navigation={navigation} type={"cast"} person={person} />
                ))}
              </>
            }
            {detailIndex === 1 &&
              <>
                {movieDetails?.videos.results.map((video, i) => <MovieTrailer key={i} video={video} index={i} />)}
              </>
            }
            {detailIndex === 2 &&
              <View style={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -16 }}>
                {movieDetails?.similar.results.filter(movie => moment(movie.release_date, "YYYY-MM-DD").isSameOrAfter(moment().format("YYYY-MM-DD"))).map((movieRelease, i) => (
                  <MediaItem key={i} navigation={navigation} mediaType="movie" index={i} data={movieRelease} />
                ))}
              </View>
            }
          </View>
        </>
      }
    </ScrollView>
  );
};

export default Details;
