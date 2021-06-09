import React, { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  Text,
  ActivityIndicator
} from 'react-native';
import { Navigation, TMDB, Trakt } from '../../../types';
import { Image } from 'react-native-elements';
import { getMovieDetails, getPeopleForShow, getPersonDetails } from '../../helpers/requests';
import { reusableStyles } from '../../helpers/styles';
import { iOSColors, iOSUIKit } from 'react-native-typography'
import Trailer from '../Trailer';
import Person from '../Person';
import { months } from '../../helpers/helpers';
import CategoryControl from '../CategoryControl';
import { StackNavigationProp } from '@react-navigation/stack';
import ThemeContext from '../../contexts/ThemeContext';

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, 'Details'>,
  show: Trakt.ShowPremiere | Trakt.ShowSearch
}

function MovieDetails({ navigation, show }: Props) {
  const [detailIndex, setDetailIndex] = useState(0)
  // const [people, setPeople] = useState<Trakt.ShowPeople[]>();
  const [creators, setCreators] = useState<Trakt.Role[]>([]);
  const [castings, setCast] = useState<Trakt.Cast[]>([]);
  const colorScheme = useContext(ThemeContext)

  useEffect(() => {
    // Self invoking async function fixes state being set before tmdbData is added
    (async () => {
      const { cast, crew } = await getPeopleForShow(show.show.ids.trakt);

      for (const casting of cast) {
        const details = await getPersonDetails(casting.person.ids.tmdb);
        casting.person.tmdbData = details;
      }
      setCast(cast);

      for (const creator of crew['created by']) {
        const details = await getPersonDetails(creator.person.ids.tmdb);
        creator.person.tmdbData = details;
      }
      setCreators(crew['created by'])


    })();
    console.log(`show.show.trailer`, show.show.trailer)
  }, [show])

  // function getReleaseDate(): string {
  //   let monthIndex = new Date(movie.release_date).getUTCMonth();
  //   return `${months[monthIndex].toUpperCase()} ${new Date(movie.release_date).getUTCDate()}, ${new Date(movie.release_date).getUTCFullYear()}`;
  // }

  return (
    <>
      <ScrollView>
        {show.show.tmdbData?.backdrop_path &&
          <Image
            style={{ width: Dimensions.get("window").width, height: (720 / 1280) * Dimensions.get("window").width }}
            source={{ uri: `https://image.tmdb.org/t/p/w780${show.show.tmdbData.backdrop_path}` }}
          />
        }
        <View style={{ margin: 16 }}>
          <Text style={colorScheme === "dark" ? iOSUIKit.largeTitleEmphasizedWhite : iOSUIKit.largeTitleEmphasized}>{show.show.title}</Text>
          {/* <Text style={reusableStyles.date}>{getReleaseDate()}</Text> */}
          <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>{show.show.overview}</Text>
          <View style={{ flexDirection: "row", paddingTop: 16, flexWrap: "wrap" }}>
            <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>Genres: </Text>
            {show.show?.genres?.map((genre, i) =>
              <View style={{ flexDirection: "row" }} key={i}>
                {i > 0 ? <View style={{ width: 5, height: 5, borderRadius: 5, marginHorizontal: 5, backgroundColor: iOSColors.blue, alignSelf: "center" }} /> : null}
                {i > 0 ? <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, } : { ...iOSUIKit.bodyObject }}>{genre[0].toUpperCase() + genre.substring(1)}</Text> : <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>{genre[0].toUpperCase() + genre.substring(1)}</Text>}
              </View>
            )}
          </View>
          <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>Status: {show.show.status[0].toUpperCase() + show.show.status.substring(1)}</Text>
        </View>

        <CategoryControl
          buttons={["Cast & Crew", "Trailers"]}
          categoryIndex={detailIndex}
          handleCategoryChange={(index: number) => setDetailIndex(index)}
        />

        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          {/* TODO: Shows that have no credits constantly show ActivityIndicator (I, Sniper) */}
          {detailIndex === 0 &&
            <>
              {creators.length > 0 || castings.length > 0
                ? <View style={detailIndex !== 0 ? { display: "none" } : {}}>
                  {creators.map((person, i) => (
                    <Person
                      key={i}
                      navigation={navigation}
                      profilePath={person.person.tmdbData?.profile_path}
                      name={person.person.name}
                      job={person.job}
                      character={undefined}
                    />
                  ))}
                  {castings.map((person, i) => (
                    <Person
                      key={i}
                      navigation={navigation}
                      profilePath={person.person.tmdbData?.profile_path}
                      name={person.person.name}
                      job={undefined}
                      character={person.character}
                    />
                  ))}
                </View>
                : <ActivityIndicator style={{ marginTop: 16 }} size="large" />
              }
            </>
          }


          <View style={detailIndex !== 1 ? { display: "none" } : {}}>
            {show.show.tmdbData?.videos?.results?.map((video, i) => <Trailer key={i} video={video} index={i} />)}
            {show.show.tmdbData?.videos?.results?.length === 0 &&
              <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>No trailers yet! Come back later!</Text>
            }
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default MovieDetails;
