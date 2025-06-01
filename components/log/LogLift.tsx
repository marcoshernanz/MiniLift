import getColor from "@/lib/getColor";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Description from "../ui/Description";
import Title from "../ui/Title";

export default function LogLift() {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  return (
    <View style={styles.container}>
      <Title>Log Lift</Title>
      <Description>Description</Description>
      <TextInput
        style={styles.input}
        placeholder="Weight"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Repetitions"
        keyboardType="numeric"
        value={reps}
        onChangeText={setReps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  input: {
    borderWidth: 1,
    borderColor: getColor("border"),
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    backgroundColor: getColor("background"),
  },
});
