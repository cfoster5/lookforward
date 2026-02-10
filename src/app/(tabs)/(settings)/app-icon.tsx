import * as Colors from "@bacons/apple-colors";
import * as AlternateAppIcons from "expo-alternate-app-icons";
import { Image, ImageSource } from "expo-image";
import { usePostHog } from "posthog-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RevenueCatUI from "react-native-purchases-ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { useProOfferings } from "@/api/getProOfferings";
import { IconSymbol } from "@/components/IconSymbol";
import { useAuthStore } from "@/stores/auth";

const originalIcon = require("@/../assets/adaptive-icon.png");
const defaultIcon = require("@/../assets/icon.png");

type IconOption = {
  name: string | null;
  label: string;
  description: string;
  preview: ImageSource;
};

const ICONS: IconOption[] = [
  {
    name: null,
    label: "Default",
    description: "Modern design",
    preview: defaultIcon,
  },
  {
    name: "Original",
    label: "Original",
    description: "Classic design",
    preview: originalIcon,
  },
];

export default function AppIconScreen() {
  const { isPro } = useAuthStore();
  const { data: pro } = useProOfferings();
  const { bottom } = useSafeAreaInsets();
  const [selectedAppIcon, setSelectedAppIcon] = useState<string | null>(null);
  const posthog = usePostHog();

  useEffect(() => {
    const getCurrentIcon = async () => {
      const currentIcon = await AlternateAppIcons.getAppIconName();
      setSelectedAppIcon(currentIcon);
    };
    getCurrentIcon();
  }, []);

  async function handleIconSelect(iconName: string | null) {
    const isDefaultIcon = iconName === null;

    if (!isPro && !isDefaultIcon) {
      posthog.capture("app_icon:paywall_view", { type: "pro" });
      await RevenueCatUI.presentPaywall({ offering: pro });
      return;
    }

    if (iconName === selectedAppIcon) {
      return;
    }

    try {
      await AlternateAppIcons.setAlternateAppIcon(iconName);
      setSelectedAppIcon(iconName);
    } catch (error) {
      Alert.alert("Error", "Failed to change app icon. Please try again.");
      console.error("Failed to change app icon:", error);
    }
  }

  const renderItem: ListRenderItem<IconOption> = ({ item }) => {
    const isSelected = selectedAppIcon === item.name;
    const isDefaultIcon = item.name === null;
    const isLocked = !isPro && !isDefaultIcon;

    return (
      <Pressable
        style={styles.iconRow}
        onPress={() => handleIconSelect(item.name)}
      >
        <Image source={item.preview} style={styles.iconPreview} />
        <View style={styles.iconInfo}>
          <Text style={styles.iconTitle}>{item.label}</Text>
          <Text style={styles.iconSubtitle}>{item.description}</Text>
        </View>
        {isSelected && (
          <IconSymbol
            name="checkmark"
            size={iOSUIKit.bodyObject.fontSize}
            color={Colors.systemBlue}
          />
        )}
        {isLocked && (
          <IconSymbol
            name="lock.fill"
            size={iOSUIKit.bodyObject.fontSize}
            color={Colors.secondaryLabel}
          />
        )}
      </Pressable>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  const renderFooter = () => {
    if (isPro) return null;
    return (
      <Text style={styles.footer}>
        Upgrade to Pro to customize your app icon.
      </Text>
    );
  };

  const renderHeader = () => <View style={styles.sectionHeader} />;

  return (
    <FlatList
      data={ICONS}
      renderItem={renderItem}
      keyExtractor={(item) => item.name ?? "default"}
      ItemSeparatorComponent={renderSeparator}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingBottom: bottom }]}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  section: {
    backgroundColor: Colors.secondarySystemGroupedBackground,
    borderRadius: 10,
    overflow: "hidden",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  iconPreview: {
    width: 60,
    height: 60,
    borderRadius: 13,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.separator,
  },
  iconInfo: {
    flex: 1,
  },
  iconTitle: {
    ...iOSUIKit.bodyObject,
    color: Colors.label,
  },
  iconSubtitle: {
    ...iOSUIKit.footnoteObject,
    color: Colors.secondaryLabel,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    marginLeft: 84,
  },
  footer: {
    ...iOSUIKit.footnoteObject,
    color: Colors.secondaryLabel,
    marginTop: 8,
    marginHorizontal: 16,
  },
});
