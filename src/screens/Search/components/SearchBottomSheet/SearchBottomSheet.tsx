import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { RecentMovie } from "./RecentMovie";
import { RecentPerson } from "./RecentPerson";
import { useSearchData } from "../../api/getSearch";
import useDebounce from "../../hooks/useDebounce";

import { useStore } from "@/stores/store";
import { Recent } from "@/types";

export const SearchBottomSheet = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { top } = useSafeAreaInsets();
  const { categoryIndex, setCategoryIndex } = useStore();

  const snapPoints = useMemo(() => ["CONTENT_HEIGHT", "50%", "100%"], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 400);
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

  return (
    <BottomSheet
      // backgroundComponent={() => <BlurView style={StyleSheet.absoluteFill} />}
      bottomInset={tabBarHeight}
      topInset={top}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
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
        <View onLayout={handleContentLayout} style={{ flexDirection: "row" }}>
          <BottomSheetTextInput
            onChangeText={(value) => setSearchValue(value)}
            placeholder={categoryIndex === 0 ? "Movies & People" : "Games"}
            placeholderTextColor={PlatformColor("secondaryLabel")}
            clearButtonMode="while-editing"
            style={styles.textInput}
          />
          <Pressable
            onPress={() => setCategoryIndex(categoryIndex === 0 ? 1 : 0)}
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
        {!searchValue &&
          (composeRecentMovies().length > 0 ||
            composeRecentPeople().length > 0) && (
            <>
              <Text
                style={[
                  iOSUIKit.title3Emphasized,
                  { color: PlatformColor("label"), marginBottom: 16 },
                ]}
              >
                Recently Viewed
              </Text>
              {composeRecentMovies().length > 0 && (
                <>
                  <Text
                    style={[
                      iOSUIKit.subheadEmphasized,
                      {
                        color: PlatformColor("secondaryLabel"),
                        marginBottom: 8,
                      },
                    ]}
                  >
                    Titles
                  </Text>
                  <FlatList
                    data={composeRecentMovies()}
                    renderItem={({ item }) => <RecentMovie item={item} />}
                    ItemSeparatorComponent={() => (
                      <View style={{ width: 12 }} />
                    )}
                    ListHeaderComponent={<View style={{ width: 12 }} />}
                    ListFooterComponent={<View style={{ width: 12 }} />}
                    horizontal
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    style={{ marginHorizontal: -12 }}
                  />
                </>
              )}
              {composeRecentMovies().length > 0 && (
                <View style={{ height: 16 }} />
              )}
              {composeRecentPeople().length > 0 && (
                <>
                  <Text
                    style={[
                      iOSUIKit.subheadEmphasized,
                      {
                        color: PlatformColor("secondaryLabel"),
                        marginBottom: 8,
                      },
                    ]}
                  >
                    People
                  </Text>
                  <FlatList
                    data={composeRecentPeople()}
                    renderItem={({ item }) => <RecentPerson item={item} />}
                    ItemSeparatorComponent={() => (
                      <View style={{ width: 12 }} />
                    )}
                    ListHeaderComponent={<View style={{ width: 12 }} />}
                    ListFooterComponent={<View style={{ width: 12 }} />}
                    horizontal
                    keyExtractor={({ id }) => id.toString()}
                    showsHorizontalScrollIndicator={false}
                    style={{ marginHorizontal: -12 }}
                  />
                </>
              )}
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
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
