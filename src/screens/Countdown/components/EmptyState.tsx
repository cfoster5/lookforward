import { router, Stack } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { CountdownLimitBanner } from "@/components/CountdownLimitBanner";
import { IconSymbol } from "@/components/IconSymbol";
import { useAuthStore } from "@/stores/auth";
import { useInterfaceStore } from "@/stores/interface";
import { colors } from "@/theme/colors";

export const EmptyState = () => {
  const { isPro } = useAuthStore();
  const { setCategoryIndex } = useInterfaceStore();

  return (
    <>
      <Stack.Screen.Title large>Countdown</Stack.Screen.Title>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          // paddingHorizontal: 32,
          marginHorizontal: 16,
        }}
      >
        <IconSymbol
          name="calendar.badge.clock"
          size={64}
          color={colors.secondaryLabel as string}
          style={{ marginBottom: 16 }}
        />
        <Text
          style={[
            iOSUIKit.title3Emphasized,
            {
              color: colors.label,
              textAlign: "center",
              marginBottom: 8,
            },
          ]}
        >
          Track your most anticipated releases
        </Text>
        {isPro && (
          <Text
            style={[
              iOSUIKit.body,
              {
                color: colors.secondaryLabel,
                textAlign: "center",
                // marginBottom: 24,
                // marginBottom: 8,
              },
            ]}
          >
            Search for movies, games, or people to add to your countdown list
          </Text>
        )}

        <CountdownLimitBanner showOnEmpty />
        <View style={{ flexDirection: "row", gap: 12, paddingTop: 8 }}>
          <Pressable
            onPress={() => {
              router.push("/(tabs)/(find)");
              setCategoryIndex(0);
            }}
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: colors.secondarySystemBackground,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 26,
              borderCurve: "continuous",
              minHeight: 44,
              justifyContent: "center",
            }}
          >
            <Text style={[iOSUIKit.bodyEmphasized, { color: "white" }]}>
              Browse Movies
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("/(tabs)/(find)");
              setCategoryIndex(1);
            }}
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: colors.secondarySystemBackground,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 26,
              borderCurve: "continuous",
              minHeight: 44,
              justifyContent: "center",
            }}
          >
            <Text style={[iOSUIKit.bodyEmphasized, { color: colors.label }]}>
              Browse Games
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};
