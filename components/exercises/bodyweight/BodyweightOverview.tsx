import Button from "@/components/ui/Button";
import SimpleChart from "@/components/ui/SimpleChart";
import Text from "@/components/ui/Text";
import useDailyBodyweight from "@/lib/hooks/bodyweight/useDailyBodyweight";
import getColor from "@/lib/utils/getColor";
import { eachDayOfInterval, format, subDays } from "date-fns";
import { useRouter } from "expo-router";
import { MaximizeIcon } from "lucide-react-native";
import { Dimensions, StyleSheet, View } from "react-native";

export default function BodyweightOverview() {
  const bodyweight = useDailyBodyweight();

  const endDate = new Date();
  const startDate = subDays(endDate, 29);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const chartData: Record<string, number | null> = days.reduce((acc, day) => {
    const key = format(day, "yyyy-MM-dd");
    const label = format(day, "MMM dd");
    acc[label] = bodyweight[key] ?? null;

    return acc;
  }, {} as Record<string, number | null>);

  const yValues = Object.values(chartData).filter(
    (value): value is number => value !== null
  );

  let change = 0;
  if (yValues.length >= 2 && yValues[0] !== 0) {
    const points = yValues.map((y, i) => ({ x: i, y }));
    const n = points.length;
    const xMean = points.reduce((sum, p) => sum + p.x, 0) / n;
    const yMean = points.reduce((sum, p) => sum + p.y, 0) / n;
    const numerator = points.reduce(
      (sum, p) => sum + (p.x - xMean) * (p.y - yMean),
      0
    );
    const denominator = points.reduce((sum, p) => sum + (p.x - xMean) ** 2, 0);
    const slope = denominator !== 0 ? numerator / denominator : 0;
    change = (slope * (n - 1)) / yValues[0];
  }
  const changePercent = (change * 100).toFixed(1);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Bodyweight</Text>
      </View>

      <Text style={styles.description}>
        Last 30 days{" "}
        <Text
          style={{
            color: change <= 0 ? getColor("green") : getColor("red"),
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
          router.push(`/statistics/bodyweight`);
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
