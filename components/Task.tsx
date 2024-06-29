import { View, Text, Pressable, Dimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import React, { useRef } from "react";

export default function Task({ text }: { text: string }) {
  const thickness = 35;
  const timeToComplete = 2000;

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const sectionOneWidth = screenWidth / 2;
  const sectionTwoHeight = screenHeight - thickness;
  const sectionThreeWidth = screenWidth - thickness;
  const sectionFourHeight = screenHeight - thickness;
  const sectionFiveWidth = screenWidth / 2 - thickness;
  const totalLength =
    sectionOneWidth +
    sectionTwoHeight +
    sectionThreeWidth +
    sectionFourHeight +
    sectionFiveWidth;
  const msPerDp = timeToComplete / totalLength;

  const sectionOneCoveredWidth = useSharedValue(0);
  const sectionTwoCoveredHeight = useSharedValue(0);
  const sectionThreeCoveredWidth = useSharedValue(0);
  const sectionFourCoveredHeight = useSharedValue(0);
  const sectionFiveCoveredWidth = useSharedValue(0);

  const isIncreasing = useSharedValue(false);

  const sectionOneAnimatedStyles = useAnimatedStyle(() => ({
    width: withTiming(
      sectionOneCoveredWidth.value,
      { duration: 3000, easing: Easing.linear },
      (wasNotCancelled) => {
        if (wasNotCancelled && isIncreasing.value) {
          sectionTwoCoveredHeight.value = sectionTwoHeight;
        }
        console.log("1");
      },
    ),
  }));

  const sectionTwoAnimatedStyles = useAnimatedStyle(() => ({
    height: withTiming(
      sectionTwoCoveredHeight.value,
      { duration: 3000, easing: Easing.linear },
      (wasNotCancelled) => {
        if (wasNotCancelled) {
          if (isIncreasing.value) {
            sectionThreeCoveredWidth.value = sectionThreeWidth;
          } else {
            sectionOneCoveredWidth.value = 0;
          }
        }
        console.log("2");
      },
    ),
  }));

  const sectionThreeAnimatedStyles = useAnimatedStyle(() => ({
    height: withTiming(
      sectionThreeCoveredWidth.value,
      { duration: 3000, easing: Easing.linear },
      (wasNotCancelled) => {
        if (wasNotCancelled) {
          if (isIncreasing.value) {
            sectionFourCoveredHeight.value = sectionFourHeight;
          } else {
            sectionTwoCoveredHeight.value = 0;
          }
        }
        console.log("3");
      },
    ),
  }));

  function onPressIn() {
    isIncreasing.value = true;
    sectionOneCoveredWidth.value = sectionOneWidth;
  }

  return (
    <Pressable
      className="grow items-center justify-center bg-blue-950"
      onPressIn={onPressIn}
    >
      <View className="p-[35]">
        <Text className="text-5xl font-semibold text-gray-100">{text}</Text>
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
        {/*<Animated.View*/}
        {/*  className="absolute left-0 z-10 bg-green-500"*/}
        {/*  style={{*/}
        {/*    bottom: thickness,*/}
        {/*    width: thickness,*/}
        {/*    height: sectionFourCoveredHeight,*/}
        {/*  }}*/}
        {/*/>*/}
        {/*<Animated.View*/}
        {/*  className="absolute top-0 z-10 bg-green-500"*/}
        {/*  style={{*/}
        {/*    left: thickness,*/}
        {/*    width: sectionFiveCoveredWidth,*/}
        {/*    height: thickness,*/}
        {/*  }}*/}
        {/*/>*/}
      </View>
    </Pressable>
  );
}
