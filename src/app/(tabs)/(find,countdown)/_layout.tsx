import * as Colors from "@bacons/apple-colors";
import { Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { CategoryControl } from "@/components/CategoryControl";
import { CountdownLimitBanner } from "@/screens/Search/components/CountdownLimitBanner";
import { useInterfaceStore, useSubscriptionStore } from "@/stores";

import { AppleStackPreset } from "../(search)/_layout";

export const unstable_settings = {
  initialRouteName: "find",
  countdown: {
    initialRouteName: "countdown",
  },
};

// Reusable header item base definitions
export const HEADER_ITEMS = {
  share: {
    type: "button",
    label: "Share",
    icon: { type: "sfSymbol", name: "square.and.arrow.up" },
    onPress: () => {},
  } as const,
  editPlus: {
    type: "button",
    label: "Edit",
    icon: { type: "sfSymbol", name: "plus" },
    onPress: () => {},
  } as const,
  editPencil: {
    type: "button",
    label: "Edit",
    icon: { type: "sfSymbol", name: "pencil" },
    onPress: () => {},
  } as const,
  filter: {
    type: "menu",
    label: "Filter",
    icon: { type: "sfSymbol", name: "line.3.horizontal.decrease" },
    onPress: () => {},
    items: [],
  } as const,
  allItemsFilter: {
    type: "button",
    label: "All Items",
    icon: { type: "sfSymbol", name: "square.grid.3x1.below.line.grid.1x2" },
    onPress: () => {},
  } as const,
  delete: {
    type: "button",
    label: "Delete",
    icon: { type: "sfSymbol", name: "trash" },
    onPress: () => {},
  } as const,
};

// Helper to extend header items with custom properties
export function createHeaderItem<T extends keyof typeof HEADER_ITEMS>(
  itemKey: T,
  overrides: Partial<(typeof HEADER_ITEMS)[T]> & Record<string, unknown>,
) {
  return { ...HEADER_ITEMS[itemKey], ...overrides };
}

const FindHeader = () => {
  const {
    categoryIndex,
    setCategoryIndex,
    movieSearchModalRef,
    movieSearchOption,
  } = useInterfaceStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <CategoryControl
        buttons={["Movies", "Games"]}
        categoryIndex={categoryIndex}
        handleCategoryChange={(index) => setCategoryIndex(index)}
        style={{
          marginHorizontal: 12,
          minHeight: 44,
        }}
      />
      <CountdownLimitBanner style={{ margin: 16, marginBottom: 0 }} />
      <View
        style={{
          margin: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={[iOSUIKit.title3Emphasized, { color: Colors.label }]}>
          {movieSearchOption}
        </Text>
        <Pressable
          onPress={() =>
            categoryIndex === 0 ? movieSearchModalRef.current?.present() : null
          }
          style={{
            minWidth: 60,
            minHeight: 44,
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {categoryIndex === 0 && (
            <Text style={[iOSUIKit.body, { color: Colors.systemBlue }]}>
              More
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

function SharedLayout({ children }) {
  return (
    <Stack>
      {children}
      <Stack.Screen
        name="movie/[id]"
        options={{
          ...AppleStackPreset,
          headerTitleStyle: { color: "transparent" },
        }}
      />
      <Stack.Screen
        name="person/[id]"
        options={({ route }) => ({
          ...AppleStackPreset,
          title: route.params.name,
          headerTitleStyle: { color: "transparent" },
          headerLargeTitle: false,
          unstable_headerRightItems: () => [HEADER_ITEMS.share],
        })}
      />
      <Stack.Screen
        name="movie-discover"
        options={({ route }) => ({
          title: route.params.screenTitle,
          ...AppleStackPreset,
          // unstable_headerRightItems: () => [HEADER_ITEMS.filter],
        })}
      />
      <Stack.Screen
        name="movie-collection/[id]"
        options={({ route }) => ({
          ...AppleStackPreset,
          title: route.params.name,
          headerTitleStyle: { color: "transparent" },
          unstable_headerRightItems: () => [HEADER_ITEMS.share],
        })}
      />
      <Stack.Screen
        name="game/[id]"
        options={({ route }) => ({
          ...AppleStackPreset,
          title: JSON.parse(route.params.game).name,
          headerLargeTitle: false,
          headerTitleStyle: { color: "transparent" },
          unstable_headerRightItems: () => [HEADER_ITEMS.editPlus],
        })}
      />
      <Stack.Screen
        name="game-discover"
        options={({ route }) => ({
          title: JSON.parse(route.params.genre).name,
          ...AppleStackPreset,
        })}
      />
    </Stack>
  );
}

export default function DynamicLayout({ segment }) {
  const { movieSubs, gameSubs } = useSubscriptionStore();
  if (segment === "(find)") {
    return (
      <SharedLayout>
        <Stack.Screen
          name="index"
          options={{
            title: "Find",
            headerShown: true,
            header: FindHeader,
          }}
        />
      </SharedLayout>
    );
  }

  return (
    <SharedLayout>
      <Stack.Screen
        name="index"
        options={{
          title: "Countdown",
          ...AppleStackPreset,
          unstable_headerRightItems: () =>
            movieSubs.length || gameSubs.length
              ? [HEADER_ITEMS.filter, HEADER_ITEMS.editPencil]
              : [],
        }}
      />
    </SharedLayout>
  );
}
