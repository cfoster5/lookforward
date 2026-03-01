import * as Haptics from "expo-haptics";
import { Color } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

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
    borderColor: Color.ios.systemGray4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    minHeight: 56,
  },
  rowSelected: {
    backgroundColor: Color.ios.systemGray6,
    borderColor: Color.ios.label,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Color.ios.systemGray3,
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
