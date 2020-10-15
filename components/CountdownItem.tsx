import React, { useRef, useState } from "react";
import { Animated, Appearance, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { months } from "../helpers/helpers";
import { reusableStyles } from "../styles";
import { IGDB, TMDB } from "../types";

function CountdownItem({ item, showButtons, selected, updateSelections, SlideView, FadeView }: any) {
  const colorScheme = Appearance.getColorScheme();

  function getReleaseDate(item): string {
    if (item.mediaType === "movie") {
      let monthIndex = new Date((item as TMDB.Movie.Movie).release_date).getUTCMonth();
      // return `${months[monthIndex].toUpperCase()} ${new Date((item as TMDB.Movie.Movie).release_date).getUTCDate()}, ${new Date((item as TMDB.Movie.Movie).release_date).getUTCFullYear()}`;
      return `${monthIndex.toString().length < 2 ? "0" : ""}${monthIndex + 1}/${new Date((item as TMDB.Movie.Movie).release_date).getUTCDate().toString().length < 2 ? "0" : ""}${new Date((item as TMDB.Movie.Movie).release_date).getUTCDate()}/${new Date((item as TMDB.Movie.Movie).release_date).getUTCFullYear()}`;
    }
    else {
      let date = new Date((item as IGDB.ReleaseDate.ReleaseDate).date * 1000);
      let monthIndex = new Date(date).getUTCMonth();
      // return `${months[monthIndex].toUpperCase()} ${date.getUTCDate()}, ${new Date(date).getUTCFullYear()}`
      return `${monthIndex.toString().length < 2 ? "0" : ""}${monthIndex + 1}/${date.getUTCDate().toString().length < 2 ? "0" : ""}${date.getUTCDate()}/${new Date(date).getUTCFullYear()}`;
    }
  }

  function getCountdownDays(item): number {
    if (item.mediaType === "movie") {
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
            <View style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: iOSColors.blue,
            }} />
            : null
        }
      </View>
    );
  }

  return (
    <Pressable onPress={() => updateSelections(item.documentID)}>
      <View style={{ ...styles.rowFront, overflow: "hidden" }}>
        {/* <View style={{ ...styles.rowFront, transform: [{ translateX: showButtons ? 16 : -16 }] }}> */}
        <SlideView style={styles.rowFront}>
          {/* {showButtons && */}
          {/* <View style={{ justifyContent: "center", opacity: showButtons ? 1 : 0 }}> */}
          <FadeView style={{ justifyContent: "center" }}>
            <RadioButton selected={selected} />
          </FadeView>
          {/* </View> */}
          {/* } */}
          {/* APPLY PADDING/MARGIN VERTICAL IF ITEM IS NOT FIRST OR LAST; FIRST ITEM SHOULD ONLY HAVE BOTTOM PADDING/MARGIN; LAST ITEM SHOULD ONLY HAVE TOP PADDING/MARGIN */}
          <Image
            style={styles.image}
            source={{ uri: item.mediaType === "movie" ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : `https:${item.game.cover.url.replace("thumb", "cover_big_2x")}` }}
          />
          <View style={{ borderColor: iOSColors.gray, borderBottomWidth: StyleSheet.hairlineWidth, flex: 1, justifyContent: "center", marginLeft: 16, paddingVertical: 16 }}>
            <Text style={{ ...iOSUIKit.bodyWhiteObject }}>{item.mediaType === "movie" ? item.title : item.game.name}</Text>
            <Text style={{ ...reusableStyles.date }}>{getReleaseDate(item)}</Text>
          </View>
          <View style={{ borderColor: iOSColors.gray, borderBottomWidth: StyleSheet.hairlineWidth, flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 16 }}>
            <Text style={{ ...iOSUIKit.title3EmphasizedWhiteObject, color: iOSColors.blue }}>{getCountdownDays(item)}</Text>
            <Text style={{ ...iOSUIKit.bodyWhiteObject, color: iOSColors.blue }}>days</Text>
          </View>
          {/* </View> */}
        </SlideView>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  rowFront: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // padding: 16,
    // alignItems: 'center',
    backgroundColor: "#1f1f1f",
    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
    // justifyContent: 'center',
    // height: 50,
    width: '100%'
  },
  image: {
    width: 92 / 1.75,
    height: 132 / 1.75,
    borderRadius: 8,
    resizeMode: "stretch",
    marginLeft: 16,
    // marginVertical: 8
    marginVertical: 16
    // marginBottom: 16,
    // marginLeft: 16,
    // marginRight: 8,
    // borderWidth: 1,
    // borderColor: colorScheme === "dark" ? "#1f1f1f" : "#e0e0e0"
  },
});

export default CountdownItem;