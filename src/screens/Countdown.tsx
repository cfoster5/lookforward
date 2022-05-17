import React, { useContext, useLayoutEffect, useReducer, useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  SectionList,
  Text,
  View,
} from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import firestore from "@react-native-firebase/firestore";
import {
  BottomTabNavigationProp,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  CompositeNavigationProp,
  RouteProp,
  useScrollToTop,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import CountdownItem from "../components/CountdownItem";
import { IoniconsHeaderButton } from "../components/IoniconsHeaderButton";
import SubContext from "../contexts/SubContext";
import TabStackContext from "../contexts/TabStackContext";
import { useGetAllMovies } from "../hooks/useGetAllMovies";
import { Navigation } from "../interfaces/navigation";

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

interface Props {
  route: RouteProp<Navigation.CountdownStackParamList, "Countdown">;
  // navigation: StackNavigationProp<
  //   Navigation.CountdownStackParamList,
  //   "Countdown"
  // >;
  navigation: CompositeNavigationProp<
    StackNavigationProp<Navigation.CountdownStackParamList, "Countdown">,
    BottomTabNavigationProp<Navigation.TabNavigationParamList, "CountdownTab">
  >;
}

function Countdown({ route, navigation }: Props) {
  const [{ showButtons, selections }, dispatch] = useReducer(reducer, {
    showButtons: false,
    selections: [],
  });
  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);
  const { user } = useContext(TabStackContext);
  const { movieSubs, games } = useContext(SubContext);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const { movies, loading } = useGetAllMovies(movieSubs);

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
                  color: selections.length === 0 ? "#48494a" : iOSColors.red,
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
                  color: iOSColors.blue,
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
    <View style={{ backgroundColor: "#1f1f1f" }}>
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
    let tempSelections = selections.slice();
    let selectionIndex = tempSelections.findIndex(
      (obj) => obj.documentID === documentID
    );
    if (selectionIndex === -1) {
      tempSelections.push({ documentID: documentID, sectionName: sectionName });
    } else {
      tempSelections.splice(selectionIndex, 1);
    }
    dispatch({ type: "set-selections", selections: tempSelections });
  }

  async function deleteItems() {
    const collectionMap = { Movies: "movies", Games: "gameReleases" };

    let batch = firestore().batch();
    selections.map((selection) => {
      const docRef = firestore()
        .collection(collectionMap[selection.sectionName])
        .doc(selection.documentID);
      batch.update(docRef, {
        subscribers: firestore.FieldValue.arrayRemove(user),
      });
    });
    await batch.commit();
    dispatch({ type: "set-hideButtons" });
  }

  return !loading ? (
    <SectionList
      contentContainerStyle={
        Platform.OS == "ios"
          ? {
              paddingTop: headerHeight + 16,
              paddingBottom: tabBarheight + 16,
              marginHorizontal: 16,
            }
          : { paddingVertical: 16, marginHorizontal: 16 }
      }
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
          data: movies.sort((a, b) =>
            a.traktReleaseDate?.localeCompare(b.traktReleaseDate)
          ),
          title: "Movies",
        },
        { data: games, title: "Games" },
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
              : index + 1 === games.length
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
            backgroundColor: "#1f1f1f",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      }
      ListFooterComponent={
        <View
          style={{
            height: 16,
            backgroundColor: "#1f1f1f",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        />
      }
      ref={scrollRef}
    />
  ) : (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default Countdown;
