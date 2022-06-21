import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import RadialGradient from "react-native-radial-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useGetColors } from "../hooks/useGetColors";

export function AnimatedBackground({
  uri,
  children,
}: {
  uri?: string;
  children: JSX.Element;
}) {
  const { height, width } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const { background, gradients, loading } = useGetColors(
    `https://image.tmdb.org/t/p/w300${uri}`,
    height,
    width,
    headerHeight
  );
  const interval = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: Math.cos(interval.value) * 100 },
        { translateY: Math.sin(interval.value) * 100 },
        // { scale: 1.25 },
      ],
    };
  });

  useEffect(() => {
    interval.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 15000, easing: Easing.linear }),
      Infinity
    );
  }, []);

  return (
    <>
      {!loading ? (
        <View
          style={{ flex: 1, backgroundColor: background, overflow: "hidden" }}
        >
          <Animated.View style={animatedStyles}>
            {gradients.map((gradient, index) => (
              <RadialGradient
                key={index}
                style={{
                  width,
                  height,
                  position: "absolute",
                  transform: [{ scale: 1.5 }],
                }}
                // Adding 00 to end of color makes it transparent
                colors={[`${gradient.color}`, `${gradient.color}00`]}
                center={gradient.center}
              />
            ))}
          </Animated.View>
          <BlurView
            style={StyleSheet.absoluteFill}
            // Adapts to device setting, so manually setting to dark
            blurType="dark"
            // blurAmount={100}
            reducedTransparencyFallbackColor="white"
          />
          {children}
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </>
  );
}
