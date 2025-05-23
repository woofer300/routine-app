import React from "react";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
import { EventSubscription } from "expo-modules-core";

export default function ShakeToExit() {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutToHideButtonID = useRef<number | null>(null);

  const shakeThreshold = 4;
  const shakeCooldown = 500;
  const lastShakeTime = useRef(Date.now());

  const [subscription, setSubscription] = useState<EventSubscription | null>(
    null,
  );

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(200);
    setSubscription(
      Accelerometer.addListener(
        (accelerometerMeasurement: AccelerometerMeasurement) => {
          const gsMagnitude = Math.sqrt(
            accelerometerMeasurement.x ** 2 +
              accelerometerMeasurement.y ** 2 +
              accelerometerMeasurement.z ** 2,
          );
          if (
            gsMagnitude > shakeThreshold &&
            Date.now() - lastShakeTime.current > shakeCooldown
          ) {
            lastShakeTime.current = Date.now();
            !isVisible && setIsVisible(true);
            if (timeoutToHideButtonID.current) {
              clearTimeout(timeoutToHideButtonID.current);
            }
            timeoutToHideButtonID.current = setTimeout(() => {
              setIsVisible(false);
            }, 5000);
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
    <>
      {isVisible && (
        <View className="absolute right-5 top-5 z-20 bg-red-600 p-3">
          <Feather name="x" size={30} color="white" />
        </View>
      )}
    </>
  );
}
