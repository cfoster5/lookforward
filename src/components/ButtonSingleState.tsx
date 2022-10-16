import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useContext } from "react";
import { PlatformColor, Pressable, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import TabStackContext from "../contexts/TabStackContext";

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
  const { theme } = useContext(TabStackContext);
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: PlatformColor("systemGray4"),
        borderColor: PlatformColor("systemGray4"),
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
        <FontAwesomeIcon
          icon={icon}
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
