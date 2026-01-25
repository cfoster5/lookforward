import { Image } from "expo-image";
import { Color } from "expo-router";
import { View } from "react-native";

export const RadioButton = ({ isSelected }: { isSelected: boolean }) => (
  <View
    style={{
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: !isSelected ? 1 : 0,
      borderColor: Color.ios.systemGray,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: !isSelected ? undefined : Color.ios.systemBlue,
    }}
  >
    {isSelected && (
      <Image
        source="sf:checkmark"
        sfEffect="draw/on"
        style={{ fontSize: 16 }}
        tintColor={Color.ios.label}
      />
    )}
  </View>
);
