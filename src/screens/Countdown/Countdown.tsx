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
import React, { useLayoutEffect, useReducer, useRef } from "react";
import { Platform, PlatformColor, SectionList, Text, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { useMovieCountdowns } from "./api/getMovieCountdowns";
import CountdownItem from "./components/CountdownItem";

import { useStore } from "@/stores/store";
import { CountdownStackParams, BottomTabParams } from "@/types";

export function reducer(
  state: any,
  action: {
    type: string;
    showButtons?: boolean;
    selections?: { documentID: string; sectionName: string }[];
  }
) {
  switch (action.type) {
    case "set-showButtons":
      return {
        ...state,
        showButtons: action.showButtons,
      };
    case "set-hideButtons":
      return {
        ...state,
        showButtons: false,
        selections: [],
      };
    case "set-selections":
      return {
        ...state,
        selections: action.selections,
      };
    default:
      return state;
  }
}

type CountdownScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<CountdownStackParams, "Countdown">,
  BottomTabScreenProps<BottomTabParams, "CountdownTabStack">
>;

function Countdown({ route, navigation }: CountdownScreenNavigationProp) {
  const [{ showButtons, selections }, dispatch] = useReducer(reducer, {
    showButtons: false,
    selections: [],
  });
  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);
  const { user, movieSubs, gameSubs } = useStore();
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const movies = useMovieCountdowns(movieSubs);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        Platform.OS === "ios" ? (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton} left>
            {showButtons && (
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
            )}
          </HeaderButtons>
        ) : null,
      headerRight: () => {
        let HeaderRight = null;
        if (!showButtons) {
          HeaderRight = (
            <Item
              title="Edit"
              buttonStyle={{
                color: PlatformColor("systemBlue"),
              }}
              onPress={() =>
                dispatch({ type: "set-showButtons", showButtons: true })
              }
            />
          );
        } else {
          if (
            Platform.OS === "ios" ||
            (Platform.OS === "android" && selections.length)
          ) {
            HeaderRight = (
              <Item
                title="Done"
                buttonStyle={{
                  ...iOSUIKit.bodyEmphasizedObject,
                  color: PlatformColor("systemBlue"),
                }}
                onPress={() => dispatch({ type: "set-hideButtons" })}
              />
            );
          }
        }
        return (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            {HeaderRight}
            {Platform.OS === "android" && showButtons && selections.length > 0 && (
              <Item
                title="Delete"
                buttonStyle={{
                  ...iOSUIKit.bodyEmphasizedObject,
                  color: selections.length === 0 ? "#48494a" : iOSColors.red,
                }}
                onPress={() => deleteItems()}
              />
            )}
          </HeaderButtons>
        );
      },
    });
  }, [navigation, showButtons, selections]);

  const renderSectionHeader = ({ section }) => (
    <View style={{ backgroundColor: PlatformColor("systemGray6") }}>
      <Text
        style={{
          ...iOSUIKit.title3EmphasizedWhiteObject,
          marginLeft: 16,
          marginVertical: 8,
        }}
      >
        {section.title}
      </Text>
    </View>
  );

  function updateSelections(documentID: string, sectionName: string) {
    const tempSelections = selections.slice();
    const selectionIndex = tempSelections.findIndex(
      (obj) => obj.documentID === documentID
    );
    if (selectionIndex === -1) {
      tempSelections.push({ documentID, sectionName });
    } else {
      tempSelections.splice(selectionIndex, 1);
    }
    dispatch({ type: "set-selections", selections: tempSelections });
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
          navigation={navigation}
          item={item}
          sectionName={section.title}
          isLastInSection={
            section.title === "Movies"
              ? index + 1 === movieSubs.length
              : index + 1 === gameSubs.length
          }
          showButtons={showButtons}
          selected={
            selections.findIndex((obj) => obj.documentID === item.documentID) >
            -1
          }
          updateSelections={(documentID) =>
            updateSelections(documentID, section.title)
          }
        />
      )}
      renderSectionHeader={renderSectionHeader}
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
