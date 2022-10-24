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
import React, { useLayoutEffect, useRef } from "react";
import { Platform, PlatformColor, SectionList, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useImmerReducer } from "use-immer";

import { useMovieCountdowns } from "./api/getMovieCountdowns";
import CountdownItem from "./components/CountdownItem";
import { MyHeaderRight } from "./components/MyHeaderRight";
import { SectionHeader } from "./components/SectionHeader";

import { useStore } from "@/stores/store";
import { CountdownStackParams, BottomTabParams } from "@/types";

function reducer(
  draft: any,
  action: {
    type: string;
    showButtons?: boolean;
    selections?: { documentID: string; sectionName: string }[];
    selection: { documentID: number; sectionName: string };
    selectionIndex: number;
  }
) {
  switch (action.type) {
    case "set-showButtons":
      draft.showButtons = true;
      break;
    case "set-hideButtons":
      draft.showButtons = false;
      draft.selections = [];
      break;
    case "add-selection":
      draft.selections.push(action.selection);
      break;
    case "remove-selection":
      draft.selections.splice(action.selectionIndex, 1);
      break;
    default:
      break;
  }
}

type CountdownScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<CountdownStackParams, "Countdown">,
  BottomTabScreenProps<BottomTabParams, "CountdownTabStack">
>;

function Countdown({ route, navigation }: CountdownScreenNavigationProp) {
  const [{ showButtons, selections }, dispatch] = useImmerReducer(
    (draft, action) => reducer(draft, action),
    { showButtons: false, selections: [] }
  );

  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);
  const { user, movieSubs, gameSubs } = useStore();
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const movies = useMovieCountdowns(movieSubs);

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
                  selections.length === 0
                    ? PlatformColor("systemGray3")
                    : PlatformColor("systemRed"),
              }}
              onPress={() => {
                if (selections.length > 0) {
                  deleteItems();
                }
              }}
            />
          </HeaderButtons>
        ),
      headerRight: () => (
        <MyHeaderRight
          text={showButtons ? "Done" : "Edit"}
          handlePress={() =>
            dispatch(
              showButtons
                ? { type: "set-hideButtons" }
                : { type: "set-showButtons" }
            )
          }
          style={showButtons ? iOSUIKit.bodyEmphasized : null}
        />
      ),
    });
  }, [navigation, showButtons, selections]);

  function handlePress(item, sectionName: string) {
    if (showButtons) {
      const selectionIndex = selections.findIndex(
        (obj) => obj.documentID === item.documentID
      );
      if (selectionIndex === -1) {
        dispatch({
          type: "add-selection",
          selection: { documentID: item.documentID, sectionName },
        });
      } else {
        dispatch({
          type: "remove-selection",
          selectionIndex,
        });
      }
    } else if (sectionName === "Movies") {
      navigation.navigate("Movie", {
        movieId: item.id,
        movieTitle: item.title,
      });
    }
  }

  async function deleteItems() {
    const collectionMap = { Movies: "movies", Games: "gameReleases" };

    const batch = firestore().batch();
    selections.map((selection) => {
      const docRef = firestore()
        .collection(collectionMap[selection.sectionName])
        .doc(selection.documentID);
      batch.update(docRef, {
        subscribers: firestore.FieldValue.arrayRemove(user!.uid),
      });
    });
    await batch.commit();
    dispatch({ type: "set-hideButtons" });
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
            selections.findIndex((obj) => obj.documentID === item.documentID) >
            -1
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
