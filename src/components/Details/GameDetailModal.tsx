import React from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';

import { IGDB } from '../../../types';
import { reusableStyles } from '../../helpers/styles';
import { iOSUIKit } from 'react-native-typography'
import { Modalize } from 'react-native-modalize';
import firestore from '@react-native-firebase/firestore';

function GameReleaseModal({ modalizeRef, game, uid, getReleaseDate }: { modalizeRef: any, game: IGDB.Game.Game, uid: string, getReleaseDate: () => string }) {

  // const colorScheme = Appearance.getColorScheme();
  const colorScheme = "dark"

  function formatDate(item: IGDB.Game.ReleaseDate) {
    let date = new Date(item.date * 1000);
    let monthIndex = new Date(date).getUTCMonth();
    // return `${months[monthIndex].toUpperCase()} ${date.getUTCDate()}, ${new Date(date).getUTCFullYear()}`
    return `${(monthIndex + 1).toString().length < 2 ? "0" : ""}${monthIndex + 1}/${date.getUTCDate().toString().length < 2 ? "0" : ""}${date.getUTCDate()}/${new Date(date).getUTCFullYear()}`;
  }

  async function addGameRelease(releaseDate: IGDB.Game.ReleaseDate) {
    // console.log("releaseDate", releaseDate);
    let tempGame = {
      cover: game.cover,
      id: game.id,
      name: game.name,
      summary: game.summary
    }
    // console.log(game);
    releaseDate.game = tempGame;
    try {
      await firestore().collection("gameReleases").doc(releaseDate.id.toString()).set(releaseDate, { merge: true })
      console.log("Document successfully written!");
      await firestore().collection("gameReleases").doc(releaseDate.id.toString()).update({
        subscribers: firestore.FieldValue.arrayUnion(uid)
      })
      console.log("Document updated successfully.")
      modalizeRef.current?.close()
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return (
    <Modalize ref={modalizeRef} adjustToContentHeight={true} childrenStyle={{ marginBottom: 16 }} modalStyle={colorScheme === "dark" ? { backgroundColor: "#121212" } : {}}>
      {/* {game.release_dates.map((releaseDate, i) => ( */}
      {game.release_dates.map((releaseDate, i) => (
        (releaseDate.region === 2 || releaseDate.region === 8) &&
        <Pressable
          key={i}
          onPress={() => addGameRelease(releaseDate)}
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            paddingBottom: i < game.release_dates.filter(releaseDate => releaseDate.region === 2 || releaseDate.region === 8).length - 1 ? 16 : 0,
            borderBottomWidth: i < game.release_dates.filter(releaseDate => releaseDate.region === 2 || releaseDate.region === 8).length - 1 ? StyleSheet.hairlineWidth : 0,
            borderColor: i < game.release_dates.filter(releaseDate => releaseDate.region === 2 || releaseDate.region === 8).length - 1 ? "#3c3d41" : undefined
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={colorScheme === "dark" ? iOSUIKit.bodyWhite : iOSUIKit.body}>{releaseDate.platform.name}</Text>
            {getReleaseDate() === "MULTIPLE DATES" &&
              <Text style={reusableStyles.date}>{formatDate(releaseDate)}</Text>
            }
          </View>
        </Pressable>
      ))}
    </Modalize>

  );
};

export default GameReleaseModal;
