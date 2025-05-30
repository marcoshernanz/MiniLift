import getColor from "@/lib/getColor";
import { DumbbellIcon, PlusIcon, WeightIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import LiftScreen from "../LiftScreen";
import Text from "../ui/Text";
import BodyweightScreen from "./BodyweightScreen";

export default function TabsAddButton() {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [liftVisible, setLiftVisible] = useState(false);
  const [bodyVisible, setBodyVisible] = useState(false);

  return (
    <>
      <Pressable
        style={styles.floatingButton}
        android_ripple={{
          color: getColor("background", 0.25),
          radius: 30,
        }}
        onPress={() => setPopoverVisible(true)}
      >
        <PlusIcon color={getColor("primaryForeground")} size={32} />
      </Pressable>

      <Modal
        transparent
        visible={popoverVisible}
        animationType="fade"
        onRequestClose={() => setPopoverVisible(false)}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setPopoverVisible(false)}
        />
        <View style={styles.popover}>
          <View style={styles.popoverTopWrapper}>
            <Pressable
              style={styles.popoverButton}
              android_ripple={{ color: getColor("muted") }}
              onPress={() => {
                setPopoverVisible(false);
                setLiftVisible(true);
              }}
            >
              <DumbbellIcon
                color={getColor("foreground")}
                size={20}
                strokeWidth={1.5}
              />
              <Text style={styles.buttonText}>Track Lifts</Text>
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.popoverBottomWrapper}>
            <Pressable
              style={styles.popoverButton}
              android_ripple={{ color: getColor("muted") }}
              onPress={() => {
                setPopoverVisible(false);
                setBodyVisible(true);
              }}
            >
              <WeightIcon
                color={getColor("foreground")}
                size={20}
                strokeWidth={1.5}
              />
              <Text style={styles.buttonText}>Track Bodyweight</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.arrowOuter} />
        <View style={styles.arrowInner} />
      </Modal>
      {liftVisible && (
        <Modal
          visible={liftVisible}
          animationType="slide"
          onRequestClose={() => setLiftVisible(false)}
        >
          <LiftScreen />
        </Modal>
      )}
      {bodyVisible && (
        <Modal
          visible={bodyVisible}
          animationType="slide"
          onRequestClose={() => setBodyVisible(false)}
        >
          <BodyweightScreen />
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
  popover: {
    position: "absolute",
    bottom: 74,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    width: 200,
    backgroundColor: getColor("background"),
    borderWidth: 1,
    borderColor: getColor("border"),
    borderRadius: 8,
    elevation: 5,
  },
  popoverTopWrapper: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
  },
  popoverBottomWrapper: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
  },
  popoverButton: {
    padding: 12,
    backgroundColor: getColor("background"),
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: getColor("foreground"),
  },
  divider: {
    height: 1,
    backgroundColor: getColor("border"),
  },
  arrowOuter: {
    position: "absolute",
    bottom: 60,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 15,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: getColor("border"),
  },
  arrowInner: {
    position: "absolute",
    bottom: 61.5,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    width: 0,
    height: 0,
    borderLeftWidth: 13.5,
    borderRightWidth: 13.5,
    borderTopWidth: 13.5,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: getColor("background"),
  },
});
