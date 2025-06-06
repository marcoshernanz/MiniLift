import { PlusIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, StyleSheet } from "react-native";
import getColor from "../../lib/getColor";
import Button from "../ui/Button";

export default function ExercisesAddButton() {
  const [logScreenVisible, setLogScreenVisible] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        containerStyle={styles.buttonContainer}
        pressableStyle={styles.buttonPressable}
        onPress={() => setLogScreenVisible(true)}
      >
        <PlusIcon color={getColor("foreground")} />
      </Button>

      {logScreenVisible && (
        <Modal
          statusBarTranslucent={true}
          transparent={true}
          visible={logScreenVisible}
          onRequestClose={() => setLogScreenVisible(false)}
          animationType="slide"
        >
          <LogScreen onClose={() => setLogScreenVisible(false)} />
        </Modal>
      )}
    </>
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
