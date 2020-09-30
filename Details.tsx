import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Platform,
  ActivityIndicator,
  Button,
  Dimensions,
  Pressable, Linking, Appearance
} from 'react-native';

import moment from 'moment';
import { game, Navigation, release, TMDB } from './types';
import { ButtonGroup, Image, Text } from 'react-native-elements';
import { getMovieDetails } from './helpers/requests';
import { reusableStyles } from './styles';
import { iOSColors, iOSUIKit } from 'react-native-typography'
import MovieTrailer from './components/MovieTrailer';
import Cast from './Cast';
import SegmentedControl from '@react-native-community/segmented-control';

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

  const colorScheme = Appearance.getColorScheme();

  return (
    <ScrollView>
      {/* https://reactnavigation.org/docs/status-bar */}
      {/* <StatusBar barStyle="light-content" /> */}

      <Image
        style={{ width: Dimensions.get("window").width, height: (500 / 889) * Dimensions.get("window").width }}
        source={{ uri: media.type === "game" ? `https:${media.data.game.cover.url.replace("thumb", "screenshot_big")}` : `https://image.tmdb.org/t/p/w1280${media.data.backdrop_path}` }}
      />

      {/* <ScrollView style={{ margin: 16 }}>
        <Text h4>{game.name}</Text>
        <Text>{game.summary}</Text>
        <Text>Genres: {game.genres.map((genre, i) => (<React.Fragment key={i}>{i > 0 ? `, ${genre.name}` : genre.name}</React.Fragment>))}</Text>
      </ScrollView> */}
      <View style={{ margin: 16 }}>
        {/* <Text h4>{media.type === "game" ? media.data.game.name : media.data.title}</Text> */}
        <Text style={colorScheme === "dark" ? iOSUIKit.largeTitleEmphasizedWhite : iOSUIKit.largeTitleEmphasized}>{media.type === "game" ? media.data.game.name : media.data.title}</Text>
        {/* <Text style={iOSUIKit.title3}>{media.type === "movie" ? moment(media.data.release_date, "YYYY-MM-DD").format("MM/DD/YYYY") : null}</Text> */}
        {/* <Text style={reusableStyles.date}>{media.type === "movie" ? moment(media.data.release_date, "YYYY-MM-DD").format("dddd, MMMM D") : null}</Text> */}
        <Text style={reusableStyles.date}>{media.type === "movie" ? moment(media.data.release_date, "YYYY-MM-DD").format("LL").toUpperCase() : null}</Text>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{media.type === "movie" ? movieDetails?.release_dates.results.find(result => result.iso_3166_1 === "US").release_dates[0].certification : null}</Text>
          {/* <Image source={{ uri: "https://docs-assets.developer.apple.com/published/f3448319da/9d1c255f-eae3-42a1-a557-dbf5f33eaaa1.png" }} style={{ height: 94 / 4, width: 126 / 4 }}></Image> */}
          {/* <Image source={{ uri: "https://docs-assets.developer.apple.com/published/8cab854be4/c9b697bd-27a2-4b98-8330-38842529f91a.png" }} style={{height: 94/4, width: 274/4}}></Image> */}
          <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{media.type === "movie" ? ` ${movieDetails?.runtime} minutes` : null}</Text>
        </View>
        <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{media.type === "game" ? media.data.game.summary : media.data.overview}</Text>
        {media.type === "game" &&
          <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Genres: {media.data.game.genres.map((genre, i) => <React.Fragment key={i}>{i > 0 ? `, ${genre.name}` : genre.name}</React.Fragment>)}</Text>
        }
        {media.type === "movie" &&
          <View>
            {/* <Text>Release Date: {moment(media.data.release_date, "YYYY-MM-DD").format("MM/DD/YYYY")}</Text> */}
            <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Genres: {movieDetails?.genres.map((genre: { id: number, name: string }, i: number) => <React.Fragment key={i}>{i > 0 ? `, ${genre.name}` : genre.name}</React.Fragment>)}</Text>
            {/* <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Runtime: {movieDetails?.runtime} minutes</Text> */}
            <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Status: {movieDetails?.status}</Text>
            {/* <Text style={{ fontSize: 22 }}>Cast:</Text> */}
            {/* <Text style={iOSUIKit.title3Emphasized}>Cast:</Text> */}
            {/* <Text>{movieDetails?.credits.cast.map((person, i) => <React.Fragment key={i}>{i > 0 ? `, ${person.name}` : person.name}</React.Fragment>)}</Text> */}
            {/* <Text>{movieDetails?.credits.crew.map((person, i) => <React.Fragment key={i}>{i > 0 ? `, ${person.name}` : person.name}</React.Fragment>)}</Text> */}
            {/* <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Director: {movieDetails?.credits?.crew?.find(person => person?.job === "Director")?.name}</Text> */}
            {/* <Text>Similar: {movieDetails?.similar.results.map((movie, i) => <React.Fragment key={i}>{i > 0 ? `, ${movie.title}` : movie.title}</React.Fragment>)}</Text> */}
          </View>
        }
      </View>
      {media.type === "movie" &&
        <>
          {/* <Cast movieDetails={movieDetails} navigation={navigation}/> */}

          {/* <Text style={{ marginLeft: 16, fontSize: 22 }}>Similar Upcoming:</Text> */}

          {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {movieDetails?.similar.results.filter(movie => moment(movie.release_date, "YYYY-MM-DD").isSameOrAfter(moment().format("YYYY-MM-DD"))).map((movieRelease, i) => (
              <Pressable key={i} onPress={() => navigation.push('Details', { type: "movie", data: movieRelease })}>
                <Image
                  style={(i % 2) ? reusableStyles.itemRight : reusableStyles.itemLeft}
                  source={{ uri: movieRelease.poster_path ? `https://image.tmdb.org/t/p/w500${movieRelease.poster_path}` : `https://via.placeholder.com/500x750?text=${movieRelease.title}` }}
                />
              </Pressable>
            ))}
          </ScrollView> */}

          {/* TMDB Trailers */}
          {/* <ScrollView style={{ margin: 16 }}>
            <Text style={iOSUIKit.title3Emphasized}>Trailers</Text>
            {movieDetails?.videos.results.map((video, i) => <MovieTrailer video={video} key={i} />)}
          </ScrollView> */}
          {/*  */}

          {/* <View style={{ flex: 1, flexDirection: 'row', margin: 16 }}>
            <Pressable onPress={() => setDetailIndex(0)}>
              <Text style={{ ...iOSUIKit.title3EmphasizedObject, width: (Dimensions.get("window").width / 3) - (32 / 3), textAlign: "left" }}>Cast</Text>
            </Pressable>
            <Pressable onPress={() => setDetailIndex(1)}>
              <Text style={{ ...iOSUIKit.title3EmphasizedObject, width: (Dimensions.get("window").width / 3) - (32 / 3), textAlign: "center" }}>Trailers</Text>
            </Pressable>
            <Pressable onPress={() => setDetailIndex(2)}>
              <Text style={{ ...iOSUIKit.title3EmphasizedObject, width: (Dimensions.get("window").width / 3) - (32 / 3), textAlign: "right" }}>Similar</Text>
            </Pressable>
          </View> */}

          <SegmentedControl
            style={{ margin: 16 }}
            values={["Credits", "Trailers", "Similar"]}
            selectedIndex={detailIndex}
            onChange={(event) => {
              setDetailIndex(event.nativeEvent.selectedSegmentIndex)
            }}
          />

          <View style={{ marginLeft: 16, marginRight: 16, marginBottom: 16 }}>
            {detailIndex === 0 &&
              <>
                <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>Director: {movieDetails?.credits?.crew?.find(person => person?.job === "Director")?.name}</Text>
                {movieDetails?.credits.cast.map((person, i) => (
                  // <Pressable key={i} onPress={() => navigation.push('Actor', person)}>
                  <Pressable key={i} onPress={() => navigation.push('Actor', person)} style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
                    {/* <Image
                      style={reusableStyles.horizontalItem}
                      source={{ uri: person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : `https://via.placeholder.com/500x750?text=Image%20Coming%20Soon` }}
                    /> */}
                    {/* <Image
                      style={reusableStyles.credit}
                      source={{ uri: person.profile_path ? `https://image.tmdb.org/t/p/w300${person.profile_path}` : `https://via.placeholder.com/500x750?text=Image%20Coming%20Soon` }}
                    /> */}
                    {person.profile_path &&
                      <Image
                        style={reusableStyles.credit}
                        source={{ uri: `https://image.tmdb.org/t/p/w300${person.profile_path}` }}
                      />
                    }
                    {!person.profile_path &&
                      <View style={{ ...reusableStyles.credit, borderWidth: 1, borderColor: colorScheme === "dark" ? "#1f1f1f" : "white", flexDirection: 'row', alignItems: "center", justifyContent: 'center' }}>
                        <Text style={colorScheme === "dark" ? { ...iOSUIKit.title3EmphasizedWhiteObject } : { ...iOSUIKit.title3EmphasizedObject, color: iOSColors.gray }}>{person.name.split(' ').map(i => i.charAt(0))}</Text>
                      </View>
                    }
                    <View style={{ marginLeft: 16 }}>
                      <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{person.name}</Text>
                      <Text style={colorScheme === "dark" ? { ...iOSUIKit.subheadEmphasizedWhiteObject, color: iOSColors.gray } : { ...iOSUIKit.subheadEmphasizedObject, color: iOSColors.gray }}>{person.character}</Text>
                    </View>
                  </Pressable>
                ))}
              </>
            }
            {detailIndex === 1 &&
              <>
                {movieDetails?.videos.results.map((video, i) => <MovieTrailer key={i} video={video} index={i} />)}
              </>
            }
            {detailIndex === 2 &&
              // <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              //   {movieDetails?.similar.results.filter(movie => moment(movie.release_date, "YYYY-MM-DD").isSameOrAfter(moment().format("YYYY-MM-DD"))).map((movieRelease, i) => (
              //     <Pressable key={i} onPress={() => navigation.push('Details', { type: "movie", data: movieRelease })}>
              //       <Image
              //         style={(i % 2) ? reusableStyles.itemRight : reusableStyles.itemLeft}
              //         source={{ uri: movieRelease.poster_path ? `https://image.tmdb.org/t/p/w500${movieRelease.poster_path}` : `https://via.placeholder.com/500x750?text=${movieRelease.title}` }}
              //       />
              //     </Pressable>
              //   ))}
              // </ScrollView>
              <>
                {movieDetails?.similar.results.filter(movie => moment(movie.release_date, "YYYY-MM-DD").isSameOrAfter(moment().format("YYYY-MM-DD"))).map((movieRelease, i) => (
                  <Pressable key={i} onPress={() => navigation.navigate('Details', { type: "movie", data: movieRelease })}>
                    <Image
                      // key={i}
                      style={(i % 2) ? reusableStyles.itemRight : reusableStyles.itemLeft}
                      source={{ uri: movieRelease.poster_path ? `https://image.tmdb.org/t/p/w500${movieRelease.poster_path}` : `https://via.placeholder.com/500x750?text=${movieRelease.title}` }}
                    // onPress={() => navigation.navigate('Details', movieRelease)}
                    />
                  </Pressable>
                ))}
              </>
            }
          </View>

        </>
      }

      {/* {movieDetails?.similar.results.filter(movie => moment(movie.release_date, "YYYY-MM-DD").isSameOrAfter(moment().format("YYYY-MM-DD"))).map((movieRelease, i) => (
        <Text key={i}>
          {movieRelease.release_date}
        </Text>
      ))} */}
    </ScrollView>
  );
};

export default Details;
