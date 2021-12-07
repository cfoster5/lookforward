import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
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
import { getMovieDetails } from "../helpers/tmdbRequests";
import { getMovieById } from "../helpers/traktRequests";
import { Navigation } from "../interfaces/navigation";
import { TMDB } from "../interfaces/tmdb";

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
  const [showButtons, setShowButtons] = useState(false);
  const [selections, setSelections] = useState<
    { documentID: string; sectionName: string }[]
  >([]);
  const scrollRef = useRef<SectionList>(null);
  useScrollToTop(scrollRef);
  const transformAnim = useRef(
    new Animated.Value(!showButtons ? -16 : 16)
  ).current;
  const opacityAnim = useRef(new Animated.Value(!showButtons ? 0 : 1)).current;
  const { user } = useContext(TabStackContext);
  const { movies, games } = useContext(SubContext);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [promisedMovies, setPromisedMovies] = useState<TMDB.Movie.Details[]>(
    []
  );

  async function getMovie(movieId: string) {
    const movieDetails = await getMovieDetails(movieId);
    const trakt = await getMovieById(movieDetails.imdb_id);
    return {
      ...movieDetails,
      traktReleaseDate: trakt.released,
      documentID: movieId,
    };
  }

  useEffect(() => {
    Promise.all(movies.map((movie) => getMovie(movie.documentID)))
      .then((results) => {
        // console.log(results);
        setPromisedMovies(
          results.sort((a, b) =>
            a.traktReleaseDate?.localeCompare(b.traktReleaseDate)
          )
        );
      })
      .catch((err) => {
        // A request failed, handle the error
      });
  }, [movies]);

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
                    setShowButtons(false);
                    deleteItems();
                    setSelections([]);
                    startAnimation();
                  }
                }}
              />
            )}
          </HeaderButtons>
        ) : null,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          {!showButtons && (
            <Item
              title="Edit"
              onPress={() => {
                setShowButtons(true);
                startAnimation();
              }}
            />
          )}
          {Platform.OS === "ios"
            ? showButtons && (
                <Item
                  title="Done"
                  buttonStyle={{
                    ...iOSUIKit.bodyEmphasizedObject,
                    color: iOSColors.blue,
                  }}
                  onPress={() => {
                    setShowButtons(false);
                    setSelections([]);
                    startAnimation();
                  }}
                />
              )
            : showButtons &&
              selections.length === 0 &&
              Platform.OS === "android" && (
                <Item
                  title="Done"
                  buttonStyle={{
                    ...iOSUIKit.bodyEmphasizedObject,
                    color: iOSColors.blue,
                  }}
                  onPress={() => {
                    setShowButtons(false);
                    setSelections([]);
                    startAnimation();
                  }}
                />
              )}
          {/* {(showButtons && Platform.OS === "ios") || (showButtons && selections.length === 0 && Platform.OS === "android") &&
            <Item title="Done" buttonStyle={{ ...iOSUIKit.bodyEmphasizedObject, color: iOSColors.blue }} onPress={() => {
              setShowButtons(false);
              setSelections([]);
              startAnimation()
            }} />
          } */}
          {Platform.OS === "android" && showButtons && selections.length > 0 && (
            <Item
              title="Delete"
              buttonStyle={{
                ...iOSUIKit.bodyEmphasizedObject,
                color: selections.length === 0 ? "#48494a" : iOSColors.red,
              }}
              onPress={() => {
                if (selections.length > 0) {
                  setShowButtons(false);
                  deleteItems();
                  setSelections([]);
                  startAnimation();
                }
              }}
            />
          )}
        </HeaderButtons>
      ),
    });
  }, [navigation, showButtons, selections]);

  function startAnimation() {
    Animated.parallel([
      Animated.timing(transformAnim, {
        toValue: !showButtons ? 16 : -16,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: !showButtons ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }

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
    setSelections(tempSelections);
  }

  async function deleteItems() {
    for (const selection of selections) {
      // Animate as if deleting and then delete
      // Animate height to 0
      let collection = "";
      if (selection.sectionName === "Movies") {
        collection = "movies";
      }
      if (selection.sectionName === "Games") {
        collection = "gameReleases";
      }
      try {
        await firestore()
          .collection(collection)
          .doc(selection.documentID)
          .update({
            subscribers: firestore.FieldValue.arrayRemove(user),
          });
      } catch (error) {
        console.error("Error writing document: ", error);
      }
      setSelections([]);
    }
  }

  return promisedMovies.length ? (
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
        { data: promisedMovies, title: "Movies" },
        { data: games, title: "Games" },
      ]}
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => item + index}
      renderItem={(data) => (
        <CountdownItem
          navigation={navigation}
          item={data.item}
          sectionName={data.section.title}
          // isLastInSection={data.section.title === "Movies" ? data.index + 1 === route.params.movies.length : data.index + 1 === route.params.games.length}
          isLastInSection={
            data.section.title === "Movies"
              ? data.index + 1 === movies.length
              : data.index + 1 === games.length
          }
          showButtons={showButtons}
          selected={
            selections.findIndex(
              (obj) => obj.documentID === data.item.documentID
            ) > -1
          }
          updateSelections={(documentID) =>
            updateSelections(documentID, data.section.title)
          }
          transformAnim={transformAnim}
          opacityAnim={opacityAnim}
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
        ></View>
      }
      ListFooterComponent={
        <View
          style={{
            height: 16,
            backgroundColor: "#1f1f1f",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        ></View>
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
