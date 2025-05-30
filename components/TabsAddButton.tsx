import getColor from "@/lib/getColor";
import { useRouter } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import Text from "./ui/Text";

export default function TabsAddButton() {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      <Pressable
        style={{
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
        }}
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
        <View
          style={{
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
          }}
        >
          <View
            style={{
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              overflow: "hidden",
            }}
          >
            <Pressable
              style={{ padding: 12, backgroundColor: getColor("background") }}
              android_ripple={{ color: getColor("muted") }}
              onPress={() => {
                setPopoverVisible(false);
                router.push("/bodyweight");
              }}
            >
              <Text style={{ color: getColor("foreground") }}>Bodyweight</Text>
            </Pressable>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: getColor("border"),
            }}
          />
          <View
            style={{
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              overflow: "hidden",
            }}
          >
            <Pressable
              style={{ padding: 12, backgroundColor: getColor("background") }}
              android_ripple={{ color: getColor("muted") }}
              onPress={() => {
                setPopoverVisible(false);
                router.push("/lift");
              }}
            >
              <Text style={{ color: getColor("foreground") }}>Lift</Text>
            </Pressable>
          </View>
        </View>

        <View
          style={{
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
          }}
        />
        <View
          style={{
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
          }}
        />
      </Modal>
    </>
  );
}
