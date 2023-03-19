import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useScrollToTop } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CategoryControl from "components/CategoryControl/CategoryControl";
import { GamePlatformPicker } from "components/GamePlatformPicker";
import { LoadingScreen } from "components/LoadingScreen";
import { GamePoster } from "components/Posters/GamePoster";
import { MoviePoster } from "components/Posters/MoviePoster";
import { Text as ThemedText } from "components/Themed";
import TabStackContext from "contexts/TabStackContext";
import { Movie, Person, TMDB, TV } from "interfaces/tmdb";
import { Search as SearchInterface } from "interfaces/tmdb/search";
import { DateTime } from "luxon";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { Modalize } from "react-native-modalize";
import { iOSUIKit } from "react-native-typography";

import { GameLayout } from "./GameLayout";
import { MovieLayout } from "./MovieLayout";
import { useGames } from "./api/getGames";
import { useMovieData } from "./api/getMovies";
import MovieSearchModal from "./components/MovieSearchModal";
import SearchPerson from "./components/SearchPerson";
import useDebounce from "./hooks/useDebounce";
import { MovieOption } from "./types";

import { useStore } from "@/stores/store";
import {
  FindStackParamList,
  Game,
  ReleaseDate,
  TabNavigationParamList,
} from "@/types";

function reducer(
  state: any,
  action: {
    type: string;
    categoryIndex?: number;
  }
) {
  switch (action.type) {
    case "set-categoryIndex":
      return {
        ...state,
        categoryIndex: action.categoryIndex,
      };
    default:
      return state;
  }
}

export function ListLabel({ text, style }: { text: string; style?: any }) {
  return (
    <ThemedText
      style={{
        ...iOSUIKit.bodyEmphasizedObject,
        marginBottom: 8,
        ...style,
      }}
    >
      {text}
    </ThemedText>
  );
}

type FindScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParamList, "Find">,
  BottomTabScreenProps<TabNavigationParamList, "FindTab">
>;

function Search({ navigation, route }: FindScreenNavigationProp) {
  const { width: windowWidth } = useWindowDimensions();
  const [{ categoryIndex }, dispatch] = useReducer(reducer, {
    categoryIndex: 0,
  });

  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef);
  const { theme } = useContext(TabStackContext);
  const modalizeRef = useRef<Modalize>(null);
  const { game } = useStore();
  const tabBarheight = useBottomTabBarHeight();
  const filterModalRef = useRef<Modalize>(null);

  // const scrollIndicatorInsets =
  //   Platform.OS === "ios" ? { bottom: tabBarheight - 16 } : undefined;

  return (
    <>
      <SafeAreaView
        style={{ backgroundColor: theme === "dark" ? "black" : "white" }}
      >
        <CategoryControl
          buttons={["Movies", "Games"]}
          categoryIndex={categoryIndex}
          handleCategoryChange={(index) =>
            dispatch({ type: "set-categoryIndex", categoryIndex: index })
          }
        />
      </SafeAreaView>
      {categoryIndex === 0 ? (
        <MovieLayout navigation={navigation} />
      ) : (
        <GameLayout navigation={navigation} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  flatlistContentContainer: {
    marginHorizontal: 16,
    // paddingBottom: Platform.OS === "ios" ? tabBarheight : undefined,
  },
  flatlistColumnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});

export default Search;
