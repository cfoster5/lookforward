import * as Colors from "@bacons/apple-colors";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { ScrollView, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { useAuthStore } from "@/stores/auth";

export default function WidgetPromotionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const useGlassEffect = isLiquidGlassAvailable();
  const { hasSeenWidgetPromotion, setHasSeenWidgetPromotion } = useAuthStore();

  const handleDontShowAgain = (value: boolean) => {
    setHasSeenWidgetPromotion(value);
    if (value) {
      // Navigate back after setting the preference
      router.back();
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: insets.bottom + 16,
      }}
      showsVerticalScrollIndicator={!useGlassEffect}
    >
      {/* Congratulations Section */}
      <View style={{ marginTop: 32, marginBottom: 24 }}>
        <Text
          style={{
            ...iOSUIKit.largeTitleEmphasizedObject,
            color: Colors.label,
            marginBottom: 8,
          }}
        >
          🎉 Welcome to Pro!
        </Text>
        <Text
          style={{
            ...iOSUIKit.bodyObject,
            color: Colors.secondaryLabel,
            lineHeight: 22,
          }}
        >
          You now have access to all premium features, including home screen
          widgets!
        </Text>
      </View>

      {/* Widget Feature Card */}
      <View
        style={{
          backgroundColor: Colors.secondarySystemGroupedBackground,
          borderRadius: 26,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            ...iOSUIKit.title3EmphasizedObject,
            color: Colors.label,
            marginBottom: 12,
          }}
        >
          Home Screen Widgets
        </Text>
        <Text
          style={{
            ...iOSUIKit.bodyObject,
            color: Colors.secondaryLabel,
            lineHeight: 22,
            marginBottom: 16,
          }}
        >
          See your upcoming movie and game releases at a glance - no need to
          open the app.
        </Text>

        {/* Benefits */}
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>✓</Text>
            <Text
              style={{
                ...iOSUIKit.subheadObject,
                color: Colors.label,
                flex: 1,
              }}
            >
              Quick access to your countdowns
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>✓</Text>
            <Text
              style={{
                ...iOSUIKit.subheadObject,
                color: Colors.label,
                flex: 1,
              }}
            >
              Available in Small, Medium, and Large sizes
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>✓</Text>
            <Text
              style={{
                ...iOSUIKit.subheadObject,
                color: Colors.label,
                flex: 1,
              }}
            >
              Always shows your next 3 upcoming releases
            </Text>
          </View>
        </View>
      </View>

      {/* How to Add Widget Instructions */}
      <Text
        style={{
          ...iOSUIKit.title3EmphasizedObject,
          color: Colors.label,
          marginBottom: 16,
        }}
      >
        How to Add the Widget
      </Text>

      <View style={{ gap: 16, marginBottom: 32 }}>
        {/* Step 1 */}
        <View
          style={{
            backgroundColor: Colors.secondarySystemGroupedBackground,
            borderRadius: 20,
            padding: 16,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: Colors.systemBlue,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ ...iOSUIKit.bodyEmphasizedObject, color: "#FFFFFF" }}
            >
              1
            </Text>
          </View>
          <Text
            style={{
              ...iOSUIKit.subheadEmphasizedObject,
              color: Colors.label,
              marginBottom: 6,
            }}
          >
            Long press on your home screen
          </Text>
          <Text
            style={{ ...iOSUIKit.footnoteObject, color: Colors.secondaryLabel }}
          >
            Touch and hold an empty area until your apps start jiggling
          </Text>
        </View>

        {/* Step 2 */}
        <View
          style={{
            backgroundColor: Colors.secondarySystemGroupedBackground,
            borderRadius: 20,
            padding: 16,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: Colors.systemBlue,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ ...iOSUIKit.bodyEmphasizedObject, color: "#FFFFFF" }}
            >
              2
            </Text>
          </View>
          <Text
            style={{
              ...iOSUIKit.subheadEmphasizedObject,
              color: Colors.label,
              marginBottom: 6,
            }}
          >
            Tap the + button in the top left
          </Text>
          <Text
            style={{ ...iOSUIKit.footnoteObject, color: Colors.secondaryLabel }}
          >
            This opens the widget gallery
          </Text>
        </View>

        {/* Step 3 */}
        <View
          style={{
            backgroundColor: Colors.secondarySystemGroupedBackground,
            borderRadius: 20,
            padding: 16,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: Colors.systemBlue,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ ...iOSUIKit.bodyEmphasizedObject, color: "#FFFFFF" }}
            >
              3
            </Text>
          </View>
          <Text
            style={{
              ...iOSUIKit.subheadEmphasizedObject,
              color: Colors.label,
              marginBottom: 6,
            }}
          >
            Search for &ldquo;LookForward&rdquo;
          </Text>
          <Text
            style={{ ...iOSUIKit.footnoteObject, color: Colors.secondaryLabel }}
          >
            Select your preferred widget size and tap &ldquo;Add Widget&rdquo;
          </Text>
        </View>
      </View>

      {/* Don't Show Again Toggle */}
      <View
        style={{
          backgroundColor: Colors.secondarySystemGroupedBackground,
          borderRadius: 26,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ ...iOSUIKit.bodyObject, color: Colors.label }}>
          Don&apos;t show this again
        </Text>
        <Switch
          value={hasSeenWidgetPromotion}
          onValueChange={handleDontShowAgain}
          trackColor={{ false: Colors.systemGray5, true: Colors.systemGreen }}
        />
      </View>
    </ScrollView>
  );
}
