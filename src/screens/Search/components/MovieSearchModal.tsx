import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { FlatList, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { useMovieWatchProviders } from "@/api/getMovieWatchProviders";
import ButtonMultiState from "@/components/ButtonMultiState";
import ButtonSingleState from "@/components/ButtonSingleState";
import { CustomBottomSheetModal } from "@/components/CustomBottomSheetModal";
import { targetedProviders } from "@/helpers/helpers";

import { MovieOption } from "../types";

export function MovieSearchModal({
  modalRef,
  selectedOption,
  setSelectedOption,
}: {
  modalRef;
  selectedOption: MovieOption;
  setSelectedOption: (option: MovieOption) => void;
}) {
  const router = useRouter();
  const { data: movieWatchProviders, isLoading } = useMovieWatchProviders();
  const { bottom: safeBottomArea } = useSafeAreaInsets();

  // Convert targeted providers to a Set for faster lookups.
  const targetedSet = new Set(targetedProviders);

  // Use a Set to keep track of seen provider names
  const seen = new Set();
  const filteredProviders = [];

  // Single pass for filtering and deduplication
  for (const provider of movieWatchProviders || []) {
    if (
      targetedSet.has(provider.provider_name) &&
      !seen.has(provider.provider_name)
    ) {
      seen.add(provider.provider_name);
      filteredProviders.push(provider);
    }
  }

  // Sort the filtered results
  filteredProviders.sort((a, b) =>
    a.provider_name.toLowerCase().localeCompare(b.provider_name.toLowerCase()),
  );

  return (
    <CustomBottomSheetModal modalRef={modalRef}>
      <BottomSheetView style={{ paddingBottom: safeBottomArea }}>
        <FlatList
          horizontal
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
          showsHorizontalScrollIndicator={false}
          data={Object.values(MovieOption)}
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
              data={filteredProviders}
              renderItem={({ item }) => (
                <ButtonSingleState
                  key={item.provider_id}
                  text={item.provider_name}
                  onPress={() => {
                    modalRef.current?.dismiss();
                    router.push({
                      pathname: "/(tabs)/(find)/movie-discover",
                      params: {
                        screenTitle: item.provider_name,
                        provider: JSON.stringify(item),
                      },
                    });
                  }}
                />
              )}
              keyExtractor={(item) => item.provider_id.toString()}
            />
          )}
        </ScrollView>
      </BottomSheetView>
    </CustomBottomSheetModal>
  );
}
