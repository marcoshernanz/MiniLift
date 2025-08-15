import Button from "@/components/ui/Button";
import SimpleChart from "@/components/ui/SimpleChart";
import SimpleDialog from "@/components/ui/SimpleDialog";
import Text from "@/components/ui/Text";
import useDailyScore from "@/lib/hooks/score/useDailyScore";
import useDailyGlobalScore from "@/lib/hooks/score/global/useDailyGlobalScore";
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

  const daily = useDailyScore(exercise?.id ?? "");
  const globalScore = useDailyGlobalScore();
  const scoreMap = exercise ? daily.score : globalScore;

  const endDate = new Date();
  const startDate = subDays(endDate, 29);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const chartData: Record<string, number | null> = days.reduce((acc, day) => {
    const key = format(day, "yyyy-MM-dd");
    const label = format(day, "MMM dd");
    acc[label] = scoreMap[key] ?? null;

    return acc;
  }, {} as Record<string, number | null>);

  const pts = days
    .map((d, i) => {
      const v = scoreMap[format(d, "yyyy-MM-dd")];
      return v != null ? ([i, v] as [number, number]) : null;
    })
    .filter((p): p is [number, number] => p !== null);

  let change = 0;
  if (pts.length >= 2) {
    const n = pts.length;
    const meanX = pts.reduce((s, [x]) => s + x, 0) / n;
    const meanY = pts.reduce((s, [, y]) => s + y, 0) / n;

    const covXY =
      pts.reduce((s, [x, y]) => s + (x - meanX) * (y - meanY), 0) / n;
    const varX = pts.reduce((s, [x]) => s + (x - meanX) ** 2, 0) / n;
    const slope = varX !== 0 ? covXY / varX : 0;
    change = (slope * days.length) / meanY;
  }
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
            router.navigate("/statistics/score");
          } else {
            router.navigate(`/statistics/score/${exercise?.id}`);
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
    paddingTop: 4,
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
