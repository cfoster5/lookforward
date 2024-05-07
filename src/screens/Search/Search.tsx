import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PlatformColor, View } from "react-native";

import { GameLayout } from "./GameLayout";
import { MovieLayout } from "./MovieLayout";
import { SearchBottomSheet } from "./components/SearchBottomSheet/SearchBottomSheet";

import { useStore } from "@/stores/store";
import { FindStackParamList, TabNavigationParamList } from "@/types";

type FindScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParamList, "Find">,
  BottomTabScreenProps<TabNavigationParamList, "FindTab">
>;

function Search({ navigation, route }: FindScreenNavigationProp) {
  const { categoryIndex } = useStore();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <>
      {/* Wrap with flex view to fix list running under tab bar */}
      <View style={{ flex: 1 }}>
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
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          backgroundColor: PlatformColor("secondarySystemBackground"),
        }}
      />
    </>
  );
}

export default Search;
