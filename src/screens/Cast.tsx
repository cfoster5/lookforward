import React from "react";
import { Dimensions, Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { reusableStyles } from "../helpers/styles";
import { TMDB } from "../../types";

function Cast({ movieDetails, navigation }: { movieDetails: TMDB.Movie.Details, navigation: any }) {
  return (
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