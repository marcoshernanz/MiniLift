import getColor from "@/lib/utils/getColor";
import { PlusIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, StyleSheet } from "react-native";
import LogScreen from "./log/LogScreen";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Button from "@/components/ui/Button";

export default function TabsAddButton() {
  const [modalVisible, setModalVisible] = useState(false);

  const { bottom: bottomInset } = useSafeAreaInsets();
  const tabsHeight = 49 + bottomInset;
  const size = 59 + Math.max(0, bottomInset / 2 - 10);

  return (
    <>
      <Button
        variant="primary"
        containerStyle={[
          styles.floatingButtonContainer,
          { bottom: tabsHeight - size + 10, height: size, width: size },
        ]}
        pressableStyle={[
          styles.floatingButtonPressable,
          { height: size, width: size },
        ]}
        android_ripple={{
          color: getColor("background", 0.25),
          radius: 30,
        }}
        onPress={() => setModalVisible(true)}
      >
        <PlusIcon color={getColor("primaryForeground")} size={32} />
      </Button>

      <Modal
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaProvider>
          <LogScreen onClose={() => setModalVisible(false)} />
        </SafeAreaProvider>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: "absolute",
    left: "50%",
    borderRadius: 9999,
    backgroundColor: getColor("background"),
    transform: [{ translateX: "-50%" }],
    zIndex: 10,
  },
  floatingButtonPressable: {
    borderRadius: 9999,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
