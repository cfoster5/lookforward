import firestore from "@react-native-firebase/firestore";
import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeScreenProps, useScrollToTop } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { produce } from "immer";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Platform, PlatformColor, SectionList, View } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { useGameCountdowns } from "./api/getGameCountdowns";
import { useMovieCountdowns } from "./api/getMovieCountdowns";
import CountdownItem from "./components/CountdownItem";
import { MyHeaderRight } from "./components/MyHeaderRight";
import { SectionHeader } from "./components/SectionHeader";

import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { LoadingScreen } from "@/components/LoadingScreen";
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
  const { user, movieSubs, gameSubs, setMovieSubs, setGameSubs } = useStore();
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const movies = useMovieCountdowns(movieSubs);
  const gameReleases = useGameCountdowns();

  const selectedMovies: any[] = movieSubs.filter((sub) => sub.isSelected);
  const selectedGames: any[] = gameSubs.filter((sub) => sub.isSelected);

  const deleteItems = useCallback(async () => {
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
  }, [selectedGames, selectedMovies, user]);

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
  }, [
    navigation,
    showButtons,
    movieSubs,
    gameSubs,
    selectedMovies,
    selectedGames,
    deleteItems,
  ]);

  function handlePress(item, sectionName: string) {
    if (showButtons) {
      if (sectionName === "Movies") {
        const updatedMovieSubs = produce(movieSubs, (draft) => {
          const index = draft.findIndex(
            (sub) => sub.documentID === item.documentID
          );
          draft[index].isSelected = !draft[index].isSelected || false;
        });
        setMovieSubs(updatedMovieSubs);
      } else {
        const updatedGameSubs = produce(gameSubs, (draft) => {
          const index = draft.findIndex(
            (sub) => sub.documentID === item.id.toString()
          );
          draft[index].isSelected = !draft[index].isSelected || false;
        });
        setGameSubs(updatedGameSubs);
      }
    } else if (sectionName === "Movies") {
      navigation.navigate("Movie", {
        movieId: item.id,
        name: item.title,
      });
    } else if (sectionName === "Games") {
      navigation.navigate("Game", {
        game: {
          id: item.game.id,
          name: item.game.name,
          cover: { url: item.game.cover.url },
        },
      });
    }
  }

  if (
    movies.some((movie) => movie.isLoading) ||
    gameReleases.some((release) => release.isLoading)
  )
    return <LoadingScreen />;

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
        Platform.OS === "ios"
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
        {
          data: gameReleases
            .flatMap((release) => release.data)
            .sort((a, b) => a.date - b.date),
          title: "Games",
        },
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
              : gameSubs.find((sub) => sub.documentID === item.id.toString())
                  .isSelected
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
