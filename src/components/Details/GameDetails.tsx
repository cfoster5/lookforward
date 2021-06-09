import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  Text
} from 'react-native';

import { IGDB, Navigation } from '../../../types';
import { Image } from 'react-native-elements';
import { reusableStyles } from '../../helpers/styles';
import { iOSColors, iOSUIKit } from 'react-native-typography'
import Trailer from '../Trailer';
import { months } from '../../helpers/helpers';
import CategoryControl from '../CategoryControl';
import GameReleaseModal from './GameDetailModal';
import { StackNavigationProp } from '@react-navigation/stack';
import ThemeContext from '../../contexts/ThemeContext';

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList | Navigation.CountdownStackParamList, 'Details'>,
  game: IGDB.Game.Game;
  modalizeRef: any
}

function GameDetails({ navigation, game, modalizeRef }: Props) {
  const [detailIndex, setDetailIndex] = useState(0)
  const colorScheme = useContext(ThemeContext)
  // const modalizeRef = useRef<Modalize>(null);
  // const [game, setGame] = useState();

  // useEffect(() => {
  //   let isMounted = true;
  //   console.log(game.id)
  //   getGame(route.params.igdbCreds.access_token, game.game.id).then(async games => {
  //     console.log(games)
  //     if (isMounted) {
  //       setGame(games[0]);
  //     }
  //   })
  //     .catch(error => {
  //       console.log("error 2", error)
  //     })
  //   return () => { isMounted = false };
  // }, [route.params])

  function getReleaseDate(): string {
    let dates: number[] = [];
    // console.log(game.release_dates)
    game.release_dates?.forEach(releaseDate => {
      // console.log(releaseDate)
      if (dates.indexOf(releaseDate.date) === -1 && (releaseDate.region === 2 || releaseDate.region === 8)) {
        dates.push(releaseDate.date)
      }
    });
    if (dates.length === 1) {
      let date = new Date(dates[0] * 1000);
      let monthIndex = new Date(date).getUTCMonth();
      return `${months[monthIndex].toUpperCase()} ${date.getUTCDate()}, ${new Date(date).getUTCFullYear()}`
    }
    else {
      return "MULTIPLE DATES"
    }
  }

  return (
    <>
      <GameReleaseModal modalizeRef={modalizeRef} game={game} getReleaseDate={getReleaseDate} />
      <ScrollView>
        {game?.cover?.url &&
          <Image
            style={{ width: Dimensions.get("window").width, height: (720 / 1280) * Dimensions.get("window").width }}
            source={{ uri: `https:${game.cover.url.replace("thumb", "screenshot_big")}` }}
          />
        }
        <View style={{ margin: 16 }}>
          <Text style={colorScheme === "dark" ? iOSUIKit.largeTitleEmphasizedWhite : iOSUIKit.largeTitleEmphasized}>{game.name}</Text>
          <Text style={reusableStyles.date}>{getReleaseDate()}</Text>
          <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>{game.summary}</Text>
          <View style={{ flexDirection: "row", paddingTop: 16, flexWrap: "wrap" }}>
            <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>Genres: </Text>
            {game?.genres?.map((genre, i) =>
              <View style={{ flexDirection: "row" }} key={i}>
                {i > 0 ? <View style={{ width: 5, height: 5, borderRadius: 5, marginHorizontal: 5, backgroundColor: iOSColors.blue, alignSelf: "center" }} /> : null}
                {i > 0 ? <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, } : { ...iOSUIKit.bodyObject }}>{genre.name}</Text> : <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>{genre.name}</Text>}
              </View>
            )}
          </View>
        </View>
        <CategoryControl
          buttons={["Credits", "Trailers"]}
          categoryIndex={detailIndex}
          handleCategoryChange={(index: number) => setDetailIndex(index)}
        />
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          {detailIndex === 0 &&
            <>
              {game.involved_companies?.find(company => company.publisher) &&
                <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>Published by:
                {game.involved_companies.filter(company => company.publisher)
                    .map((company, i) =>
                      <React.Fragment key={i}>{i > 0 ? `, ${company.company.name}` : ` ${company.company.name}`}</React.Fragment>
                    )}
                </Text>
              }
              {game.involved_companies?.find(company => company.developer) &&
                <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>Developed by:
                {game.involved_companies.filter(company => company.developer)
                    .map((company, i) =>
                      <React.Fragment key={i}>{i > 0 ? `, ${company.company.name}` : ` ${company.company.name}`}</React.Fragment>
                    )}
                </Text>
              }
              {game.involved_companies?.find(company => company.supporting) &&
                <View style={{ flexDirection: "row", paddingTop: 16, flexWrap: "wrap" }}>
                  <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>Supported by: </Text>
                  {game.involved_companies.filter(company => company.supporting)
                    .map((company, i) =>
                      <View style={{ flexDirection: "row" }} key={i}>
                        {i > 0 ? <View style={{ width: 5, height: 5, borderRadius: 5, marginHorizontal: 5, backgroundColor: iOSColors.blue, alignSelf: "center" }} /> : null}
                        {i > 0 ? <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, } : { ...iOSUIKit.bodyObject }}>{company.company.name}</Text> : <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject } : { ...iOSUIKit.bodyObject }}>{company.company.name}</Text>}
                      </View>
                    )}
                </View>
              }
            </>
          }
          {detailIndex === 1 &&
            <>
              {game.videos?.map((video, i) => <Trailer key={i} video={video} index={i} />)}
              {game.videos === undefined &&
                <Text style={colorScheme === "dark" ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 } : { ...iOSUIKit.bodyObject, paddingTop: 16 }}>No trailers yet! Come back later!</Text>
              }
            </>
          }
        </View>
      </ScrollView>
    </>
  );
};

export default GameDetails;
