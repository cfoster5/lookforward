import { Color, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { CategoryControl } from "@/components/CategoryControl";
import { CountdownLimitBanner } from "@/screens/Search/components/CountdownLimitBanner";
import { useInterfaceStore } from "@/stores";

import { AppleStackPreset } from "../(search)/_layout";

export const unstable_settings = {
  initialRouteName: "find",
  countdown: {
    initialRouteName: "countdown",
  },
};

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
        <Text style={[iOSUIKit.title3Emphasized, { color: Color.ios.label }]}>
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
            <Text style={[iOSUIKit.body, { color: Color.ios.systemBlue }]}>
              More
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

function SharedLayout({ children }: { children: React.ReactNode }) {
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
        options={{
          ...AppleStackPreset,
          headerTitleStyle: { color: "transparent" },
          headerLargeTitle: false,
        }}
      />
      <Stack.Screen name="movie-discover" options={{ ...AppleStackPreset }} />
      <Stack.Screen
        name="movie-collection/[id]"
        options={{
          ...AppleStackPreset,
          headerTitleStyle: { color: "transparent" },
        }}
      />
      <Stack.Screen
        name="game/[id]"
        options={{
          ...AppleStackPreset,
          headerLargeTitle: false,
          headerTitleStyle: { color: "transparent" },
        }}
      />
      <Stack.Screen name="game-discover" options={AppleStackPreset} />
    </Stack>
  );
}

export default function DynamicLayout({ segment }: { segment: string }) {
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
      <Stack.Screen name="index" options={AppleStackPreset} />
      <Stack.Screen
        name="collection"
        options={{ headerBackButtonDisplayMode: "minimal" }}
      />
    </SharedLayout>
  );
}
