import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { PlatformColor, View } from "react-native";

import { useStore } from "@/stores/store";
import { MovieLayout } from "@/screens/Search/MovieLayout";
import { GameLayout } from "@/screens/Search/GameLayout";
import { SearchBottomSheet } from "@/screens/Search/components/SearchBottomSheet/SearchBottomSheet";

function Search() {
  const { categoryIndex } = useStore();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <>
      {/* Wrap with flex view to fix list running under tab bar */}
      <View style={{ flex: 1 }}>
        {categoryIndex === 0 ? <MovieLayout /> : <GameLayout />}
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
