import getColor from "@/lib/getColor";
import React from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Dialog({ visible, onClose, children }: DialogProps) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.dialog} onStartShouldSetResponder={() => true}>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: Dimensions.get("window").width - 32,
    backgroundColor: getColor("background"),
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: getColor("border"),
    elevation: 5,
  },
});
