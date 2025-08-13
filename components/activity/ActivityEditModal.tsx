import { useAppContext } from "@/context/AppContext";
import { LogType } from "@/lib/hooks/useActivity";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { format } from "date-fns";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import LogBodyweight from "../log/LogBodyweight";
import LogLift from "../log/LogLift";
import AlertDialog from "../ui/AlertDialog";
import Button from "../ui/Button";
import { Toast } from "../ui/Toast";
import FullScreenModal from "../ui/FullScreenModal";

interface Props {
  log: LogType;
  visible: boolean;
  onClose: () => void;
}

export default function ActivityEditModal({ log, visible, onClose }: Props) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const { setAppData } = useAppContext();

  const handleLogLift = ({
    exercise,
    weight,
    reps,
  }: {
    exercise: Exercise;
    weight: number;
    reps: number;
  }) => {
    setAppData((prev) => ({
      ...prev,
      liftLogs: prev.liftLogs.map((l) =>
        l.id === log.id ? { ...l, exercise, weight, reps } : l
      ),
    }));

    Toast.show({
      text: `${exercise.name}: ${weight}kg x ${Math.floor(reps)}`,
      variant: "success",
    });
  };

  const handleLogBodyweight = ({ bodyweight }: { bodyweight: number }) => {
    setAppData((prev) => ({
      ...prev,
      bodyweightLogs: prev.bodyweightLogs.map((l) =>
        l.id === log.id ? { ...l, bodyweight } : l
      ),
    }));

    Toast.show({ text: `${bodyweight}kg`, variant: "success" });
  };

  const handleDelete = () => {
    setDialogVisible(false);

    setAppData((prev) => ({
      ...prev,
      liftLogs:
        log.type === "lift"
          ? prev.liftLogs.filter((l) => l.id !== log.id)
          : prev.liftLogs,
      bodyweightLogs:
        log.type === "bodyweight"
          ? prev.bodyweightLogs.filter((l) => l.id !== log.id)
          : prev.bodyweightLogs,
    }));
    onClose();

    Toast.show({
      text: `${
        log.type === "lift" ? log.exercise.name : "Bodyweight"
      } has been deleted.`,
      variant: "success",
    });
  };

  return (
    <FullScreenModal modalVisible={visible} setModalVisible={onClose}>
      <View style={styles.container}>
        {log.type === "lift" && (
          <LogLift
            startingValues={{
              exercise: log.exercise.name,
              weight: log.weight.toString(),
              reps: log.reps.toString(),
            }}
            handleLog={handleLogLift}
            onClose={onClose}
            title="Edit Lift"
            description={format(log.date, "MMMM dd, yyyy")}
          />
        )}
        {log.type === "bodyweight" && (
          <LogBodyweight
            startingValues={{ bodyweight: log.bodyweight.toString() }}
            handleLog={handleLogBodyweight}
            onClose={onClose}
            title="Edit Bodyweight"
            description={format(log.date, "MMMM dd, yyyy")}
          />
        )}
      </View>

      <Button
        variant="destructive"
        containerStyle={styles.deleteButtonContainer}
        onPress={() => setDialogVisible(true)}
      >
        Delete
      </Button>

      <AlertDialog
        visible={dialogVisible}
        buttonVariant="destructive"
        title="Delete Exercise"
        content={"Are you sure you want to delete this log?"}
        confirmText="Delete"
        onCancel={() => setDialogVisible(false)}
        onConfirm={handleDelete}
      />
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  deleteButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
});
