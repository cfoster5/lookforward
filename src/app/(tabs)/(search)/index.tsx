import * as Colors from "@bacons/apple-colors";
import { usePostHog } from "posthog-react-native";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  SectionList,
  StyleSheet,
  View,
} from "react-native";
import RevenueCatUI from "react-native-purchases-ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProOfferings } from "@/api/getProOfferings";
import { CategoryControl } from "@/components/CategoryControl";
import { LargeBorderlessButton } from "@/components/LargeBorderlessButton";
import { calculateWidth } from "@/helpers/helpers";
import { useSearch } from "@/hooks/useSearch";
import { useGamesSearch } from "@/screens/Search/api/getGamesSearch";
import { useMultiSearch } from "@/screens/Search/api/getMultiSearch";
import {
  RecentPerson,
  RecentTitle,
  SearchGame,
  SearchMovie,
  SearchPerson,
  SectionHeader,
} from "@/screens/Search/components";
import useDebounce from "@/screens/Search/hooks/useDebounce";
import { useAuthStore, useInterfaceStore } from "@/stores";
import { useRecentItemsStore } from "@/stores/recents";

const ItemSeparator = () => (
  <View
    style={{
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.separator,
      marginLeft: calculateWidth(12, 12, 3.5) + 12,
      marginRight: 12,
    }}
  />
);

const ListHeader = () => {
  const { isPro } = useAuthStore();
  const { categoryIndex, setCategoryIndex } = useInterfaceStore();
  const { data: pro } = useProOfferings();
  const posthog = usePostHog();

  return (
    <>
      <CategoryControl
        buttons={["Movies", "Games"]}
        categoryIndex={categoryIndex}
        handleCategoryChange={(index) => setCategoryIndex(index)}
        style={{
          marginHorizontal: 0,
          minHeight: 44,
          marginBottom: 24,
        }}
      />
      {!isPro && (
        <LargeBorderlessButton
          handlePress={async () => {
            Keyboard.dismiss();
            await RevenueCatUI.presentPaywall({ offering: pro });
            posthog.capture("search:paywall_view", { type: "pro" });
          }}
          text="Explore Pro Features"
        />
      )}
    </>
  );
};

const HorizontalSpacer = () => <View style={{ width: 12 }} />;

export default function SearchPage() {
  const searchQuery = useSearch();
  const { categoryIndex, setCategoryIndex } = useInterfaceStore();
  const { top: safeTopArea } = useSafeAreaInsets();

  const debouncedSearch = useDebounce(searchQuery, 400);
  const { data: movieData, isLoading: isLoadingMovies } =
    useMultiSearch(debouncedSearch);
  const { data: gamesData, isLoading: isLoadingGames } =
    useGamesSearch(debouncedSearch);
  const { recentMovies, recentPeople, recentGames } = useRecentItemsStore();

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
    <View style={{ marginHorizontal: 12, flex: 1 }}>
      {searchQuery && (
        <>
          <CategoryControl
            buttons={["Movies", "Games"]}
            categoryIndex={categoryIndex}
            handleCategoryChange={(index) => setCategoryIndex(index)}
            style={{
              marginBottom: 12,
              marginHorizontal: 0,
              minHeight: 44,
              marginTop: safeTopArea,
            }}
          />
          <FlatList
            data={getSearchData()}
            renderItem={({ item }) => getRenderItem(item)}
            ItemSeparatorComponent={ItemSeparator}
            keyExtractor={(result) => result.id.toString()}
            keyboardShouldPersistTaps="handled"
            style={{ marginRight: -12, marginLeft: -12 }}
            automaticallyAdjustsScrollIndicatorInsets={true}
            contentInsetAdjustmentBehavior="automatic"
            // TODO: Activity indicator when loading search results should be fully centered
            ListEmptyComponent={() =>
              isLoading && <ActivityIndicator size="large" />
            }
            keyboardDismissMode="on-drag"
          />
        </>
      )}

      {!searchQuery && (
        <>
          <SectionList
            ListHeaderComponent={ListHeader}
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
            automaticallyAdjustsScrollIndicatorInsets={true}
            contentInsetAdjustmentBehavior="automatic"
          />
        </>
      )}
    </View>
  );
}
