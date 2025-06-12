import Text from "@/components/ui/Text";
import getColor from "@/lib/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { StyleSheet, View } from "react-native";

interface Props {
  exercise: Exercise;
}
export default function ExerciseDetailsScore({ exercise }: Props) {
  const change = 0.1;

  return (
    <View>
      <Text style={styles.title}>Score</Text>
      <Text style={styles.description}>
        Last 30 days{" "}
        <Text
          style={{
            color: change >= 0 ? getColor("green") : getColor("red"),
            fontWeight: 600,
          }}
        >
          {change >= 0 && "+"}
          {change * 100}%
        </Text>
      </Text>
      <View style={{ height: 200, backgroundColor: "red" }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 600,
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    color: getColor("mutedForeground"),
  },
});
