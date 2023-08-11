import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native";

import { GameLayout } from "./GameLayout";
import { MovieLayout } from "./MovieLayout";

import CategoryControl from "@/components/CategoryControl/CategoryControl";
import TabStackContext from "@/contexts/TabStackContext";
import { FindStackParamList, TabNavigationParamList } from "@/types";

type FindScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParamList, "Find">,
  BottomTabScreenProps<TabNavigationParamList, "FindTab">
>;

function Search({ navigation, route }: FindScreenNavigationProp) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const { theme } = useContext(TabStackContext);

  // const scrollIndicatorInsets =
  //   Platform.OS === "ios" ? { bottom: tabBarheight - 16 } : undefined;

  return (
    <>
      <SafeAreaView
        style={{ backgroundColor: theme === "dark" ? "black" : "white" }}
      >
        <CategoryControl
          buttons={["Movies", "Games"]}
          categoryIndex={categoryIndex}
          handleCategoryChange={(index) => setCategoryIndex(index)}
        />
      </SafeAreaView>
      {categoryIndex === 0 ? (
        <MovieLayout navigation={navigation} />
      ) : (
        <GameLayout navigation={navigation} />
      )}
    </>
  );
}

export default Search;
