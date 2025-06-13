import Chart from "@/components/ui/SimpleChart";
import Text from "@/components/ui/Text";
import getColor from "@/lib/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { Dimensions, StyleSheet, View } from "react-native";

const dummyData = {
  "Jan 01": 90,
  "Jan 02": 91,
  "Jan 03": 88,
  "Jan 04": 100,
  "Jan 05": 85,
  "Jan 06": 105,
  "Jan 07": 100,
  "Jan 08": 95,
  "Jan 09": 90,
  "Jan 10": 105,
  "Jan 11": 90,
  "Jan 12": 95,
  "Jan 13": 100,
  "Jan 14": 95,
  "Jan 15": 90,
  "Jan 16": 115,
  "Jan 17": 105,
  "Jan 18": 110,
  "Jan 19": 130,
  "Jan 20": 95,
  "Jan 21": 110,
  "Jan 22": 115,
  "Jan 23": 120,
  "Jan 24": 125,
  "Jan 25": 110,
  "Jan 26": 115,
  "Jan 27": 100,
  "Jan 28": 105,
  "Jan 29": 120,
  "Jan 30": 115,
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
        height={250}
        labelCount={4}
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
    paddingBottom: 20,
  },
});
