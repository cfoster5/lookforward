import { Color, router, Stack } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { IconSymbol } from "@/components/IconSymbol";
import { CountdownLimitBanner } from "@/screens/Search/components/CountdownLimitBanner";
import { useAuthStore } from "@/stores";
import { useInterfaceStore } from "@/stores/interface";

export const EmptyState = () => {
  const { top: safeTopArea } = useSafeAreaInsets();
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
          // paddingTop: safeTopArea + 60,
          marginHorizontal: 16,
        }}
      >
        <IconSymbol
          name="calendar.badge.clock"
          size={64}
          color={Color.ios.secondaryLabel as string}
          style={{ marginBottom: 16 }}
        />
        <Text
          style={[
            iOSUIKit.title3Emphasized,
            {
              color: Color.ios.label,
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
                color: Color.ios.secondaryLabel,
                textAlign: "center",
                // marginBottom: 24,
                // marginBottom: 8,
              },
            ]}
          >
            Search for movies and games to add to your countdown list
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
              backgroundColor: Color.ios.secondarySystemBackground,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 10,
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
              backgroundColor: Color.ios.secondarySystemBackground,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 10,
              minHeight: 44,
              justifyContent: "center",
            }}
          >
            <Text style={[iOSUIKit.bodyEmphasized, { color: Color.ios.label }]}>
              Browse Games
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};
