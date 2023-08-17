import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import { PlatformColor, View } from "react-native";

import { GameLayout } from "./GameLayout";
import { MovieLayout } from "./MovieLayout";
import { SearchBottomSheet } from "./components/SearchBottomSheet/SearchBottomSheet";

import TabStackContext from "@/contexts/TabStackContext";
import { useStore } from "@/stores/store";
import { FindStackParamList, TabNavigationParamList } from "@/types";

type FindScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParamList, "Find">,
  BottomTabScreenProps<TabNavigationParamList, "FindTab">
>;

function Search({ navigation, route }: FindScreenNavigationProp) {
  const { theme } = useContext(TabStackContext);
  const { categoryIndex } = useStore();
  const tabBarHeight = useBottomTabBarHeight();

  // const scrollIndicatorInsets =
  //   Platform.OS === "ios" ? { bottom: tabBarheight - 16 } : undefined;

  return (
    <>
      {/* Wrap with flex view to fix list running under tab bar; Use x2 because of tab bar and fake view from Search */}
      <View style={{ flex: 1, paddingBottom: tabBarHeight * 2 }}>
        {categoryIndex === 0 ? (
          <MovieLayout navigation={navigation} />
        ) : (
          <GameLayout navigation={navigation} />
        )}
      </View>
      <SearchBottomSheet />
      {/* Create View under bottom sheet to remove blur effect for this screen */}
      {/* Keeps effect for other screens in stack */}
      <View
        style={{
          height: tabBarHeight,
          backgroundColor: PlatformColor("secondarySystemBackground"),
        }}
      />
    </>
  );
}

export default Search;
