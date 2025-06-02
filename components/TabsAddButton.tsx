import getColor from "@/lib/getColor";
import { PlusIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import LogScreen from "./log/LogScreen";

export default function TabsAddButton() {
  const [logScreenVisible, setLogScreenVisible] = useState(false);

  return (
    <>
      <Pressable
        style={styles.floatingButton}
        android_ripple={{
          color: getColor("background", 0.25),
          radius: 30,
        }}
        onPress={() => setLogScreenVisible(true)}
      >
        <PlusIcon color={getColor("primaryForeground")} size={32} />
      </Pressable>

      {logScreenVisible && (
        <Modal
          statusBarTranslucent={true}
          transparent={true}
          visible={logScreenVisible}
          onRequestClose={() => setLogScreenVisible(false)}
          animationType="slide"
        >
          <LogScreen />
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 16,
    left: "50%",
    width: 60,
    height: 60,
    borderRadius: 9999,
    backgroundColor: getColor("primary"),
    borderWidth: 1,
    borderColor: getColor("border"),
    transform: [{ translateX: "-50%" }],
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    overflow: "hidden",
  },
});
