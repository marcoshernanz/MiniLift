import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeArea from "./SafeArea";

interface Props {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  children: React.ReactNode;
  safeArea?: boolean;
}

export default function FullScreenModal({
  modalVisible,
  setModalVisible,
  children,
  safeArea = true,
}: Props) {
  return (
    <Modal
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaProvider>
        {safeArea ? (
          <Pressable
            onPress={Keyboard.dismiss}
            accessible={false}
            style={styles.pressable}
          >
            <SafeArea>
              <View style={styles.container}>{children}</View>
            </SafeArea>
          </Pressable>
        ) : (
          <>{children}</>
        )}
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 20 : 0,
  },
});
