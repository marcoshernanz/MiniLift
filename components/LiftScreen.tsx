import getColor from "@/lib/getColor";
import React from "react";
import { SafeAreaView } from "react-native";
import Description from "./ui/Description";
import Title from "./ui/Title";

export default function LiftScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: getColor("background"),
        paddingTop: 20,
        paddingHorizontal: 16,
      }}
    >
      <Title style={{ marginBottom: 4 }}>Title</Title>
      <Description style={{ marginBottom: 16 }}>Description</Description>
    </SafeAreaView>
  );
}
