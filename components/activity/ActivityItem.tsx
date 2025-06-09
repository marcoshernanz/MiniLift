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
    <View
      style={{
        width: Dimensions.get("window").width,
        paddingHorizontal: 16,
      }}
    >
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
          renderItem={({ item }) => <ActivityLogItem log={item} />}
          contentContainerStyle={styles.scrollView}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
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
  scrollView: {
    flex: 1,
    gap: 16,
  },
});
