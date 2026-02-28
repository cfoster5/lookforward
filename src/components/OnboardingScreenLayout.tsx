import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { Color } from "expo-router";
import { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { CircularProgress } from "@/components/CircularProgress";

type OnboardingScreenLayoutProps = {
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
  continueEnabled: boolean;
  continueLabel?: string;
  continueColor?: string;
  onContinue: () => void;
  onBack?: () => void;
  children: ReactNode;
};

export function OnboardingScreenLayout({
  title,
  continueLabel = "Continue",
  continueColor,
  subtitle,
  currentStep,
  totalSteps,
  continueEnabled,
  onContinue,
  onBack,
  children,
}: OnboardingScreenLayoutProps) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.topBar}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <Ionicons name="chevron-back" size={28} color="white" />
          </Pressable>
        ) : (
          <View style={styles.backButton} />
        )}
        {onBack ? (
          <CircularProgress currentStep={currentStep} totalSteps={totalSteps} />
        ) : (
          <View />
        )}
      </View>

      <Text style={[iOSUIKit.largeTitleEmphasized, styles.title]}>{title}</Text>
      <Text style={[iOSUIKit.body, styles.subtitle]}>{subtitle}</Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      <View style={[styles.bottomArea, { paddingBottom: bottom + 16 }]}>
        <Pressable
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onContinue();
          }}
          disabled={!continueEnabled}
          style={({ pressed }) => [
            styles.continueButton,
            !continueEnabled && styles.continueButtonDisabled,
            continueColor && { backgroundColor: continueColor },
            { opacity: pressed && continueEnabled ? 0.8 : 1 },
          ]}
        >
          <Text
            style={[
              iOSUIKit.bodyEmphasized,
              styles.continueText,
              !continueEnabled && styles.continueTextDisabled,
              continueColor && { color: "white" },
            ]}
          >
            {continueLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
  },
  title: {
    color: "white",
    textAlign: "center",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  subtitle: {
    color: Color.ios.secondaryLabel,
    textAlign: "center",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: "white",
    borderRadius: 1000,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: Color.ios.systemGray4,
  },
  continueText: {
    color: "black",
  },
  continueTextDisabled: {
    color: Color.ios.systemGray,
  },
});
