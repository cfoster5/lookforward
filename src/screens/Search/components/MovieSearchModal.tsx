import { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { MovieOption } from "../types";

import { useMovieWatchProviders } from "@/api/getMovieWatchProviders";
import ButtonMultiState from "@/components/ButtonMultiState";
import ButtonSingleState from "@/components/ButtonSingleState";
import { DynamicHeightModal } from "@/components/DynamicHeightModal";
import { targetedProviders } from "@/helpers/helpers";
import { FindStackParamList, TabNavigationParamList } from "@/types";

export function MovieSearchModal({
  navigation,
  modalRef,
  selectedOption,
  setSelectedOption,
}: {
  navigation: CompositeNavigationProp<
    StackNavigationProp<FindStackParamList, "Find">,
    BottomTabNavigationProp<TabNavigationParamList, "FindTab">
  >;
  modalRef;
  selectedOption: MovieOption;
  setSelectedOption: (option: MovieOption) => void;
}) {
  const { data: movieWatchProviders, isInitialLoading } =
    useMovieWatchProviders();
  const { bottom: safeBottomArea } = useSafeAreaInsets();

  return (
    <DynamicHeightModal modalRef={modalRef}>
      <BottomSheetView style={{ paddingBottom: safeBottomArea }}>
        <FlatList
          horizontal
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
          showsHorizontalScrollIndicator={false}
          data={Object.values(MovieOption)}
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {!isInitialLoading && (
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
                    targetedProviders.indexOf(provider.provider_name) > -1,
                )
                .filter(
                  (v, i, a) =>
                    a.findIndex((t) => t.provider_name === v.provider_name) ===
                    i,
                )
                .sort((a, b) =>
                  a.provider_name
                    .toLowerCase()
                    .localeCompare(b.provider_name.toLowerCase()),
                )}
              renderItem={({ item }) => (
                <ButtonSingleState
                  key={item.provider_id}
                  text={item.provider_name}
                  onPress={() => {
                    modalRef.current?.dismiss();
                    navigation.push("MovieDiscover", {
                      screenTitle: item.provider_name,
                      provider: item,
                    });
                  }}
                />
              )}
              keyExtractor={(item) => item.provider_id.toString()}
            />
          )}
        </ScrollView>
      </BottomSheetView>
    </DynamicHeightModal>
  );
}
