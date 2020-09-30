import React from "react";
import { Dimensions, Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { reusableStyles } from "./styles";
import { TMDB } from "./types";

function Cast({ movieDetails, navigation }: { movieDetails: TMDB.Movie.Details, navigation: any }) {

  // <Pressable key={i} onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.key}`)}>
  // <Pressable key={i} onPress={() => Linking.openURL(`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`)}>
  //   <Text style={iOSUIKit.body}>{video.name}</Text>
  // </Pressable>

  return (
    // {/* <View style={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
    // {movieDetails?.credits.cast.map((person, i) => (
    //     <Pressable key={i} onPress={() => navigation.navigate('Actor', person)}>
    //       <Image
    //         style={(i % 2) ? reusableStyles.itemRight : reusableStyles.itemLeft}
    //         source={{ uri: person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://via.placeholder.com/500x750?text=Image%20Coming%20Soon' }}
    //       />
    //     </Pressable>
    //   ))}
    // </View> */}
    // {/* <View style={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
    //   {movieDetails?.similar.results.filter(movie => moment(movie.release_date, "YYYY-MM-DD").isSameOrAfter(moment().format("YYYY-MM-DD"))).map((movieRelease, i) => (
    //     <Pressable key={i} onPress={() => navigation.navigate('Details', { type: "movie", data: movieRelease })}>
    //       <Image
    //         style={(i % 2) ? reusableStyles.itemRight : reusableStyles.itemLeft}
    //         source={{ uri: movieRelease.poster_path ? `https://image.tmdb.org/t/p/w500${movieRelease.poster_path}` : 'https://via.placeholder.com/500x750?text=Image%20Coming%20Soon' }}
    //       />
    //     </Pressable>
    //   ))}
    // </View> */}

    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={200}
      decelerationRate="fast"
      pagingEnabled
      snapToInterval={((Dimensions.get("window").width / 2) - 32) + 16}
      contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap' }}
    >
      {movieDetails?.credits.cast.map((person, i) => (
        <Pressable key={i} onPress={() => navigation.push('Actor', person)}>
          <Image
            style={reusableStyles.horizontalItem}
            source={{ uri: person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : `https://via.placeholder.com/500x750?text=Image%20Coming%20Soon` }}
          />
        </Pressable>
      ))}
    </ScrollView>
    
  )
}

export default Cast;