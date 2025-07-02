import Button from "@/components/ui/Button";
import SimpleChart from "@/components/ui/SimpleChart";
import SimpleDialog from "@/components/ui/SimpleDialog";
import Text from "@/components/ui/Text";
import useDailyScore from "@/lib/hooks/score/useDailyScore";
import getColor from "@/lib/utils/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { eachDayOfInterval, format, subDays } from "date-fns";
import { useRouter } from "expo-router";
import { CircleHelpIcon, MaximizeIcon } from "lucide-react-native";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

interface Props {
  exercise?: Exercise;
}

export default function ScoreOverview({ exercise }: Props) {
  const [helpVisible, setHelpVisible] = useState(false);

  const { score } = useDailyScore(exercise?.id);

  const endDate = new Date();
  const startDate = subDays(endDate, 29);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const chartData: Record<string, number | null> = days.reduce((acc, day) => {
    const key = format(day, "yyyy-MM-dd");
    const label = format(day, "MMM dd");
    acc[label] = score[key] ?? null;

    return acc;
  }, {} as Record<string, number | null>);

  const values = Object.values(chartData).filter((value) => value !== null);
  const change =
    values.length >= 2 && values[0] !== 0
      ? (values[values.length - 1] - values[0]) / values[0]
      : 0;
  const changePercent = (change * 100).toFixed(1);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Score</Text>
        <Button
          variant="ghost"
          containerStyle={{
            marginTop: 2.5,
            marginLeft: 2,
            height: 32,
            width: 32,
            borderRadius: 999,
          }}
          pressableStyle={{ padding: 8 }}
          onPress={() => setHelpVisible(true)}
        >
          <CircleHelpIcon color={getColor("mutedForeground")} />
        </Button>
      </View>

      <SimpleDialog
        title="Score"
        content="Your score shows how strong you are for your body weight. It’s your max lift divided by your body weight, shown as a percent."
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
      />

      <Text style={styles.description}>
        Last 30 days{" "}
        <Text
          style={{
            color: change >= 0 ? getColor("green") : getColor("red"),
            fontWeight: 600,
          }}
        >
          {change >= 0 && "+"}
          {changePercent}%
        </Text>
      </Text>

      <SimpleChart
        data={chartData}
        width={Dimensions.get("window").width - 32}
        height={250}
        pointsPerLabel={10}
        labelStart={5}
      />

      <Button
        variant="ghost"
        pressableStyle={styles.maximizeButton}
        containerStyle={styles.maximizeButtonContainer}
        onPress={() => {
          if (!exercise) {
            router.push("/statistics/score");
          } else {
            router.push(`/statistics/score/${exercise?.id}`);
          }
        }}
      >
        <MaximizeIcon color={getColor("foreground")} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
  },
  description: {
    fontSize: 14,
    fontWeight: 400,
    color: getColor("mutedForeground"),
    paddingBottom: 16,
  },
  maximizeButtonContainer: {
    position: "absolute",
    right: 0,
    height: 46,
    width: 46,
    borderRadius: 999,
  },
  maximizeButton: {
    padding: 12,
  },
});
