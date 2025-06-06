import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { Pressable } from "react-native";
import Text from "../ui/Text";

interface Props {
  item: Exercise;
}

export default function ExerciseListItem({ item }: Props) {
  return (
    <Pressable>
      <Text>{item.name}</Text>
    </Pressable>
  );
}
