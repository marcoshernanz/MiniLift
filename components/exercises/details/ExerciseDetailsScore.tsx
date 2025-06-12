import Chart from "@/components/ui/Chart";
import Text from "@/components/ui/Text";
import getColor from "@/lib/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { Dimensions, StyleSheet, View } from "react-native";

const dummyData = {
  "2024-01-01": 90,
  "2024-01-02": 91,
  "2024-01-03": 88,
  "2024-01-04": 100,
  "2024-01-05": 85,
  "2024-01-06": 105,
  "2024-01-07": 100,
  "2024-01-08": 95,
  "2024-01-09": 90,
  "2024-01-10": 105,
  "2024-01-11": 90,
  "2024-01-12": 95,
  "2024-01-13": 100,
  "2024-01-14": 95,
  "2024-01-15": 90,
  "2024-01-16": 115,
  "2024-01-17": 105,
  "2024-01-18": 110,
  "2024-01-19": 120,
  "2024-01-20": 95,
  "2024-01-21": 110,
  "2024-01-22": 115,
  "2024-01-23": 130,
};

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
      <Chart
        data={dummyData}
        width={Dimensions.get("window").width - 32}
        height={300}
      />
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
