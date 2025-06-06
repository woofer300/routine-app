import { View, Text, Pressable } from "react-native";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";

export default function Task({
  text,
  id,
  removeTask,
}: {
  text: string;
  id: number;
  removeTask: (id: number) => void;
}) {
  type TaskState = "bar-not-full" | "bar-full" | "color-transitioned";

  const [taskState, setTaskState] = useState<TaskState>("bar-not-full");

  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const taskWidth = screenWidth - insets.left - insets.right;
  const taskHeight = screenHeight - insets.top - insets.bottom;

  const timeToFillProgressBar = 1000;
  const timeToTransitionColor = 200;

  const thickness = 0.0813 * Math.min(taskWidth, taskHeight);

  const sectionOneWidth = taskWidth / 2;
  const sectionTwoHeight = taskHeight - thickness;
  const sectionThreeWidth = taskWidth - thickness;
  const sectionFourHeight = taskHeight - thickness;
  const sectionFiveWidth = taskWidth / 2 - thickness;
  const totalDistance =
    sectionOneWidth +
    sectionTwoHeight +
    sectionThreeWidth +
    sectionFourHeight +
    sectionFiveWidth;

  const msPerDp = timeToFillProgressBar / totalDistance;

  const coveredDistance = useSharedValue(0);

  const colorShiftProgress = useSharedValue(0);

  const sectionOneCoveredWidth = useDerivedValue(() => {
    return Math.min(coveredDistance.value, sectionOneWidth);
  });
  const sectionTwoCoveredHeight = useDerivedValue(() => {
    return Math.max(
      0,
      Math.min(coveredDistance.value - sectionOneWidth, sectionTwoHeight),
    );
  });
  const sectionThreeCoveredWidth = useDerivedValue(() => {
    return Math.max(
      0,
      Math.min(
        coveredDistance.value - sectionOneWidth - sectionTwoHeight,
        sectionThreeWidth,
      ),
    );
  });
  const sectionFourCoveredHeight = useDerivedValue(() => {
    return Math.max(
      0,
      Math.min(
        coveredDistance.value -
          sectionOneWidth -
          sectionTwoHeight -
          sectionThreeWidth,
        sectionFourHeight,
      ),
    );
  });
  const sectionFiveCoveredWidth = useDerivedValue(() => {
    return Math.max(
      0,
      Math.min(
        coveredDistance.value -
          sectionOneWidth -
          sectionTwoHeight -
          sectionThreeWidth -
          sectionFourHeight,
        sectionFiveWidth,
      ),
    );
  });

  const sectionOneAnimatedStyles = useAnimatedStyle(() => ({
    width: sectionOneCoveredWidth.value,
  }));
  const sectionTwoAnimatedStyles = useAnimatedStyle(() => ({
    height: sectionTwoCoveredHeight.value,
  }));
  const sectionThreeAnimatedStyles = useAnimatedStyle(() => ({
    width: sectionThreeCoveredWidth.value,
  }));
  const sectionFourAnimatedStyles = useAnimatedStyle(() => ({
    height: sectionFourCoveredHeight.value,
  }));
  const sectionFiveAnimatedStyles = useAnimatedStyle(() => ({
    width: sectionFiveCoveredWidth.value,
  }));

  const completedColorAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        colorShiftProgress.value,
        [0, 1],
        ["#9ACD32", "rgba(34, 197, 94, 1)"],
      ),
    };
  });

  function onPressIn() {
    coveredDistance.value = withTiming(
      totalDistance,
      {
        duration: (totalDistance - coveredDistance.value) * msPerDp,
        easing: Easing.linear,
      },
      (wasNotCancelled) => {
        if (wasNotCancelled) {
          runOnJS(setTaskState)("bar-full");
        }
      },
    );
  }

  function onPressOut() {
    coveredDistance.value = withTiming(0, {
      duration: coveredDistance.value * msPerDp,
      easing: Easing.linear,
    });
  }

  useEffect(() => {
    if (taskState === "color-transitioned") {
      setTimeout(() => removeTask(id), 500);
    } else {
      colorShiftProgress.value = withTiming(
        taskState === "bar-full" ? 1 : 0,
        {
          duration: timeToTransitionColor,
        },
        (wasNotCancelled) => {
          if (wasNotCancelled && taskState === "bar-full") {
            runOnJS(setTaskState)("color-transitioned");
          }
        },
      );
    }
  }, [taskState]);

  // Base style with positioning that respects SafeAreaView
  const positionStyle = {
    top: insets.top,
    left: insets.left,
    width: taskWidth,
    height: taskHeight,
    zIndex: 256 - id,
  };

  return taskState === "bar-full" ? (
    <Animated.View
      className="absolute flex items-center justify-center bg-blue-950"
      style={[
        positionStyle,
        { borderWidth: thickness },
        completedColorAnimatedStyle,
      ]}
    >
      <Text className="text-center text-5xl font-semibold text-gray-100 sm:text-7xl lg:text-8xl">
        {text}
      </Text>
    </Animated.View>
  ) : taskState === "bar-not-full" ? (
    <Pressable
      className="absolute flex items-center justify-center bg-blue-950"
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={positionStyle}
    >
      <View style={{ padding: thickness }}>
        <Text className="text-center text-5xl font-semibold text-gray-100 sm:text-7xl lg:text-8xl">
          {text}
        </Text>
      </View>
      {/* Progress bar */}
      <View
        className="absolute"
        style={{ width: taskWidth, height: taskHeight }}
      >
        {/* Gray border */}
        <View
          className="absolute z-0 border-gray-700"
          style={{
            borderWidth: thickness,
            width: taskWidth,
            height: taskHeight,
          }}
        />
        {/* Sections of green progress */}
        <Animated.View
          className="absolute left-1/2 top-0 z-10 bg-yellowGreen"
          style={[{ height: thickness }, sectionOneAnimatedStyles]}
        />
        <Animated.View
          className="absolute right-0 z-10 bg-yellowGreen"
          style={[
            {
              top: thickness,
              width: thickness,
            },
            sectionTwoAnimatedStyles,
          ]}
        />
        <Animated.View
          className="absolute bottom-0 z-10 bg-yellowGreen"
          style={[
            {
              right: thickness,
              height: thickness,
            },
            sectionThreeAnimatedStyles,
          ]}
        />
        <Animated.View
          className="absolute left-0 z-10 bg-yellowGreen"
          style={{
            bottom: thickness,
            width: thickness,
            height: sectionFourCoveredHeight,
          }}
        />
        <Animated.View
          className="absolute top-0 z-10 bg-yellowGreen"
          style={{
            left: thickness,
            width: sectionFiveCoveredWidth,
            height: thickness,
          }}
        />
      </View>
    </Pressable>
  ) : (
    <View
      className="absolute flex items-center justify-center border-green-500 bg-blue-950"
      style={[positionStyle, { borderWidth: thickness }]}
    >
      <Text className="text-center text-5xl font-semibold text-gray-100 sm:text-7xl lg:text-8xl">
        {text}
      </Text>
    </View>
  );
}
