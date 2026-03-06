import { Image } from "expo-image";
import {
  Platform,
  Pressable,
  Switch,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { iOSUIKit } from "react-native-typography";

import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/theme/colors";

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
        backgroundColor: colors.secondarySystemGroupedBackground,
        minHeight: 44,
      },
      style,
    ]}
  >
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      {showLock &&
        (Platform.OS === "ios" ? (
          <Image
            source="sf:lock.fill"
            tintColor={colors.secondaryLabel as string}
            style={{ aspectRatio: 1, height: iOSUIKit.bodyObject.fontSize }}
          />
        ) : (
          <IconSymbol
            name="lock.fill"
            size={iOSUIKit.bodyObject.fontSize}
            color={colors.secondaryLabel as string}
          />
        ))}
      <Text style={{ ...iOSUIKit.bodyObject, color: colors.label }}>
        {title}
      </Text>
    </View>
    <Switch
      style={{ alignSelf: "center" }}
      // trackColor={{ false: "red", true: colors.systemBlue }}
      onValueChange={showLock ? onLockPress : onValueChange}
      value={value}
    />
  </Pressable>
);
