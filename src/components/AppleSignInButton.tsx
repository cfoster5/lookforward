import { AppleButton } from "@invertase/react-native-apple-authentication";
import { Platform, StyleProp, ViewStyle } from "react-native";

import { signInWithApple } from "@/utils/appleAuth";

type Props = {
  style?: StyleProp<ViewStyle>;
  buttonType?: "sign-in" | "continue" | "sign-up";
};

export function AppleSignInButton({ style, buttonType = "sign-in" }: Props) {
  // Only render on iOS
  if (Platform.OS !== "ios") {
    return null;
  }

  const appleButtonType = {
    "sign-in": AppleButton.Type.SIGN_IN,
    continue: AppleButton.Type.CONTINUE,
    "sign-up": AppleButton.Type.SIGN_UP,
  }[buttonType];

  return (
    <AppleButton
      buttonStyle={AppleButton.Style.WHITE}
      buttonType={appleButtonType}
      cornerRadius={12}
      style={[
        {
          width: "100%",
          height: 50,
        },
        style,
      ]}
      onPress={signInWithApple}
    />
  );
}
