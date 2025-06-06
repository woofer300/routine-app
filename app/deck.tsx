import Task from "@/components/Task";
import ShakeToExit from "@/components/ShakeToExit";
import { useState } from "react";
import { View } from "react-native";

export default function Index() {
  type TaskText = { text: string; id: number };

  const [taskTexts, setTaskTexts] = useState<TaskText[]>([
    { text: "Hello, world!", id: 0 },
    { text: "This is the second task!", id: 1 },
    { text: "Keep going!", id: 2 },
    { text: "Almost there...", id: 3 },
  ]);

  function removeTask(id: number) {
    const newThing = taskTexts.filter((taskText) => taskText.id !== id);
    setTaskTexts(newThing);
  }

  return (
    <View className="z-0 flex-1 bg-black">
      <ShakeToExit />
      {taskTexts.map((taskText) => {
        return (
          <Task
            text={taskText.text}
            key={taskText.id}
            id={taskText.id}
            removeTask={removeTask}
          />
        );
      })}
    </View>
  );
}
