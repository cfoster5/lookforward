import { PlatformColor, View } from "react-native";
import { iOSColors } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";

export const RadioButton = ({ isSelected }: { isSelected: boolean }) => (
  <View
    style={{
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: PlatformColor("systemGray"),
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
          backgroundColor: PlatformColor("systemBlue"),
          justifyContent: "center",
        }}
      >
        <Ionicons
          name="checkmark-outline"
          color={iOSColors.white}
          size={20}
          style={{ textAlign: "center" }}
        />
      </View>
    )}
  </View>
);
