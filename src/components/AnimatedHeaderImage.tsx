import { Image } from "expo-image";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BackdropSize } from "tmdb-ts";

export function AnimatedHeaderImage({
  scrollOffset,
  path,
}: {
  scrollOffset: SharedValue<number>;
  path: string;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const backdropHeight = windowWidth / (16 / 9);

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale:
            scrollOffset.value < 0
              ? (backdropHeight + Math.abs(scrollOffset.value)) / backdropHeight
              : 1,
        },
        {
          translateY: interpolate(
            scrollOffset.value,
            [scrollOffset.value, 0],
            [
              // No idea why this math is working but after dividing the scale by 2, this looks perfect
              // Could 2 be the key because I'm spreading the height on two sides?
              scrollOffset.value /
                ((backdropHeight + Math.abs(scrollOffset.value)) /
                  backdropHeight) /
                2,
              0,
            ],
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[{ width: windowWidth, height: backdropHeight }, headerStyle]}
    >
      <Image
        source={`https://image.tmdb.org/t/p/${BackdropSize.W780}${path}`}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            experimental_backgroundImage:
              "linear-gradient(to bottom, transparent 80%, rgba(0, 0, 0, 1) 100%)",
          },
        ]}
      />
    </Animated.View>
  );
}
