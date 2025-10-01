import { useEffect } from "react";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

  return { slideStyle, radioButtonStyle };
}
