import getColor from "@/lib/getColor";
import { LogType } from "@/lib/hooks/useActivity";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { XIcon } from "lucide-react-native";
import { Dimensions, Modal, StyleSheet, View } from "react-native";
import LogBodyweight from "../log/LogBodyweight";
import LogLift from "../log/LogLift";
import Button from "../ui/Button";
import SafeArea from "../ui/SafeArea";
import { Toast } from "../ui/Toast";

interface Props {
  log: LogType;
  visible: boolean;
  onClose: () => void;
}

export default function ActivityEditModal({ log, visible, onClose }: Props) {
  const handleLogLift = ({
    exercise,
    weight,
    reps,
  }: {
    exercise: Exercise;
    weight: number;
    reps: number;
  }) => {
    // TODO: Edit the log

    Toast.show({
      text: `${exercise.name}: ${weight}kg x ${Math.floor(reps)}`,
      variant: "success",
    });
  };

  const handleLogBodyweight = ({ bodyweight }: { bodyweight: number }) => {
    // TODO: Edit the log

    Toast.show({ text: `${bodyweight}kg`, variant: "success" });
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
            />
          )}
          {log.kind === "bodyweight" && (
            <LogBodyweight
              startingValues={{ bodyweight: log.bodyweight.toString() }}
              handleLog={handleLogBodyweight}
              onClose={onClose}
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
        >
          Delete
        </Button>
      </SafeArea>
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
