import { StyleSheet, Switch, Text, View, ViewStyle } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { Colors } from "@/constants/Colors";

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
  <View style={styles.itemContainer}>
    <View style={[styles.item, style]}>
      <Text style={iOSUIKit.bodyWhite}>{title}</Text>
      <Switch
        trackColor={{ false: "red", true: Colors.blue }}
        style={{ marginRight: 16 }}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: Colors.gray6,
    paddingLeft: 16,
    alignItems: "center",
  },
  item: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    paddingVertical: 16,
  },
});
