import { TimeFrame } from "@/app/statistics/[id]";
import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";

interface Props {
  selectedTimeFrame: TimeFrame;
  setSelectedTimeFrame: (timeFrame: TimeFrame) => void;
}

const timeFrames: TimeFrame[] = ["7D", "1M", "3M", "1Y", "All"];

export default function StatisticsTimeFrameSelector({
  selectedTimeFrame,
  setSelectedTimeFrame,
}: Props) {
  return (
    <View style={styles.container}>
      {timeFrames.map((option) => (
        <Button
          key={option}
          variant={selectedTimeFrame === option ? "primary" : "secondary"}
          onPress={() => setSelectedTimeFrame(option)}
          containerStyle={styles.buttonContainer}
          pressableStyle={styles.button}
        >
          {option}
        </Button>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    paddingVertical: 4,
  },
});
