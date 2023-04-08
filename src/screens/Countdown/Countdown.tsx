import firestore from "@react-native-firebase/firestore";
import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeScreenProps, useScrollToTop } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IoniconsHeaderButton } from "components/IoniconsHeaderButton";
import { LoadingScreen } from "components/LoadingScreen";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Platform, PlatformColor, SectionList, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { useMovieCountdowns } from "./api/getMovieCountdowns";
import CountdownItem from "./components/CountdownItem";
import { MyHeaderRight } from "./components/MyHeaderRight";
import { SectionHeader } from "./components/SectionHeader";

import { Subs, useStore } from "@/stores/store";
import { CountdownStackParams, BottomTabParams } from "@/types";

type CountdownScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<CountdownStackParams, "Countdown">,
  BottomTabScreenProps<BottomTabParams, "CountdownTabStack">
>;

function Countdown({ route, navigation }: CountdownScreenNavigationProp) {
  const [showButtons, setShowButtons] = useState(false);

  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);
  const { user, movieSubs, gameSubs, updateSubs } = useStore();
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const movies = useMovieCountdowns(movieSubs);

  const selectedMovies: any[] = movieSubs.filter((sub) => sub.isSelected);
  const selectedGames: any[] = gameSubs.filter((sub) => sub.isSelected);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        Platform.OS === "ios" &&
        showButtons && (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton} left>
            <Item
              title="Delete"
              buttonStyle={{
                ...iOSUIKit.bodyEmphasizedObject,
                color:
                  selectedMovies.concat(selectedGames).length === 0
                    ? PlatformColor("systemGray3")
                    : PlatformColor("systemRed"),
              }}
              onPress={() => {
                if (selectedMovies.concat(selectedGames).length > 0) {
                  deleteItems();
                }
              }}
            />
          </HeaderButtons>
        ),
      headerRight: () => (
        <MyHeaderRight
          text={showButtons ? "Done" : "Edit"}
          handlePress={() => setShowButtons((prevValue) => !prevValue)}
          style={showButtons ? iOSUIKit.bodyEmphasized : null}
        />
      ),
    });
  }, [navigation, showButtons, movieSubs, gameSubs]);

  function handlePress(item, sectionName: string) {
    if (showButtons) {
      if (sectionName === "Movies") {
        updateSubs(Subs.movieSubs, item.documentID);
      } else {
        updateSubs(Subs.gameSubs, item.documentID);
      }
    } else if (sectionName === "Movies") {
      navigation.navigate("Movie", {
        movieId: item.id,
        movieTitle: item.title,
      });
    }
  }

  async function deleteItems() {
    const batch = firestore().batch();
    selectedMovies.map((selection) => {
      const docRef = firestore().collection("movies").doc(selection.documentID);
      batch.update(docRef, {
        subscribers: firestore.FieldValue.arrayRemove(user!.uid),
      });
    });
    selectedGames.map((selection) => {
      const docRef = firestore()
        .collection("gameReleases")
        .doc(selection.documentID);
      batch.update(docRef, {
        subscribers: firestore.FieldValue.arrayRemove(user!.uid),
      });
    });
    await batch.commit();
    setShowButtons(false);
  }

  if (movies.some((movie) => movie.isLoading)) return <LoadingScreen />;

  return (
    <SectionList
      contentContainerStyle={[
        { marginHorizontal: 16 },
        Platform.OS === "ios"
          ? {
              paddingTop: headerHeight + 16,
              paddingBottom: tabBarheight + 16,
            }
          : { paddingVertical: 16 },
      ]}
      // contentContainerStyle={{ paddingTop: 16, paddingBottom: tabBarheight + 16, marginHorizontal: 16 }}
      scrollIndicatorInsets={
        Platform.OS == "ios"
          ? {
              top: 16,
              bottom: tabBarheight - 16,
            }
          : undefined
      }
      // sections={listData}
      sections={[
        {
          data: movies
            .flatMap((movie) => movie.data)
            .sort((a, b) => a.releaseDate?.localeCompare(b.releaseDate)),
          title: "Movies",
        },
        { data: gameSubs, title: "Games" },
      ]}
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item, section, index }) => (
        <CountdownItem
          item={item}
          sectionName={section.title}
          isLastInSection={
            section.title === "Movies"
              ? index + 1 === movieSubs.length
              : index + 1 === gameSubs.length
          }
          showButtons={showButtons}
          isSelected={
            section.title === "Movies"
              ? movieSubs.find((sub) => sub.documentID === item.documentID)
                  .isSelected
              : item.isSelected
          }
          handlePress={() => handlePress(item, section.title)}
        />
      )}
      renderSectionHeader={SectionHeader}
      ListHeaderComponent={
        <View
          style={{
            height: 16,
            backgroundColor: PlatformColor("systemGray6"),
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      }
      ListFooterComponent={
        <View
          style={{
            height: 16,
            backgroundColor: PlatformColor("systemGray6"),
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        />
      }
      ref={scrollRef}
    />
  );
}

export default Countdown;
