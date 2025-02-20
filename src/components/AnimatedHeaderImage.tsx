import { ImageBackground, StyleSheet, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BackdropSizes } from "tmdb-ts";

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

export function AnimatedHeaderImage({
  scrollOffset,
  path,
}: {
  scrollOffset: SharedValue<number>;
  path: string;
}) {
  const { width: windowWidth } = useWindowDimensions();

  const styles = StyleSheet.create({
    backdrop: {
      width: windowWidth,
      height: windowWidth / (16 / 9),
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      // opacity:
      //   scrollOffset.value < 0
      //     ? 2 -
      //       (styles.backdrop.height + Math.abs(scrollOffset.value)) /
      //         styles.backdrop.height
      //     : 1,
      transform: [
        {
          scale:
            scrollOffset.value < 0
              ? (styles.backdrop.height + Math.abs(scrollOffset.value)) /
                styles.backdrop.height
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
                ((styles.backdrop.height + Math.abs(scrollOffset.value)) /
                  styles.backdrop.height) /
                2,
              0,
            ],
          ),
        },
      ],
    };
  });

  return (
    <AnimatedImageBackground
      style={[styles.backdrop, headerStyle]}
      source={{
        uri: `https://image.tmdb.org/t/p/${BackdropSizes.W780}${path}`,
      }}
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
        start={{ x: 0, y: 0.8 }}
        end={{ x: 0, y: 1.0 }}
        style={StyleSheet.absoluteFill}
      />
    </AnimatedImageBackground>
  );
}
