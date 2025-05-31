import "../global.css";
import { Link } from "expo-router";
import { View, Dimensions, ScrollView, Pressable } from "react-native";

const { width } = Dimensions.get("window");
const buttonWidth = (width - 60) / 2; // Account for padding and gap
const buttonHeight = (buttonWidth * 3) / 2; // 2:3 width to height ratio

export default function Index() {
  // Generate buttons for routes: first button goes to /deck, rest go to /1, /2, /3, etc.
  const numberOfButtons = 20;
  const buttons = Array.from({ length: numberOfButtons }, (_, i) => {
    if (i === 0) {
      return { route: "/deck", key: "deck" };
    } else {
      return { route: `/${i}`, key: i };
    }
  });

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-5 pt-16">
        <View className="flex-row flex-wrap justify-between gap-5">
          {buttons.map((button) => (
            <Link key={button.key} href={button.route as any} asChild>
              <Pressable
                className="mb-5"
                style={{ width: buttonWidth, height: buttonHeight }}
              >
                <View className="flex-1 rounded-xl bg-blue-500 shadow-lg" />
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
