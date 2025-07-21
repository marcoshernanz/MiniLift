import SafeArea from "@/components/ui/SafeArea";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import Title from "@/components/ui/Title";
import DummyData from "@/components/settings/options/DummyData";
import ImportExportData from "@/components/settings/options/ImportExportData";

export default function SettingsScreen() {
  return (
    <SafeArea>
      <Title style={styles.title}>Settings</Title>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        bounces={false}
        alwaysBounceVertical={false}
      >
        <DummyData />
        <ImportExportData />
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  title: {
    paddingBottom: 16,
  },
});
