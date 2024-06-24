import { View, Text, Pressable } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import BorderProgressBar from "@/components/BorderProgressBar";
import React from "react";

export default function Task({ text }: { text: string }) {
  const AnimatedBorderProgressBar =
    Animated.createAnimatedComponent(BorderProgressBar);
  const progress = useSharedValue(0);

  function handlePress() {
    progress.value = withTiming(1, { duration: 1000 });
  }

  return (
    <Pressable
      className="grow items-center justify-center bg-blue-950"
      onPress={handlePress}
    >
      <View className="p-[35]">
        <Text className="text-5xl font-semibold text-gray-100">{text}</Text>
      </View>
      <AnimatedBorderProgressBar thickness={35} progress={progress} />
    </Pressable>
  );
}
