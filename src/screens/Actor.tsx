import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Pressable,
  Appearance,
  Text
} from 'react-native';

import { Image } from 'react-native-elements';
import { Navigation, TMDB } from '../../types';
import { getMovieCredits } from '../helpers/requests';
import { reusableStyles } from '../helpers/styles';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, 'Actor'>,
  route: RouteProp<Navigation.FindStackParamList, 'Actor'>
}

function Actor({ route, navigation }: Props) {
  const actor = route.params;
  const [credits, setCredits] = useState<TMDB.Person.Credits>();

  useEffect(() => {
    console.log(actor);
    getMovieCredits(actor.id).then(credits => {
      console.log(credits);
      setCredits(credits)
    })
  }, [])

  const colorScheme = Appearance.getColorScheme();

  return (
    <ScrollView>
      <View style={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, marginHorizontal: 16 }}>
        {/* <Image
          style={reusableStyles.itemLeft}
          source={{ uri: actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://via.placeholder.com/500x750?text=Image%20Coming%20Soon' }}
        /> */}
        {actor.profile_path &&
          <Image
            style={reusableStyles.actor}
            source={{ uri: `https://image.tmdb.org/t/p/w300${actor.profile_path}` }}
          />
        }
        {!actor.profile_path &&
          <View style={{ ...reusableStyles.actor, borderWidth: 1, borderColor: colorScheme === "dark" ? "#1f1f1f" : "white", flexDirection: 'row', alignItems: "center", justifyContent: 'center' }}>
            <Text style={colorScheme === "dark" ? { ...iOSUIKit.title3EmphasizedWhiteObject } : { ...iOSUIKit.title3EmphasizedObject, color: iOSColors.gray }}>{actor.name.split(' ').map(i => i.charAt(0))}</Text>
          </View>
        }
        <Text style={colorScheme === "dark" ? { ...iOSUIKit.largeTitleEmphasizedWhiteObject, marginLeft: 16 } : { ...iOSUIKit.largeTitleEmphasizedObject, marginLeft: 16 }}>{actor.name}</Text>
      </View>
      <View style={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
        {credits?.cast.map((movieCredit, i) => (
          // <Pressable key={i} onPress={() => navigation.navigate('Details', { type: "movie", data: movieCredit })}>
          <Pressable key={i} onPress={() => navigation.push('Details', { type: "movie", data: movieCredit })}>
            <Image
              style={(i % 2) ? reusableStyles.itemRight : reusableStyles.itemLeft}
              source={{ uri: movieCredit?.poster_path ? `https://image.tmdb.org/t/p/w500${movieCredit.poster_path}` : 'https://via.placeholder.com/500x750?text=Image%20Coming%20Soon' }}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default Actor;
