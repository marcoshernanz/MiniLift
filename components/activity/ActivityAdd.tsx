import getColor from "@/lib/utils/getColor";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import LogScreen from "../log/LogScreen";
import Button from "../ui/Button";
import FullScreenModal from "../ui/FullScreenModal";

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

      <FullScreenModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        safeArea={false}
      >
        <LogScreen
          onClose={() => setModalVisible(false)}
          logDate={date}
          logLiftTitle="Add Lift"
          logLiftDescription={format(date, "MMMM dd, yyyy")}
          logBodyweightTitle="Add Bodyweight"
          logBodyweightDescription={format(date, "MMMM dd, yyyy")}
        />
      </FullScreenModal>
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
