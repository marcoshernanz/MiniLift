import getColor from "@/lib/getColor";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function LiftScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Lift</Text>
      {/* TODO: Implement lift entry form */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: getColor("background"),
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: getColor("foreground"),
  },
});
