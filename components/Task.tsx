import { View, Text, Pressable, Dimensions } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import React, { useRef, useState } from "react";

export default function Task({ text }: { text: string }) {
  const [completed, setCompleted] = useState(false);

  const timeToComplete = 1250;

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const thickness = 0.08139534883 * Math.min(screenWidth, screenHeight);

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

  const msPerDp = timeToComplete / totalDistance;

  const coveredDistance = useSharedValue(0);

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

  function onPressIn() {
    coveredDistance.value = withTiming(
      totalDistance,
      {
        duration: (totalDistance - coveredDistance.value) * msPerDp,
        easing: Easing.linear,
      },
      (wasNotCancelled) => {
        if (wasNotCancelled) {
          runOnJS(setCompleted)(true);
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

  return completed ? (
    <View
      className="grow items-center justify-center border-green-500 bg-blue-950"
      style={{ borderWidth: thickness }}
    >
      <Text className="text-5xl font-semibold text-gray-100 sm:text-7xl lg:text-8xl">
        {text}
      </Text>
    </View>
  ) : (
    <Pressable
      className="grow items-center justify-center bg-blue-950"
      onPressIn={onPressIn}
      onPressOut={onPressOut}
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
          className="absolute left-1/2 top-0 z-10 bg-green-500"
          style={[{ height: thickness }, sectionOneAnimatedStyles]}
        />
        <Animated.View
          className="absolute right-0 z-10 bg-green-500"
          style={[
            {
              top: thickness,
              width: thickness,
            },
            sectionTwoAnimatedStyles,
          ]}
        />
        <Animated.View
          className="absolute bottom-0 z-10 bg-green-500"
          style={[
            {
              right: thickness,
              height: thickness,
            },
            sectionThreeAnimatedStyles,
          ]}
        />
        <Animated.View
          className="absolute left-0 z-10 bg-green-500"
          style={{
            bottom: thickness,
            width: thickness,
            height: sectionFourCoveredHeight,
          }}
        />
        <Animated.View
          className="absolute top-0 z-10 bg-green-500"
          style={{
            left: thickness,
            width: sectionFiveCoveredWidth,
            height: thickness,
          }}
        />
      </View>
    </Pressable>
  );
}
