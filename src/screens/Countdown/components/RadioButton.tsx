import { View } from "react-native";
import { iOSColors } from "react-native-typography";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Colors } from "@/constants/Colors";

export const RadioButton = ({ isSelected }: { isSelected: boolean }) => (
  <View
    style={{
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.gray,
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
          backgroundColor: Colors.blue,
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
