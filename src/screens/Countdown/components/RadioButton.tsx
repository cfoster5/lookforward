import { Image } from "expo-image";
import { Platform, View } from "react-native";

import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/theme/colors";

export const RadioButton = ({ isSelected }: { isSelected: boolean }) => (
  <View
    style={{
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: !isSelected ? 1 : 0,
      borderColor: colors.systemGray,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: !isSelected ? undefined : colors.systemBlue,
    }}
  >
    {isSelected &&
      (Platform.OS === "ios" ? (
        <Image
          source="sf:checkmark"
          sfEffect="draw/on"
          style={{ fontSize: 16 }}
          tintColor={colors.label as string}
        />
      ) : (
        <IconSymbol name="checkmark" size={16} color={colors.label as string} />
      ))}
  </View>
);
