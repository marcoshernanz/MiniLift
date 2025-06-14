import getColor from "@/lib/getColor";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, StyleSheet } from "react-native";
import LogScreen from "../log/LogScreen";
import Button from "../ui/Button";

interface Props {
  date: Date;
}

export default function ActivityAdd({ date }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        containerStyle={styles.buttonContainer}
        pressableStyle={styles.buttonPressable}
        onPress={() => setModalVisible(true)}
      >
        <PlusIcon color={getColor("foreground")} />
      </Button>

      {modalVisible && (
        <Modal
          statusBarTranslucent={true}
          navigationBarTranslucent={true}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          animationType="slide"
        >
          <LogScreen
            onClose={() => setModalVisible(false)}
            logLiftTitle="Add Lift"
            logLiftDescription={format(date, "MMMM dd, yyyy")}
            logBodyweightTitle="Add Bodyweight"
            logBodyweightDescription={format(date, "MMMM dd, yyyy")}
          />
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
