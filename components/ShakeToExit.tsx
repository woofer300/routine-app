import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View } from "react-native";
import RNShake from "react-native-shake";

export default function ShakeToExit() {
  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      setIsVisible(true);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {isVisible && (
        <View className="absolute bottom-0 right-0 z-20 bg-red-600 p-3">
          <Feather name="x" size={30} color="white" />
        </View>
      )}
    </>
  );
}
