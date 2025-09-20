import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { SearchBarProps } from "react-native-screens";

export function useSearch(options: Omit<SearchBarProps, "ref"> = {}) {
  const [search, setSearch] = useState("");
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
    };

    navigation.setOptions({
      headerShown: true,
      headerSearchBarOptions: interceptedOptions,
    });
  }, [options, navigation]);

  return search;
}
