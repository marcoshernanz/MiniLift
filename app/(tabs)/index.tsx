import ActivityLogItem from "@/components/activity/ActivityLogItem";
import HomeBodyweight from "@/components/home/HomeBodyweight";
import HomeScore from "@/components/home/HomeScore";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { useAppContext } from "@/context/AppContext";
import { FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const { appData } = useAppContext();

  const logs = [
    ...appData.liftLogs.map((log) => ({ ...log, type: "lift" as const })),
    ...appData.bodyweightLogs.map((log) => ({
      ...log,
      type: "bodyweight" as const,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <SafeArea style={{ paddingHorizontal: 0 }} edges={["top", "left", "right"]}>
      <Title style={styles.title}>Home</Title>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={{ paddingHorizontal: 16 }}>
            <HomeScore />
            <HomeBodyweight />
            <Text style={styles.activityTitle}>Activity</Text>
          </View>
        )}
        renderItem={({ item }) => <ActivityLogItem log={item} showDate />}
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        bounces={false}
        alwaysBounceVertical={false}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  activityTitle: {
    fontSize: 24,
    fontWeight: "600",
    paddingBottom: 12,
  },
});
