import { PlusIcon } from "lucide-react-native";
import { StyleSheet } from "react-native";
import getColor from "../../lib/getColor";
import Button from "../ui/Button";

export default function ExercisesAddButton() {
  return (
    <Button
      variant="ghost"
      containerStyle={styles.buttonContainer}
      pressableStyle={styles.buttonPressable}
      onPress={() => {}}
    >
      <PlusIcon color={getColor("foreground")} />
    </Button>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    top: 0,
    right: 16,
    borderRadius: 9999,
    zIndex: 10,
  },
  buttonPressable: {
    borderRadius: 9999,
    padding: 10,
    height: 42,
    width: 42,
  },
});
