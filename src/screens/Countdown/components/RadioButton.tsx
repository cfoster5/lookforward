import * as Colors from "@bacons/apple-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { iOSColors } from "react-native-typography";

export const RadioButton = ({ isSelected }: { isSelected: boolean }) => (
  <View
    style={{
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.systemGray,
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
          backgroundColor: Colors.systemBlue,
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
