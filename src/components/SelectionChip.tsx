import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { colors } from "@/theme/colors";

type SelectionChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectionChip({
  label,
  selected,
  onPress,
}: SelectionChipProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        onPress();
      }}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={[iOSUIKit.subhead, styles.label]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.systemGray4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  chipSelected: {
    borderColor: colors.label,
    backgroundColor: colors.systemGray6,
  },
  label: { color: "white" },
});
