import SettingsGroup from "../SettingsGroup";
import SettingsItem from "../SettingsItem";
import React from "react";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { Toast } from "@/components/ui/Toast";
import { useAppContext } from "@/context/AppContext";

export default function ImportExportData() {
  const { exportData, importData } = useAppContext();

  const importAppData = async () => {
    try {
      const data = exportData();
      const filename = FileSystem.documentDirectory + "minilift-export.json";

      await FileSystem.writeAsStringAsync(filename, data, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(filename, { mimeType: "application/json" });
    } catch {
      Toast.show({ text: "Export failed", variant: "error" });
    }
  };

  const exportAppData = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });
      if (res.canceled) {
        return;
      }

      const asset = res.assets[0];
      if (asset.mimeType !== "application/json") {
        Toast.show({ text: "Invalid file type", variant: "error" });
        return;
      }

      try {
        const json = await FileSystem.readAsStringAsync(asset.uri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        importData(json);
      } catch {
        Toast.show({ text: "Invalid data", variant: "error" });
        return;
      }

      Toast.show({ text: "Import successful", variant: "success" });
    } catch {
      Toast.show({ text: "Import failed", variant: "error" });
    }
  };

  return (
    <SettingsGroup>
      <SettingsItem text="Import App Data" onPress={importAppData} />
      <SettingsItem text="Export App Data" onPress={exportAppData} />
    </SettingsGroup>
  );
}
