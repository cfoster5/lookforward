import { Ionicons } from "@expo/vector-icons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import { Linking, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";
import * as Colors from "@bacons/apple-colors";

import { DynamicHeightModal } from "@/components/DynamicHeightModal";
import { Row } from "@/components/Row";
import { ContextMenu } from "@/screens/Search/components/SearchBottomSheet/ContextMenu";
import { useStore } from "@/stores/store";

import { LargeBorderlessButton } from "./LargeBorderlessButton";
import { LargeFilledButton } from "./LargeFilledButton";

export const OnboardingModal = () => {
  const { onboardingModalRef, proModalRef } = useStore();
  const { bottom: safeBottomArea } = useSafeAreaInsets();

  return (
    <DynamicHeightModal modalRef={onboardingModalRef}>
      <BottomSheetView
        style={{
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingBottom: safeBottomArea,
          backgroundColor: Colors.secondarySystemBackground,
        }}
      >
        <Text
          style={[
            iOSUIKit.largeTitleEmphasized,
            {
              color: Colors.label,
              textAlign: "center",
              paddingBottom: 16,
            },
          ]}
        >
          Getting Started
        </Text>
        <ContextMenu isOnboarding>
          <Row
            icon="search"
            title="Find"
            body="Discover movie and game releases by searching for title, cast, or crew. Holding down on an item will give you more options. Give it a try!"
          />
        </ContextMenu>
        <Row
          icon="timer-outline"
          title="Countdown"
          body="Add titles to your list so you can see release dates on the Countdown tab."
        />
        <Row
          icon="information-circle-outline"
          title="Details"
          body="Tap on a title to see genres, credits, trailers, and so much more."
        />
        <Pressable onPress={() => Linking.openSettings()}>
          <Row
            icon="notifications-outline"
            title="Notifications"
            body="Allow push notifications to be reminded about releases in your list that are a week or day away."
            showDrillIn
          />
        </Pressable>
        <LargeFilledButton
          disabled={false}
          style={{ marginVertical: 16 }}
          handlePress={() => onboardingModalRef.current?.dismiss()}
          text="Continue"
        />
        {/* <LargeBorderlessButton
          handlePress={async () => {
            onboardingModalRef.current?.dismiss();
            proModalRef.current?.present();
            const analytics = getAnalytics();
            await logEvent(analytics, "select_promotion", {
              name: "Pro",
              id: "com.lookforward.pro",
            });
          }}
          text="Explore Pro Features"
        /> */}
      </BottomSheetView>
    </DynamicHeightModal>
  );
};
