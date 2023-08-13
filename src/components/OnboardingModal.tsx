import { PlatformColor, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

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
        <Pressable
          style={{
            backgroundColor: PlatformColor("systemBlue"),
            minHeight: 44,
            minWidth: 44,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 16,
          }}
          onPress={() => onboardingModalRef.current?.dismiss()}
        >
          <Text style={[iOSUIKit.bodyEmphasized, { color: "white" }]}>
            Continue
          </Text>
        </Pressable>
        <Pressable
          style={{
            // backgroundColor: PlatformColor("systemBlue"),
            minHeight: 44,
            minWidth: 44,
            alignItems: "center",
            justifyContent: "center",
            // marginVertical: 16,
          }}
          onPress={() => {
            onboardingModalRef.current?.dismiss();
            proModalRef.current?.present();
          }}
        >
          <Text
            style={[
              iOSUIKit.bodyEmphasized,
              { color: PlatformColor("systemBlue") },
            ]}
          >
            Explore Pro Features
          </Text>
        </Pressable>
      </View>
    </DynamicHeightModal>
  );
};
