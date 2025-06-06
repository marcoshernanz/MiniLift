import getColor from "@/lib/getColor";
import { XIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import SafeArea from "../ui/SafeArea";
import Title from "../ui/Title";

interface Props {
  onClose: () => void;
}

export default function AddExerciseModal({ onClose }: Props) {
  return (
    <SafeArea>
      <View style={styles.container}>
        <Title>Add Exercise</Title>

        <Button
          variant="ghost"
          containerStyle={styles.closeButtonContainer}
          pressableStyle={styles.closeButtonPressable}
          onPress={onClose}
        >
          <XIcon color={getColor("foreground")} />
        </Button>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  closeButtonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 9999,
    zIndex: 10,
  },
  closeButtonPressable: {
    borderRadius: 9999,
    padding: 10,
    height: 38,
    width: 38,
  },
});
