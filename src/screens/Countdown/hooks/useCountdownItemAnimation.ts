import { useEffect } from "react";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const RADIO_BUTTON_WIDTH = 24;
const RADIO_BUTTON_MARGIN = 16;
const RADIO_TOTAL = RADIO_BUTTON_WIDTH + RADIO_BUTTON_MARGIN;
const IMAGE_LEFT_MARGIN = 16;
const IMAGE_WIDTH = 60;
const IMAGE_RIGHT_MARGIN = 8;
const TITLE_START_X_WITH_RADIO =
  RADIO_TOTAL + IMAGE_LEFT_MARGIN + IMAGE_WIDTH + IMAGE_RIGHT_MARGIN;

export function useCountdownItemAnimation(isEditing: boolean) {
  const progress = useSharedValue(isEditing ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isEditing ? 1 : 0);
  }, [isEditing, progress]);

  const radioButtonStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [0, RADIO_TOTAL]),
    opacity: progress.value,
  }));

  const separatorStyle = useAnimatedStyle(() => ({
    left: interpolate(
      progress.value,
      [0, 1],
      [
        IMAGE_LEFT_MARGIN + IMAGE_WIDTH + IMAGE_RIGHT_MARGIN,
        TITLE_START_X_WITH_RADIO,
      ],
    ),
  }));

  return { radioButtonStyle, separatorStyle };
}
