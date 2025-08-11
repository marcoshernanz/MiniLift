import getColor from "@/lib/utils/getColor";
import { PlusIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import LogScreen from "./log/LogScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsAddButton() {
  const [modalVisible, setModalVisible] = useState(false);

  const { bottom: bottomInset } = useSafeAreaInsets();
  const tabsHeight = 49 + bottomInset;
  const size = 60 + Math.max(0, bottomInset / 2 - 10);

  return (
    <>
      <Pressable
        style={[
          styles.floatingButton,
          { bottom: tabsHeight - size + 10, height: size, width: size },
        ]}
        android_ripple={{
          color: getColor("background", 0.25),
          radius: 30,
        }}
        onPress={() => setModalVisible(true)}
      >
        <PlusIcon color={getColor("primaryForeground")} size={32} />
      </Pressable>

      <Modal
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <LogScreen onClose={() => setModalVisible(false)} />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
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
