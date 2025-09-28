import * as Colors from "@bacons/apple-colors";
import { Stack } from "expo-router";
import { Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { CategoryControl } from "@/components/CategoryControl";
import { MultiItemHeader } from "@/components/Headers";
import { DeleteHeader } from "@/screens/Countdown/components/DeleteHeader.ios";
import { MyHeaderRight } from "@/screens/Countdown/components/MyHeaderRight.ios";
import { useCountdownStore, useInterfaceStore } from "@/stores";

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

  return (
    <SafeAreaView edges={["top", "left", "right"]}>
      <CategoryControl
        buttons={["Movies", "Games"]}
        categoryIndex={categoryIndex}
        handleCategoryChange={(index) => setCategoryIndex(index)}
        style={{
          marginHorizontal: 12,
          minHeight: 44,
        }}
      />
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
    </SafeAreaView>
  );
};

function SharedLayout({ children }) {
  return (
    <Stack>
      {children}
      <Stack.Screen
        name="movie/[id]"
        options={() => ({
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: MultiItemHeader,
        })}
      />
      <Stack.Screen
        name="person/[id]"
        options={({ route }) => ({
          title: route.params.name,
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: MultiItemHeader,
        })}
      />
      <Stack.Screen
        name="movie-discover"
        options={({ route }) => ({
          title: route.params.screenTitle,
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: MultiItemHeader,
        })}
      />
      <Stack.Screen
        name="movie-collection/[id]"
        options={({ route }) => ({
          title: route.params.name,
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: MultiItemHeader,
        })}
      />
      <Stack.Screen
        name="game/[id]"
        options={({ route }) => ({
          title: JSON.parse(route.params.game).name,
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: MultiItemHeader,
        })}
      />
      <Stack.Screen
        name="game-discover"
        options={({ route }) => ({
          title: JSON.parse(route.params.genre).name,
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "dark",
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: MultiItemHeader,
        })}
      />
    </Stack>
  );
}

const ConditionalDeleteHeader = () => {
  const { showDeleteButton } = useCountdownStore();
  return showDeleteButton ? <DeleteHeader /> : null;
};

export default function DynamicLayout({ segment }) {
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
          headerLeft: ConditionalDeleteHeader,
          headerRight: MyHeaderRight,
        }}
      />
    </SharedLayout>
  );
}
