import getColor from "@/lib/getColor";
import { ActivityEntry } from "@/lib/hooks/useActivity";
import { format } from "date-fns";
import { DumbbellIcon, WeightIcon } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../ui/Text";

interface Props {
  log: ActivityEntry["logs"][number];
}

export default function ActivityLogItem({ log }: Props) {
  const Icon = log.kind === "lift" ? DumbbellIcon : WeightIcon;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.pressable}
        android_ripple={{ color: getColor("muted") }}
      >
        <View style={styles.iconContainer}>
          <Icon size={24} strokeWidth={1.75} color={getColor("primary")} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.primaryText}>
            {log.kind === "lift" ? log.exercise.name : "Bodyweight"}
          </Text>
          <Text style={styles.secondaryText}>
            {log.kind === "lift"
              ? `${log.weight} kg x ${log.reps} reps`
              : `${log.weight} kg`}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{format(log.date, "HH:mm")}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 8,
    marginHorizontal: 8,
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 8,
    backgroundColor: getColor("muted"),
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 12,
  },
  primaryText: {
    fontSize: 15,
    color: getColor("foreground"),
    fontWeight: 500,
  },
  secondaryText: {
    color: getColor("mutedForeground"),
  },
  timeContainer: {
    marginLeft: "auto",
    paddingRight: 4,
  },
  timeText: {
    color: getColor("mutedForeground"),
  },
});
