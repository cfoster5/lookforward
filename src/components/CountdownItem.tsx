import React from "react";
import { Appearance, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { months } from "../helpers/helpers";
import { reusableStyles } from "../helpers/styles";
import { IGDB, TMDB } from "../../types";

interface Props {
  item: any
  sectionName: "Movies" | "Games"
  isFirstInSection: boolean
  isLastInSection: boolean
  showButtons: boolean
  selected: boolean
  updateSelections: (documentID: string) => void
  SlideView: (props: any) => JSX.Element
  FadeView: (props: any) => JSX.Element
}

function CountdownItem({ item, sectionName, isFirstInSection, isLastInSection, showButtons, selected, updateSelections, SlideView, FadeView }: Props) {
  // const colorScheme = Appearance.getColorScheme();

  function getReleaseDate(): string {
    if (sectionName === "Movies") {
      let monthIndex = new Date((item as TMDB.Movie.Movie).release_date).getUTCMonth();
      // return `${months[monthIndex].toUpperCase()} ${new Date((item as TMDB.Movie.Movie).release_date).getUTCDate()}, ${new Date((item as TMDB.Movie.Movie).release_date).getUTCFullYear()}`;
      return `${(monthIndex + 1).toString().length < 2 ? "0" : ""}${monthIndex + 1}/${new Date((item as TMDB.Movie.Movie).release_date).getUTCDate().toString().length < 2 ? "0" : ""}${new Date((item as TMDB.Movie.Movie).release_date).getUTCDate()}/${new Date((item as TMDB.Movie.Movie).release_date).getUTCFullYear()}`;
    }
    else {
      let date = new Date((item as IGDB.ReleaseDate.ReleaseDate).date * 1000);
      let monthIndex = new Date(date).getUTCMonth();
      // return `${months[monthIndex].toUpperCase()} ${date.getUTCDate()}, ${new Date(date).getUTCFullYear()}`
      return `${(monthIndex + 1).toString().length < 2 ? "0" : ""}${monthIndex + 1}/${date.getUTCDate().toString().length < 2 ? "0" : ""}${date.getUTCDate()}/${new Date(date).getUTCFullYear()}`;
    }
  }

  function getCountdownDays(): number {
    if (sectionName === "Movies") {
      let year = new Date((item as TMDB.Movie.Movie).release_date).getUTCFullYear();
      let month = new Date((item as TMDB.Movie.Movie).release_date).getUTCMonth();
      let day = new Date((item as TMDB.Movie.Movie).release_date).getUTCDate();
      let remainingSeconds = Math.floor(Date.UTC(year, month, day) / 1000) - Math.floor(Date.now() / 1000);
      let remainingMinutes = Math.floor(remainingSeconds / 60);
      let remainingHours = Math.floor(remainingMinutes / 60);
      let remainingDays = Math.ceil(remainingHours / 24);
      return remainingDays;
    }
    else {
      let date = new Date((item as IGDB.ReleaseDate.ReleaseDate).date * 1000);
      let year = new Date(date).getUTCFullYear();
      let month = new Date(date).getUTCMonth();
      let day = new Date(date).getUTCDate();
      let remainingSeconds = Math.floor(Date.UTC(year, month, day) / 1000) - Math.floor(Date.now() / 1000);
      let remainingMinutes = Math.floor(remainingSeconds / 60);
      let remainingHours = Math.floor(remainingMinutes / 60);
      let remainingDays = Math.ceil(remainingHours / 24);
      return remainingDays;
    }
  }

  function RadioButton(props: any) {
    return (
      <View style={[{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: iOSColors.gray,
        alignItems: 'center',
        justifyContent: 'center',
      }, props.style]}>
        {
          props.selected ?
            // <View style={{
            //   height: 12,
            //   width: 12,
            //   borderRadius: 6,
            //   backgroundColor: iOSColors.blue,
            // }} />
            <View style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              backgroundColor: iOSColors.blue,
              justifyContent: "center"
            }}>
              <Ionicons name="checkmark-outline" color={iOSColors.white} size={20} style={{ textAlign: "center" }} />
            </View>
            : null
        }
      </View>
    );
  }

  const styles = StyleSheet.create({
    rowFront: {
      overflow: "hidden",
      // backgroundColor: "#1f1f1f",
      backgroundColor: selected ? "#3a3a3c" : "#1f1f1f",
    },
    slide: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    image: {
      width: 92 / 1.75,
      height: 132 / 1.75,
      borderRadius: 8,
      resizeMode: "cover",
      marginLeft: 16,
      marginTop: 8,
      marginBottom: 8,
    },
    middle: {
      borderColor: "#3c3d41",
      borderBottomWidth: sectionName === "Games" && isLastInSection ? 0 : StyleSheet.hairlineWidth,
      flex: 1,
      justifyContent: "center",
      marginLeft: 16,
      paddingTop: 8,
      paddingBottom: 8
    },
    countdown: {
      borderColor: "#3c3d41",
      borderBottomWidth: sectionName === "Games" && isLastInSection ? 0 : StyleSheet.hairlineWidth,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 8,
      paddingBottom: 8
    }
  });

  return (
    <Pressable onPress={() => showButtons ? updateSelections(item.documentID) : null}>
      <View style={styles.rowFront}>
        <SlideView style={styles.slide}>
          <FadeView style={{ justifyContent: "center" }}>
            <RadioButton selected={selected} />
          </FadeView>
          <View style={{ justifyContent: "center" }}>
            <Image
              style={styles.image}
              source={{ uri: sectionName === "Movies" ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : `https:${item.game.cover.url.replace("thumb", "cover_big_2x")}` }}
            />
          </View>
          <View style={styles.middle}>
            <Text style={{ ...iOSUIKit.bodyWhiteObject }}>{sectionName === "Movies" ? item.title : item.game.name}</Text>
            <Text style={{ ...reusableStyles.date }}>{getReleaseDate()}</Text>
          </View>
          <View style={styles.countdown}>
            <Text style={{ ...iOSUIKit.title3EmphasizedWhiteObject, color: iOSColors.blue }}>{getCountdownDays()}</Text>
            <Text style={{ ...iOSUIKit.bodyWhiteObject, color: iOSColors.blue }}>days</Text>
          </View>
        </SlideView>
      </View>
    </Pressable>
  )
}

export default CountdownItem;