import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import type { AppData } from "@/zod/schemas/AppDataSchema";
import type { Exercise } from "@/zod/schemas/ExerciseSchema";
import { Toast } from "@/components/ui/Toast";
import SettingsGroup from "@/components/settings/SettingsGroup";
import Text from "@/components/ui/Text";
import SettingsItem from "@/components/settings/SettingsItem";
import { ScrollView, StyleSheet, View } from "react-native";
import Title from "@/components/ui/Title";
import DummyData from "@/components/settings/options/DummyData";

export default function SettingsScreen() {
  // const { setAppData, exportData, importData } = useAppContext();

  // const loadDummyData = () => {
  //   const exercisesMap: Record<string, Exercise> = {};
  //   for (let i = 1; i <= 50; i++) {
  //     const id = uuidv4();
  //     exercisesMap[id] = { id, name: `Exercise ${i}`, isFavorite: false };
  //   }
  //   const liftLogs: AppData["liftLogs"] = [];
  //   const bodyweightLogs: AppData["bodyweightLogs"] = [];
  //   const endDate = new Date();
  //   const startDate = new Date();
  //   startDate.setFullYear(endDate.getFullYear() - 1);
  //   for (
  //     let date = new Date(startDate);
  //     date <= endDate;
  //     date.setDate(date.getDate() + 1)
  //   ) {
  //     bodyweightLogs.push({
  //       id: uuidv4(),
  //       date: new Date(date),
  //       bodyweight: Math.round(Math.random() * 30 + 50),
  //     });
  //     const day = date.getDay();
  //     if (day >= 1 && day <= 5) {
  //       const exercisesList = Object.values(exercisesMap);
  //       for (let j = 0; j < 20; j++) {
  //         const exercise =
  //           exercisesList[Math.floor(Math.random() * exercisesList.length)];
  //         liftLogs.push({
  //           id: uuidv4(),
  //           date: new Date(date),
  //           exercise,
  //           reps: Math.floor(Math.random() * 10) + 1,
  //           weight: Math.round(Math.random() * 80 + 20),
  //         });
  //       }
  //     }
  //   }
  //   setAppData(() => ({
  //     hasCompletedOnboarding: false,
  //     exercises: exercisesMap,
  //     liftLogs,
  //     bodyweightLogs,
  //   }));
  // };

  // const clearDummyData = () => {
  //   setAppData(() => ({
  //     hasCompletedOnboarding: false,
  //     exercises: {},
  //     liftLogs: [],
  //     bodyweightLogs: [],
  //   }));
  // };

  // const onExportFile = async () => {
  //   try {
  //     const data = exportData();
  //     const filename = FileSystem.documentDirectory + "minilift-export.json";

  //     await FileSystem.writeAsStringAsync(filename, data, {
  //       encoding: FileSystem.EncodingType.UTF8,
  //     });
  //     await Sharing.shareAsync(filename, { mimeType: "application/json" });
  //   } catch {
  //     Toast.show({ text: "Export failed", variant: "error" });
  //   }
  // };

  // const onImportFile = async () => {
  //   try {
  //     const res = await DocumentPicker.getDocumentAsync({
  //       type: "application/json",
  //     });
  //     if (res.canceled) {
  //       return;
  //     }

  //     const asset = res.assets[0];
  //     if (asset.mimeType !== "application/json") {
  //       Toast.show({ text: "Invalid file type", variant: "error" });
  //       return;
  //     }

  //     try {
  //       const json = await FileSystem.readAsStringAsync(asset.uri, {
  //         encoding: FileSystem.EncodingType.UTF8,
  //       });
  //       importData(json);
  //     } catch {
  //       Toast.show({ text: "Invalid data", variant: "error" });
  //       return;
  //     }

  //     Toast.show({ text: "Import successful", variant: "success" });
  //   } catch {
  //     Toast.show({ text: "Import failed", variant: "error" });
  //   }
  // };

  return (
    <SafeArea>
      {/* <Button onPress={onExportFile}>Export as File</Button>
      <Button onPress={onImportFile}>Import from File</Button>
      <Button onPress={loadDummyData}>Load dummy data</Button>
      <Button onPress={clearDummyData}>Clear dummy data</Button> */}
      <Title style={styles.title}>Activity</Title>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
        alwaysBounceVertical={false}
      >
        <DummyData />
        <SettingsGroup>
          <SettingsItem text="Setting 3" />
          <SettingsItem text="Setting 4" />
        </SettingsGroup>
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
