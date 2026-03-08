import { useEffect } from "react";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const RADIO_BUTTON_WIDTH = 24;
const IMAGE_LEFT_MARGIN = 16;
const IMAGE_WIDTH = 60;
const IMAGE_RIGHT_MARGIN = 8;
const TITLE_START_X_WITH_RADIO =
  RADIO_BUTTON_WIDTH + IMAGE_LEFT_MARGIN + IMAGE_WIDTH + IMAGE_RIGHT_MARGIN;

export function useCountdownItemAnimation(isEditing: boolean) {
  const transformAmount = useSharedValue(-24);

  useEffect(() => {
    transformAmount.value = withTiming(isEditing ? 16 : -24);
  }, [isEditing, transformAmount]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: transformAmount.value }],
  }));

  const radioButtonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(transformAmount.value, [-24, 16], [0, 1]),
  }));

  const separatorStyle = useAnimatedStyle(() => ({
    left: TITLE_START_X_WITH_RADIO + transformAmount.value,
  }));

  return { slideStyle, radioButtonStyle, separatorStyle };
}
