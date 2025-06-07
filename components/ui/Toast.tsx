import getColor from "@/lib/getColor";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";
import Text from "./Text";

export type ToastOptions = {
  text: string;
  variant?: "default" | "primary" | "success" | "error";
};

type ToastItemType = ToastOptions & { id: string };

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
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = emitter.on((options: ToastOptions) => {
      const id = uuidv4();
      const toast: ToastItemType = { id, ...options };
      setToasts((current) => [...current, toast]);

      const duration = 2500;
      setTimeout(
        () => setToasts((current) => current.filter((t) => t.id !== id)),
        duration
      );
    });

    return unsubscribe;
  }, []);

  return (
    <View style={[styles.container, { paddingTop: top + 16 }]}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </View>
  );
}

function ToastItem({ text, variant = "default" }: ToastItemType) {
  const colorMap = {
    default: "border",
    primary: "primary",
    success: "green",
    error: "red",
  } as const;

  const borderColor = getColor(colorMap[variant]);

  return (
    <View style={[styles.toast, { borderColor }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    gap: 8,
    alignItems: "center",
  },
  toast: {
    width: Dimensions.get("window").width - 32,
    padding: 12,
    backgroundColor: getColor("background"),
    borderWidth: 1,
    borderRadius: 8,
    elevation: 4,
  },
  text: {
    textAlign: "center",
  },
});
