import { Image } from "expo-image";
import { Color } from "expo-router";
import { Pressable, Switch, Text, View, ViewStyle } from "react-native";
import { iOSUIKit } from "react-native-typography";

type Props = {
  title: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
  style?: ViewStyle;
  showLock?: boolean;
  onLockPress?: () => void;
};

export const NotificationSetting = ({
  title,
  onValueChange,
  value,
  style,
  showLock,
  onLockPress,
}: Props) => (
  <Pressable
    onPress={showLock ? onLockPress : undefined}
    style={[
      {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: Color.ios.secondarySystemGroupedBackground,
        minHeight: 44,
      },
      style,
    ]}
  >
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      {showLock && (
        <Image
          source="sf:lock.fill"
          tintColor={Color.ios.secondaryLabel as string}
          style={{ aspectRatio: 1, height: iOSUIKit.bodyObject.fontSize }}
        />
      )}
      <Text style={{ ...iOSUIKit.bodyObject, color: Color.ios.label }}>
        {title}
      </Text>
    </View>
    <Switch
      style={{ alignSelf: "center" }}
      // trackColor={{ false: "red", true: Color.ios.systemBlue }}
      onValueChange={showLock ? onLockPress : onValueChange}
      value={value}
    />
  </Pressable>
);
