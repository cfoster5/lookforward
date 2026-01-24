import { Image } from "expo-image";
import { Color } from "expo-router";
import { View } from "react-native";

export const RadioButton = ({ isSelected }: { isSelected: boolean }) => (
  <View
    style={{
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Color.ios.systemGray,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {isSelected && (
      <View
        style={{
          height: 24,
          width: 24,
          borderRadius: 12,
          backgroundColor: Color.ios.systemBlue,
          justifyContent: "center",
        }}
      >
        <Image
          source="sf:checkmark"
          style={{
            fontSize: 16,
            alignSelf: "center",
          }}
          tintColor={Color.ios.label}
        />
      </View>
    )}
  </View>
);
