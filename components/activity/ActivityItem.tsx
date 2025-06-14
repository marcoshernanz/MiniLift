import getColor from "@/lib/getColor";
import { ActivityEntry } from "@/lib/hooks/useActivity";
import { format } from "date-fns";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import Description from "../ui/Description";
import Text from "../ui/Text";
import ActivityLogItem from "./ActivityLogItem";

interface Props {
  item: ActivityEntry;
}

export default function ActivityItem({ item }: Props) {
  const { logs, date } = item;

  return (
    <View style={styles.container}>
      <Description style={styles.description}>
        {format(date, "MMMM dd, yyyy")}
      </Description>

      {logs.length === 0 && (
        <View style={styles.noActivityView}>
          <Text style={styles.noActivityText}>No activity</Text>
        </View>
      )}

      {logs.length > 0 && (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => <ActivityLogItem log={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
  },
  description: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  noActivityView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noActivityText: {
    fontSize: 14,
    color: getColor("mutedForeground"),
    marginTop: -50,
  },
});
