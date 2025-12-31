import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { SearchBarProps } from "react-native-screens";

import { useInterfaceStore } from "@/stores";

export function useSearch(options: Omit<SearchBarProps, "ref"> = {}) {
  const [search, setSearch] = useState("");
  const { categoryIndex } = useInterfaceStore();
  const navigation = useNavigation();

  useEffect(() => {
    const interceptedOptions: SearchBarProps = {
      ...options,
      onChangeText(event) {
        setSearch(event.nativeEvent.text);
        options.onChangeText?.(event);
      },
      onSearchButtonPress(e) {
        setSearch(e.nativeEvent.text);
        options.onSearchButtonPress?.(e);
      },
      onCancelButtonPress(e) {
        setSearch("");
        options.onCancelButtonPress?.(e);
      },
      placeholder: categoryIndex === 0 ? "Movies and People" : "Games",
    };

    navigation.setOptions({
      headerShown: true,
      headerSearchBarOptions: interceptedOptions,
    });
  }, [options, navigation, categoryIndex]);

  return search;
}
