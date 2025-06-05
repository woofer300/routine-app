import React from "react";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
import { EventSubscription } from "expo-modules-core";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ShakeToExit() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const timeoutToHideButtonID = useRef<number | null>(null);

  const lastAccelerometerMeasurementAboveThreshold =
    useRef<AccelerometerMeasurement | null>(null);

  // In gs
  const shakeThreshold = 3;
  const maxTimeBetweenAccelerations = 250;
  const visibilityDuration = 5000;
  const fadeAnimationDuration = 250;

  const [subscription, setSubscription] = useState<EventSubscription | null>(
    null,
  );

  const handleExit = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(30);
    setSubscription(
      Accelerometer.addListener(
        (accelerometerMeasurement: AccelerometerMeasurement) => {
          const gsMagnitude = Math.sqrt(
            accelerometerMeasurement.x ** 2 +
              accelerometerMeasurement.y ** 2 +
              accelerometerMeasurement.z ** 2,
          );
          if (gsMagnitude > shakeThreshold) {
            if (
              lastAccelerometerMeasurementAboveThreshold.current &&
              (accelerometerMeasurement.timestamp -
                lastAccelerometerMeasurementAboveThreshold.current.timestamp) *
                1000 <
                maxTimeBetweenAccelerations
            ) {
              // Dot product with opposite direction of last acceleration measurement above threshold
              const gsMagnitudeInOppositeDirection =
                (accelerometerMeasurement.x *
                  -lastAccelerometerMeasurementAboveThreshold.current.x +
                  accelerometerMeasurement.y *
                    -lastAccelerometerMeasurementAboveThreshold.current.y +
                  accelerometerMeasurement.z *
                    -lastAccelerometerMeasurementAboveThreshold.current.z) /
                Math.sqrt(
                  lastAccelerometerMeasurementAboveThreshold.current.x ** 2 +
                    lastAccelerometerMeasurementAboveThreshold.current.y ** 2 +
                    lastAccelerometerMeasurementAboveThreshold.current.z ** 2,
                );
              if (gsMagnitudeInOppositeDirection > shakeThreshold) {
                lastAccelerometerMeasurementAboveThreshold.current = null;
                opacity.value = withTiming(1, {
                  duration: fadeAnimationDuration,
                });
                timeoutToHideButtonID.current &&
                  clearTimeout(timeoutToHideButtonID.current);
                timeoutToHideButtonID.current = setTimeout(() => {
                  opacity.value = withTiming(0, {
                    duration: fadeAnimationDuration,
                  });
                }, visibilityDuration);
              }
            } else {
              lastAccelerometerMeasurementAboveThreshold.current =
                accelerometerMeasurement;
            }
          }
        },
      ),
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <Pressable
      className="absolute right-5 z-20"
      style={{ top: insets.top + 20 }}
      onPress={handleExit}
    >
      <Animated.View className="bg-red-600 p-3" style={{ opacity }}>
        <Feather name="x" size={30} color="white" />
      </Animated.View>
    </Pressable>
  );
}
