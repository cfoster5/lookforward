import * as Colors from "@bacons/apple-colors";
import { Switch, Text, View, ViewStyle } from "react-native";
import { iOSUIKit } from "react-native-typography";

type Props = {
  title: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
  style?: ViewStyle;
};

export const NotificationSetting = ({
  title,
  onValueChange,
  value,
  style,
}: Props) => (
  <View
    style={[
      {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: Colors.secondarySystemGroupedBackground,
        minHeight: 44,
      },
      style,
    ]}
  >
    <Text style={{ ...iOSUIKit.bodyObject, color: Colors.label }}>{title}</Text>
    <Switch
      style={{ alignSelf: "center" }}
      // trackColor={{ false: "red", true: Colors.systemBlue }}
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);
