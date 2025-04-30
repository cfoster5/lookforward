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
  PlatformColor,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { ApplePillButton } from "@/components/ApplePillButton";
import { DropdownMenu } from "@/components/DropdownMenu";
import { LargeBorderlessButton } from "@/components/LargeBorderlessButton";
import { BANNER_AD_UNIT_ID } from "@/constants/AdUnits";
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
import { SectionHeader } from "./SectionHeader";

const ItemSeparator = () => (
  <View
    style={{
      height: StyleSheet.hairlineWidth,
      backgroundColor: PlatformColor("separator"),
      marginLeft: calculateWidth(12, 12, 3.5) + 12,
      marginRight: 12,
    }}
  />
);

const ListHeader = () => (
  <Text
    style={[
      iOSUIKit.title3Emphasized,
      { color: PlatformColor("label"), marginBottom: 16 },
    ]}
  >
    History
  </Text>
);

const HorizontalSpacer = () => <View style={{ width: 12 }} />;

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
  const { recentMovies, recentPeople, recentGames } = useRecentItemsStore();

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

  const onLayout = () => setInitialSnapPoint(tabBarHeight + 8);

  const composeRecentSections = () => {
    if (categoryIndex === 0) {
      const titles = recentMovies.sort((a, b) => b.last_viewed - a.last_viewed);
      const people = recentPeople.sort((a, b) => b.last_viewed - a.last_viewed);
      // Conditionally include non-empty sections
      // Using the spread operator on an empty array will not add anything
      return [
        ...(titles.length
          ? [{ title: "Titles", data: [{ items: titles }] }]
          : []),
        ...(people.length
          ? [{ title: "People", data: [{ items: people }] }]
          : []),
      ];
    } else {
      const games = recentGames.sort((a, b) => b.last_viewed - a.last_viewed);
      return games.length
        ? [{ title: "Titles", data: [{ items: games }] }]
        : [];
    }
  };

  return (
    <BottomSheet
      enableDynamicSizing={false}
      bottomInset={tabBarHeight}
      topInset={top}
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: PlatformColor("secondarySystemBackground"),
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
          <DropdownMenu
            options={[
              { value: "Movies", label: "Movies" },
              { value: "Games", label: "Games" },
            ]}
            handleSelect={(value, label) => {
              setCategoryIndex(value === "Movies" ? 0 : 1);
              setSearchValue("");
            }}
          >
            <ApplePillButton
              // text={categoryIndex === 0 ? "Movies" : "Games"}
              iconName={categoryIndex === 0 ? "film" : "gamecontroller"}
              style={{
                backgroundColor: PlatformColor("tertiarySystemFill"),
                marginTop: 0,
                marginLeft: 12,
                paddingHorizontal: 12,
                paddingRight: 0,
                alignSelf: "stretch",
                flex: 1,
                // 46 from inspecting BottomSheetTextInput
                minHeight: 46,
              }}
            />
          </DropdownMenu>
        </View>

        {searchValue &&
          (isLoading() ? (
            <ActivityIndicator size="large" style={{ flex: 1 }} />
          ) : (
            <BottomSheetFlatList
              data={getSearchData()}
              renderItem={({ item }) => getRenderItem(item)}
              ItemSeparatorComponent={ItemSeparator}
              keyExtractor={(result) => result.id.toString()}
              keyboardShouldPersistTaps="handled"
              style={{ marginRight: -12, marginLeft: -12 }}
            />
          ))}

        {!searchValue && (
          <>
            {!isPro && (
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
              />
              // {/* <View style={{ alignItems: "center" }}>
              //   <BannerAd
              //     unitId={BANNER_AD_UNIT_ID}
              //     size={BannerAdSize.BANNER}
              //     requestOptions={{ requestNonPersonalizedAdsOnly: true }}
              //   />
              // </View> */}
            )}
            <SectionList
              ListHeaderComponent={shouldShowTitle() ? ListHeader : undefined}
              sections={composeRecentSections()}
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
                  ItemSeparatorComponent={HorizontalSpacer}
                  ListHeaderComponent={HorizontalSpacer}
                  ListFooterComponent={HorizontalSpacer}
                  horizontal
                  keyExtractor={(item) => item.id?.toString()}
                  keyboardShouldPersistTaps="handled"
                  showsHorizontalScrollIndicator={false}
                  style={[
                    { marginHorizontal: -12 },
                    section.title === "Titles" ? { marginBottom: 8 } : {},
                  ]}
                />
              )}
              renderSectionHeader={({ section }) =>
                section.data[0].items.length > 0 ? (
                  <SectionHeader
                    text={section.title}
                    categoryIndex={categoryIndex}
                  />
                ) : null
              }
              stickySectionHeadersEnabled={false}
              scrollEnabled={false}
              style={{ marginHorizontal: -12, paddingHorizontal: 12 }}
              keyboardShouldPersistTaps="handled"
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
