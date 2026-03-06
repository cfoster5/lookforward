import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { colors } from "@/theme/colors";

type InterestOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function InterestOption({
  label,
  selected,
  onPress,
}: InterestOptionProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        onPress();
      }}
      style={({ pressed }) => [
        styles.row,
        selected && styles.rowSelected,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Text style={styles.checkmark}>{"\u2713"}</Text>}
      </View>
      <Text style={[iOSUIKit.bodyEmphasized, styles.label]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.systemGray4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    minHeight: 56,
  },
  rowSelected: {
    backgroundColor: colors.systemGray6,
    borderColor: colors.label,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.systemGray3,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "white",
    borderColor: "white",
  },
  checkmark: {
    fontSize: 14,
    fontWeight: "700",
    color: "black",
  },
  label: {
    color: "white",
  },
});
