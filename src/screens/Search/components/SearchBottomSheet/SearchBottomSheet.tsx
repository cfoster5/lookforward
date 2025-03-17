import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import analytics from "@react-native-firebase/analytics";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  PlatformColor,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { LargeBorderlessButton } from "@/components/LargeBorderlessButton";
import { calculateWidth } from "@/helpers/helpers";
import { useRecentItemsStore } from "@/stores/recents";
import { useStore } from "@/stores/store";

import { useGamesSearch } from "../../api/getGamesSearch";
import { useMultiSearch } from "../../api/getMultiSearch";
import useDebounce from "../../hooks/useDebounce";

import { RecentPerson } from "./RecentPerson";
import { RecentTitle } from "./RecentTitle";
import { SearchGame } from "./SearchGame";
import { SearchMovie } from "./SearchMovie";
import { SearchPerson } from "./SearchPerson";

const ListHeader = () => (
  <Text
    style={[
      iOSUIKit.title3Emphasized,
      { color: PlatformColor("label"), marginBottom: 16 },
    ]}
  >
    Recently Viewed
  </Text>
);

export const SearchBottomSheet = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { top } = useSafeAreaInsets();
  const {
    categoryIndex,
    setCategoryIndex,
    isPro,
    proModalRef,
    initialSnapPoint,
    setInitialSnapPoint,
  } = useStore();

  const snapPoints = useMemo(
    () => [
      initialSnapPoint !== 0 ? initialSnapPoint : tabBarHeight,
      "50%",
      "100%",
    ],
    [initialSnapPoint, tabBarHeight],
  );

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 400);
  const { data: movieData, isLoading: isLoadingMovies } =
    useMultiSearch(debouncedSearch);
  const { data: gamesData, isLoading: isLoadingGames } =
    useGamesSearch(debouncedSearch);
  const { recentMovies, recentPeople, recentGames, resetItems } =
    useRecentItemsStore();

  const shouldShowTitle = () => {
    if (categoryIndex === 0) {
      return recentMovies.length > 0 || recentPeople.length > 0;
    } else {
      return recentGames.length > 0;
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

  function handleClearPress(sectionTitle: string) {
    if (categoryIndex === 0) {
      if (sectionTitle === "Titles") {
        resetItems("recentMovies");
      } else {
        resetItems("recentPeople");
      }
    } else resetItems("recentGames");
  }

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    // 24 is height of handle indicator component
    setInitialSnapPoint(height + 24 + styles.textInput.marginBottom);
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
            onLayout={onLayout}
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
                    // marginVertical: 6,
                    marginLeft: calculateWidth(12, 12, 3.5) + 12,
                    marginRight: 12,
                  }}
                />
              )}
              keyExtractor={(result) => result.id.toString()}
              keyboardShouldPersistTaps="handled"
              style={{ marginRight: -12, marginLeft: -12 }}
            />
          ))}

        {!searchValue &&
          (isPro ? (
            <SectionList
              ListHeaderComponent={
                shouldShowTitle() ? <ListHeader /> : undefined
              }
              sections={[
                {
                  title: "Titles",
                  data: [
                    {
                      items:
                        categoryIndex === 0
                          ? recentMovies.sort(
                              (a, b) => b.last_viewed - a.last_viewed,
                            )
                          : recentGames.sort(
                              (a, b) => b.last_viewed - a.last_viewed,
                            ),
                    },
                  ],
                },
                {
                  title: "People",
                  data: [
                    {
                      items:
                        categoryIndex === 0
                          ? recentPeople.sort(
                              (a, b) => b.last_viewed - a.last_viewed,
                            )
                          : [],
                    },
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
                  keyboardShouldPersistTaps="handled"
                  showsHorizontalScrollIndicator={false}
                  style={{ marginHorizontal: -12 }}
                />
              )}
              SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderSectionHeader={({ section }) =>
                section.data[0].items.length > 0 ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
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
                    <Pressable onPress={() => handleClearPress(section.title)}>
                      <Text
                        style={[
                          iOSUIKit.subhead,
                          {
                            color: PlatformColor("systemBlue"),
                            marginTop: section.title !== "Titles" ? 8 : 0,
                          },
                        ]}
                      >
                        Clear
                      </Text>
                    </Pressable>
                  </View>
                ) : null
              }
              stickySectionHeadersEnabled={false}
              scrollEnabled={false}
              style={{ marginHorizontal: -12, paddingHorizontal: 12 }}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <LargeBorderlessButton
              handlePress={async () => {
                Keyboard.dismiss();
                proModalRef.current?.present();
                await analytics().logEvent("select_promotion", {
                  name: "Pro",
                  id: "com.lookforward.pro",
                });
              }}
              text="Explore Pro Features"
              style={{ paddingTop: 0 }}
            />
          ))}
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
