import { useAppContext } from "@/context/AppContext";
import getColor from "@/lib/getColor";
import { LogType } from "@/lib/hooks/useActivity";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { format } from "date-fns";
import { XIcon } from "lucide-react-native";
import { useState } from "react";
import { Dimensions, Modal, StyleSheet, View } from "react-native";
import LogBodyweight from "../log/LogBodyweight";
import LogLift from "../log/LogLift";
import AlertDialog from "../ui/AlertDialog";
import Button from "../ui/Button";
import SafeArea from "../ui/SafeArea";
import { Toast } from "../ui/Toast";

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
    // TODO: Edit the log

    Toast.show({ text: `${bodyweight}kg`, variant: "success" });
  };

  const handleDelete = () => {
    setDialogVisible(false);

    // TODO: Delete the log

    Toast.show({
      text: `${
        log.kind === "lift" ? log.exercise.name : "Bodyweight"
      } has been deleted.`,
      variant: "success",
    });
  };

  return (
    <Modal
      statusBarTranslucent={true}
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <SafeArea style={styles.safeArea}>
        <View style={styles.container}>
          {log.kind === "lift" && (
            <LogLift
              startingValues={{
                exercise: log.exercise.name,
                weight: log.weight.toString(),
                reps: log.reps.toString(),
              }}
              handleLog={handleLogLift}
              onClose={onClose}
              title="Edit Lift Log"
              description={format(log.date, "MMMM dd, yyyy")}
            />
          )}
          {log.kind === "bodyweight" && (
            <LogBodyweight
              startingValues={{ bodyweight: log.bodyweight.toString() }}
              handleLog={handleLogBodyweight}
              onClose={onClose}
              title="Edit Bodyweight Log"
              description={format(log.date, "MMMM dd, yyyy")}
            />
          )}

          <Button
            variant="ghost"
            containerStyle={styles.closeButtonContainer}
            pressableStyle={styles.closeButtonPressable}
            onPress={onClose}
          >
            <XIcon color={getColor("foreground")} />
          </Button>
        </View>
        <Button
          variant="destructive"
          containerStyle={styles.deleteButtonContainer}
          onPress={() => setDialogVisible(true)}
        >
          Delete
        </Button>
      </SafeArea>

      <AlertDialog
        visible={dialogVisible}
        buttonVariant="destructive"
        title="Delete Exercise"
        content={"Are you sure you want to delete this log?"}
        confirmText="Delete"
        onCancel={() => setDialogVisible(false)}
        onConfirm={handleDelete}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    justifyContent: "space-between",
    height: Dimensions.get("screen").height,
    paddingHorizontal: 0,
    paddingTop: 0,
    flex: 0,
  },
  container: {
    position: "relative",
    flex: 1,
  },
  closeButtonContainer: {
    position: "absolute",
    top: 20,
    right: 16,
    borderRadius: 9999,
    zIndex: 10,
  },
  closeButtonPressable: {
    borderRadius: 9999,
    padding: 10,
    height: 38,
    width: 38,
  },
  deleteButtonContainer: { paddingHorizontal: 16, paddingVertical: 20 },
});
