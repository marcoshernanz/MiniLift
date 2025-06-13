import getColor from "@/lib/getColor";
import { LogType } from "@/lib/hooks/useActivity";
import { format } from "date-fns";
import { DumbbellIcon, WeightIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import ActivityEditModal from "./ActivityEditModal";

interface Props {
  log: LogType;
}

export default function ActivityLogItem({ log }: Props) {
  const [editModalVisible, setEditModalVisible] = useState(false);

  const Icon = log.type === "lift" ? DumbbellIcon : WeightIcon;
  const primaryText = log.type === "lift" ? log.exercise.name : "Bodyweight";
  const secondaryText =
    log.type === "lift"
      ? `${log.weight} kg x ${log.reps} reps`
      : `${log.bodyweight} kg`;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.pressable}
        android_ripple={{ color: getColor("muted") }}
        onPress={() => setEditModalVisible(true)}
      >
        <View style={styles.iconContainer}>
          <Icon size={24} strokeWidth={1.75} color={getColor("primary")} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.primaryText}>{primaryText}</Text>
          <Text style={styles.secondaryText}>{secondaryText}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{format(log.date, "HH:mm")}</Text>
        </View>
      </Pressable>

      <ActivityEditModal
        log={log}
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      />
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
