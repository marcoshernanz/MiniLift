import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import getColor from "@/lib/getColor";
import { XIcon } from "lucide-react-native";
import React from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";

interface Props {
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export default function SimpleDialog({
  visible,
  title,
  content,
  onClose,
}: Props) {
  return (
    <Modal
      transparent={true}
      statusBarTranslucent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.dialog} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>{title}</Text>
          <Text>{content}</Text>
          <Button
            variant="ghost"
            containerStyle={styles.closeButtonContainer}
            pressableStyle={styles.closeButton}
            onPress={onClose}
          >
            <XIcon color={getColor("foreground")} />
          </Button>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: getColor("border"),
    elevation: 5,
    position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  closeButtonContainer: {
    position: "absolute",
    top: 6,
    right: 6,
    borderRadius: 999,
    height: 36,
    width: 36,
  },
  closeButton: {
    padding: 10,
  },
});
