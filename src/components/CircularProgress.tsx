import { useEffect } from "react";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type CircularProgressProps = {
  currentStep: number;
  totalSteps: number;
};

const SIZE = 28;
const STROKE_WIDTH = 3;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CircularProgress({
  currentStep,
  totalSteps,
}: CircularProgressProps) {
  const progress = useSharedValue(Math.max(0, (currentStep - 1) / totalSteps));

  useEffect(() => {
    progress.value = withTiming(currentStep / totalSteps, { duration: 400 });
  }, [currentStep, totalSteps, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <Svg width={SIZE} height={SIZE}>
      <Circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <G transform={`rotate(-90, ${SIZE / 2}, ${SIZE / 2})`}>
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="white"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}
