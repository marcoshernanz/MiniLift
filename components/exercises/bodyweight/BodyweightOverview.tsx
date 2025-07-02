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
