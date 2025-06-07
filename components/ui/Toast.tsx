import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export type ToastOptions = {
  text: string;
  type?: "success" | "error" | "info";
  duration?: number;
};

type ToastItemType = ToastOptions & { id: number };

class ToastEmitter {
  private handlers: ((options: ToastOptions) => void)[] = [];

  on(handler: (options: ToastOptions) => void) {
    this.handlers.push(handler);
    return () => this.off(handler);
  }
  off(handler: (options: ToastOptions) => void) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }
  emit(options: ToastOptions) {
    this.handlers.forEach((h) => h(options));
  }
}

const emitter = new ToastEmitter();

export const Toast = {
  show(options: ToastOptions) {
    emitter.emit(options);
  },
};

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItemType[]>([]);

  useEffect(() => {
    const unsubscribe = emitter.on((options: ToastOptions) => {
      const id = Date.now();
      const toast: ToastItemType = { id, ...options };
      setToasts((current) => [...current, toast]);
      const duration = options.duration ?? 3000;
      setTimeout(
        () => setToasts((current) => current.filter((t) => t.id !== id)),
        duration
      );
    });
    return unsubscribe;
  }, []);

  return (
    // <View style={styles.container}>
    <View
      style={{
        position: "absolute",
        height: 100,
        width: 100,
        zIndex: 999999,
        elevation: 999999,
        backgroundColor: "red",
      }}
    >
      {/* {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))} */}
    </View>
  );
}

function ToastItem({ text, type, duration }: ToastItemType) {
  return (
    <View
      style={{ position: "fixed", height: 100, width: 100, zIndex: 9999 }}
    ></View>
  );

  // const translateY = useRef(new Animated.Value(-100)).current;

  // useEffect(() => {
  //   Animated.sequence([
  //     Animated.timing(translateY, {
  //       toValue: 0,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }),
  //     Animated.delay((duration ?? 3000) - 600),
  //     Animated.timing(translateY, {
  //       toValue: -100,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }),
  //   ]).start();
  // }, [duration, translateY]);

  // const backgroundColor =
  //   type === "success" ? "#4caf50" : type === "error" ? "#f44336" : "#333";

  // return (
  //   <Animated.View
  //     style={[styles.toast, { backgroundColor, transform: [{ translateY }] }]}
  //   >
  //     <Text style={styles.text}>{text}</Text>
  //   </Animated.View>
  // );
}

const styles = StyleSheet.create({
  container: {
    position: "fixed",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 4,
    minWidth: "60%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
});
