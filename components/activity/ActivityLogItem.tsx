import getColor from "@/lib/utils/getColor";
import { LogType } from "@/lib/hooks/useActivity";
import { format } from "date-fns";
import { DumbbellIcon, WeightIcon } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import ActivityEditModal from "./ActivityEditModal";
import Button from "../ui/Button";

interface Props {
  log: LogType;
  showDate?: boolean;
}

export default function ActivityLogItem({ log, showDate = false }: Props) {
  const [editModalVisible, setEditModalVisible] = useState(false);

  const Icon = log.type === "lift" ? DumbbellIcon : WeightIcon;
  const primaryText = log.type === "lift" ? log.exercise.name : "Bodyweight";
  const secondaryText =
    log.type === "lift"
      ? `${log.weight} kg x ${log.reps} reps`
      : `${log.bodyweight} kg`;
  const date = showDate
    ? format(log.date, "MMM dd")
    : format(log.date, "HH:mm");

  return (
    <View style={styles.container}>
      <Button
        variant="ghost"
        containerStyle={styles.buttonContainer}
        pressableStyle={styles.buttonPressable}
        onPress={() => setEditModalVisible(true)}
        text={false}
      >
        <View style={styles.iconContainer}>
          <Icon size={24} strokeWidth={1.75} color={getColor("primary")} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.primaryText}>{primaryText}</Text>
          <Text style={styles.secondaryText}>{secondaryText}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{date}</Text>
        </View>
      </Button>

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
  buttonContainer: {
    borderRadius: 8,
  },
  buttonPressable: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 8,
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
    flexShrink: 1,
    gap: 2,
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
    paddingLeft: 12,
  },
  timeText: {
    color: getColor("mutedForeground"),
  },
});
