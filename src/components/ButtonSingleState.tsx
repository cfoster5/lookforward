import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Pressable, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { useInterfaceStore } from "@/stores/interface";
import { colors } from "@/theme/colors";

export default function ButtonSingleState({
  text,
  onPress,
  buttonStyle,
  icon,
  textStyle,
}: {
  text: string;
  onPress: any;
  buttonStyle?: any;
  icon?: string;
  textStyle?: any;
}) {
  const { theme } = useInterfaceStore();
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.systemGray4,
        borderColor: colors.systemGray4,
        // Use below when animated background with colors is implemented
        // backgroundColor: "transparent",
        // borderColor: "#636366",
        borderWidth: 1,
        borderRadius: 22,
        paddingHorizontal: 24,
        paddingVertical: 8,
        marginRight: 8,
        marginTop: 16,
        justifyContent: "center",
        minHeight: 44,
        ...buttonStyle,
      }}
    >
      {icon && (
        <FontAwesome6
          name={icon}
          color="white"
          style={{ marginRight: 8, alignSelf: "center" }}
          size={iOSUIKit.footnoteEmphasizedObject.lineHeight}
        />
      )}
      <Text
        style={[
          theme === "dark"
            ? { ...iOSUIKit.footnoteEmphasizedObject, color: "white" }
            : { ...iOSUIKit.bodyObject },
          textStyle,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}
