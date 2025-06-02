import getColor from "@/lib/getColor";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import Description from "../ui/Description";
import SafeArea from "../ui/SafeArea";
import Title from "../ui/Title";

export default function LogBodyweight() {
  const [bodyweight, setBodyweight] = useState("");

  return (
    <SafeArea>
      <Title>Log Bodyweight</Title>
      <Description>Description</Description>
      <TextInput
        style={styles.input}
        placeholder="Bodyweight"
        keyboardType="numeric"
        value={bodyweight}
        onChangeText={setBodyweight}
      />
    </SafeArea>
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
