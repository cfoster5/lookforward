import { Pressable, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { useInterfaceStore } from "@/stores/interface";
import { colors } from "@/theme/colors";

export default function ButtonMultiState({
  text,
  selectedVal,
  onPress,
  test,
  children,
}: {
  text: string;
  selectedVal: string | number;
  onPress: any;
  test?: any;
  children?: any;
}) {
  const theme = useInterfaceStore((s) => s.theme);
  return (
    <Pressable
      onPress={onPress}
      style={{
        // Below colors extracted from Apple Fitness category buttons
        backgroundColor:
          selectedVal === (test !== undefined ? test : text)
            ? colors.systemGray4
            : undefined,
        borderColor: colors.systemGray4,
        borderWidth: 1,
        borderRadius: 22,
        paddingHorizontal: 24,
        paddingVertical: 8,
        marginRight: 8,
        marginTop: 16,
        minHeight: 44,
        justifyContent: "center",
      }}
    >
      <Text
        style={
          theme === "dark"
            ? { ...iOSUIKit.footnoteEmphasizedObject, color: "white" }
            : { ...iOSUIKit.bodyObject }
        }
      >
        {text}
        {children}
      </Text>
    </Pressable>
  );
}
