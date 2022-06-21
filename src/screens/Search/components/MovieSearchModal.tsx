import React, { useContext } from "react";
import { FlatList, Platform, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import { iOSUIKit } from "react-native-typography";
import {
  BottomTabNavigationProp,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMovieWatchProviders } from "api/getMovieWatchProviders";
import ButtonMultiState from "components/ButtonMultiState";
import ButtonSingleState from "components/ButtonSingleState";
import TabStackContext from "contexts/TabStackContext";
import { targetedProviders } from "helpers/helpers";
import { Navigation } from "interfaces/navigation";

export default function MovieSearchModal({
  navigation,
  filterModalRef,
  selectedOption,
  setSelectedOption,
}: {
  navigation: CompositeNavigationProp<
    StackNavigationProp<Navigation.FindStackParamList, "Find">,
    BottomTabNavigationProp<Navigation.TabNavigationParamList, "FindTab">
  >;
  filterModalRef: React.RefObject<Modalize>;
  selectedOption: string;
  setSelectedOption: (
    option: "Coming Soon" | "Now Playing" | "Popular" | "Trending"
  ) => void;
}) {
  const { theme } = useContext(TabStackContext);
  const tabBarheight = useBottomTabBarHeight();
  const { data: movieWatchProviders, isLoading } = useMovieWatchProviders();

  const options = [
    "Coming Soon",
    "Now Playing",
    "Popular",
    // "Top Rated",
    "Trending",
  ];

  return (
    <Modalize
      ref={filterModalRef}
      adjustToContentHeight={true}
      childrenStyle={{
        marginBottom: Platform.OS === "ios" ? tabBarheight + 16 : 16,
      }}
      modalStyle={theme === "dark" ? { backgroundColor: "#121212" } : {}}
    >
      <FlatList
        horizontal={true}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
        showsHorizontalScrollIndicator={false}
        data={options}
        // renderItem={({ item }) => <Option option={item} />}
        renderItem={({ item }) => (
          <ButtonMultiState
            text={item}
            selectedVal={selectedOption}
            onPress={() => setSelectedOption(item)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Text
        style={{
          ...iOSUIKit.bodyEmphasizedWhiteObject,
          marginTop: 16,
          marginHorizontal: 16,
        }}
      >
        Providers
      </Text>
      {/* Wrap FlatList in ScrollView with horizontal prop so that scrollEnabled within FlatList can be disabled  */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {!isLoading && (
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{
              alignSelf: "flex-start",
              paddingLeft: 16,
              paddingRight: 8,
            }}
            numColumns={Math.ceil(targetedProviders.length / 3)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={movieWatchProviders
              .filter(
                (provider) =>
                  targetedProviders.indexOf(provider.provider_name) > -1
              )
              .filter(
                (v, i, a) =>
                  a.findIndex((t) => t.provider_name === v.provider_name) === i
              )
              .sort((a, b) =>
                a.provider_name
                  .toLowerCase()
                  .localeCompare(b.provider_name.toLowerCase())
              )}
            renderItem={({ item }) => (
              <ButtonSingleState
                key={item.provider_id}
                text={item.provider_name}
                onPress={() =>
                  navigation.push("MovieDiscover", { provider: item })
                }
              />
            )}
            keyExtractor={(item) => item.provider_id.toString()}
          />
        )}
      </ScrollView>
    </Modalize>
  );
}
