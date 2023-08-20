import analytics from "@react-native-firebase/analytics";
import { PlatformColor, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { LargeBorderlessButton } from "./LargeBorderlessButton";
import { LargeFilledButton } from "./LargeFilledButton";

import { DynamicHeightModal } from "@/components/DynamicHeightModal";
import { Row } from "@/components/Row";
import { useStore } from "@/stores/store";

type Props = { modalRef: any };

export const OnboardingModal = ({ modalRef }: Props) => {
  const { onboardingModalRef, proModalRef } = useStore();
  const { bottom: safeBottomArea } = useSafeAreaInsets();

  return (
    <DynamicHeightModal modalRef={modalRef}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingBottom: safeBottomArea,
          backgroundColor: PlatformColor("secondarySystemBackground"),
        }}
      >
        <Text
          style={[
            iOSUIKit.largeTitleEmphasized,
            {
              color: PlatformColor("label"),
              textAlign: "center",
              paddingBottom: 16,
            },
          ]}
        >
          Getting Started
        </Text>
        <Row
          icon="search"
          title="Find"
          body="Discover movie and game releases by searching for title, cast, or crew."
        />
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
        <Row
          icon="notifications-outline"
          title="Notifications"
          body="Enable push notifications to be reminded about releases in your list that are a week or day away."
        />
        <LargeFilledButton
          disabled={false}
          style={{ marginVertical: 16 }}
          handlePress={() => onboardingModalRef.current?.dismiss()}
          text="Continue"
        />
        <LargeBorderlessButton
          handlePress={async () => {
            onboardingModalRef.current?.dismiss();
            proModalRef.current?.present();
            await analytics().logEvent("select_promotion", {
              id: "com.lookforward.pro",
            });
          }}
          text="Explore Pro Features"
        />
      </View>
    </DynamicHeightModal>
  );
};
