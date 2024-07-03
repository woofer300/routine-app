import { View, Text, Pressable, Dimensions } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import React, { useEffect, useRef, useState } from "react";

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

  const timeToFillProgressBar = 1000;
  const timeToTransitionColor = 200;

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const thickness = 0.0813 * Math.min(screenWidth, screenHeight);

  const sectionOneWidth = screenWidth / 2;
  const sectionTwoHeight = screenHeight - thickness;
  const sectionThreeWidth = screenWidth - thickness;
  const sectionFourHeight = screenHeight - thickness;
  const sectionFiveWidth = screenWidth / 2 - thickness;
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
    if (taskState == "color-transitioned") {
      setTimeout(() => removeTask(id), 500);
    } else {
      colorShiftProgress.value = withTiming(
        taskState == "bar-full" ? 1 : 0,
        {
          duration: timeToTransitionColor,
        },
        (wasNotCancelled) => {
          if (wasNotCancelled && taskState == "bar-full") {
            runOnJS(setTaskState)("color-transitioned");
          }
        },
      );
    }
  }, [taskState]);

  return taskState == "bar-full" ? (
    <Animated.View
      className="fixed flex h-full w-full items-center justify-center bg-blue-950"
      style={[
        { borderWidth: thickness, zIndex: -id },
        completedColorAnimatedStyle,
      ]}
    >
      <Text className="text-5xl font-semibold text-gray-100 sm:text-7xl lg:text-8xl">
        {text}
      </Text>
    </Animated.View>
  ) : taskState == "bar-not-full" ? (
    <Pressable
      className="fixed flex h-full w-full items-center justify-center bg-blue-950"
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{ zIndex: -id }}
    >
      <View style={{ padding: thickness }}>
        <Text className="text-5xl font-semibold text-gray-100 sm:text-7xl lg:text-8xl">
          {text}
        </Text>
      </View>
      {/* Progress bar */}
      <View className="absolute h-full w-full">
        {/* Gray border */}
        <View
          className="absolute z-0 h-full w-full border-gray-700"
          style={{ borderWidth: thickness }}
        />
        {/* Sections of green progress */}
        <Animated.View
          className="bg-yellowGreen absolute left-1/2 top-0 z-10"
          style={[{ height: thickness }, sectionOneAnimatedStyles]}
        />
        <Animated.View
          className="bg-yellowGreen absolute right-0 z-10"
          style={[
            {
              top: thickness,
              width: thickness,
            },
            sectionTwoAnimatedStyles,
          ]}
        />
        <Animated.View
          className="bg-yellowGreen absolute bottom-0 z-10"
          style={[
            {
              right: thickness,
              height: thickness,
            },
            sectionThreeAnimatedStyles,
          ]}
        />
        <Animated.View
          className="bg-yellowGreen absolute left-0 z-10"
          style={{
            bottom: thickness,
            width: thickness,
            height: sectionFourCoveredHeight,
          }}
        />
        <Animated.View
          className="bg-yellowGreen absolute top-0 z-10"
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
      className="fixed flex h-full w-full items-center justify-center border-green-500 bg-blue-950"
      style={[{ borderWidth: thickness, zIndex: -id }]}
    >
      <Text className="text-5xl font-semibold text-gray-100 sm:text-7xl lg:text-8xl">
        {text}
      </Text>
    </View>
  );
}
