import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  PlatformColor,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { RecentPerson } from "./RecentPerson";
import { RecentTitle } from "./RecentTitle";
import { SearchGame } from "./SearchGame";
import { SearchMovie } from "./SearchMovie";
import { SearchPerson } from "./SearchPerson";
import { useGamesSearch } from "../../api/getGamesSearch";
import { useMoviesSearch } from "../../api/getMoviesSearch";
import useDebounce from "../../hooks/useDebounce";

import { calculateWidth } from "@/helpers/helpers";
import { useStore } from "@/stores/store";
import { Recent } from "@/types";

export const SearchBottomSheet = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { top } = useSafeAreaInsets();
  const { categoryIndex, setCategoryIndex } = useStore();

  // Set initial snapPoint as tabBarHeight instead of "CONTENT_HEIGHT to fix issues with scrolling flatlist"
  const snapPoints = useMemo(
    () => [tabBarHeight, "50%", "100%"],
    [tabBarHeight]
  );

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 400);
  const { data: movieData, isLoading: isLoadingMovies } =
    useMoviesSearch(debouncedSearch);
  const { data: gamesData, isLoading: isLoadingGames } =
    useGamesSearch(debouncedSearch);

  const [storedMovies, setStoredMovies] = useMMKVString("recent.movies");

  const composeRecentMovies = useCallback(
    () => (storedMovies ? (JSON.parse(storedMovies) as Recent[]) : []),
    [storedMovies]
  );

  const [storedPeople, setStoredPeople] = useMMKVString("recent.people");

  const composeRecentPeople = useCallback(
    () => (storedPeople ? (JSON.parse(storedPeople) as Recent[]) : []),
    [storedPeople]
  );

  const [storedGames] = useMMKVString("recent.games");

  const composeRecentGames = useCallback(
    () => (storedGames ? (JSON.parse(storedGames) as Recent[]) : []),
    [storedGames]
  );

  const shouldShowTitle = () => {
    if (categoryIndex === 0) {
      return (
        composeRecentMovies().length > 0 || composeRecentPeople().length > 0
      );
    } else {
      return composeRecentGames().length > 0;
    }
  };

  const getSearchData = () => {
    if (categoryIndex === 0) {
      return movieData?.results.filter((result) => result.media_type !== "tv");
    } else {
      return gamesData;
    }
  };

  const getRenderItem = (item) => {
    if (categoryIndex === 0) {
      if (item.media_type === "movie") {
        return <SearchMovie item={item} />;
      } else if (item.media_type === "person") {
        return <SearchPerson item={item} />;
      } else return null;
    } else {
      return <SearchGame item={item} />;
    }
  };

  const isLoading = () => {
    if (categoryIndex === 0) {
      return isLoadingMovies;
    } else {
      return isLoadingGames;
    }
  };

  return (
    <BottomSheet
      bottomInset={tabBarHeight}
      topInset={top}
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor:
          Platform.OS === "ios"
            ? PlatformColor("secondarySystemBackground")
            : "gray",
      }}
      handleIndicatorStyle={{
        backgroundColor: PlatformColor("systemGray"),
      }}
    >
      <View style={{ marginHorizontal: 12, flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <BottomSheetTextInput
            onChangeText={(value) => setSearchValue(value)}
            placeholder={categoryIndex === 0 ? "Movies & People" : "Games"}
            placeholderTextColor={PlatformColor("secondaryLabel")}
            clearButtonMode="while-editing"
            style={styles.textInput}
            value={searchValue}
          />
          <Pressable
            onPress={() => {
              setCategoryIndex(categoryIndex === 0 ? 1 : 0);
              setSearchValue("");
            }}
            style={{ justifyContent: "center", minWidth: 44, minHeight: 44 }}
          >
            <Ionicons
              name={
                categoryIndex === 0 ? "film-outline" : "game-controller-outline"
              }
              size={36}
              color={PlatformColor("systemBlue")}
              style={{ marginLeft: 12, marginBottom: 16 }}
            />
          </Pressable>
        </View>
        {/* <Pressable
          onPress={() => setStoredMovies(undefined)}
          style={{ backgroundColor: PlatformColor("systemRed") }}
        >
          <Text>Empty stored movies</Text>
        </Pressable>
        <Pressable
          onPress={() => setStoredPeople(undefined)}
          style={{ backgroundColor: PlatformColor("systemRed") }}
        >
          <Text>Empty stored people</Text>
        </Pressable> */}

        {searchValue &&
          (isLoading() ? (
            <ActivityIndicator size="large" style={{ flex: 1 }} />
          ) : (
            <BottomSheetFlatList
              data={getSearchData()}
              renderItem={({ item }) => getRenderItem(item)}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: PlatformColor("separator"),
                    marginVertical: 6,
                    marginLeft: calculateWidth(12, 12, 3.5) + 12,
                    marginRight: 12,
                  }}
                />
              )}
              keyExtractor={(result) => result.id.toString()}
              style={{ marginRight: -12 }}
              contentContainerStyle={{ paddingBottom: 12 }}
            />
          ))}

        {!searchValue && (
          <>
            {shouldShowTitle() && (
              <Text
                style={[
                  iOSUIKit.title3Emphasized,
                  { color: PlatformColor("label"), marginBottom: 16 },
                ]}
              >
                Recently Viewed
              </Text>
            )}
            <SectionList
              sections={[
                {
                  title: "Titles",
                  data: [
                    {
                      items:
                        categoryIndex === 0
                          ? composeRecentMovies()
                          : composeRecentGames(),
                    },
                  ],
                },
                {
                  title: "People",
                  data: [
                    { items: categoryIndex === 0 ? composeRecentPeople() : [] },
                  ],
                },
              ]}
              renderItem={({ section, item }) => (
                <FlatList
                  data={item.items}
                  renderItem={({ item }) =>
                    section.title === "Titles" ? (
                      <RecentTitle item={item} />
                    ) : (
                      <RecentPerson item={item} />
                    )
                  }
                  ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                  ListHeaderComponent={() => <View style={{ width: 12 }} />}
                  ListFooterComponent={() => <View style={{ width: 12 }} />}
                  horizontal
                  keyExtractor={(item) => item.id?.toString()}
                  showsHorizontalScrollIndicator={false}
                  style={{ marginHorizontal: -12 }}
                />
              )}
              SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderSectionHeader={({ section }) =>
                section.data[0].items.length > 0 ? (
                  <Text
                    style={[
                      iOSUIKit.subheadEmphasized,
                      {
                        color: PlatformColor("secondaryLabel"),
                        marginTop: section.title !== "Titles" ? 8 : 0,
                      },
                    ]}
                  >
                    {section.title}
                  </Text>
                ) : null
              }
              stickySectionHeadersEnabled={false}
              scrollEnabled={false}
              style={{ marginHorizontal: -12, paddingHorizontal: 12 }}
            />
          </>
        )}
      </View>
    </BottomSheet>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  textInput: {
    ...iOSUIKit.bodyObject,
    alignSelf: "stretch",
    // marginHorizontal: 12,
    // marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: PlatformColor("tertiarySystemFill"),
    color: PlatformColor("label"),
    // textAlign: "center",
    marginBottom: 16,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
