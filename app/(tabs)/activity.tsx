import ActivityItem from "@/components/activity/ActivityItem";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import { useActivity } from "@/lib/hooks/useActivity";
import React from "react";
import { Dimensions, FlatList, StyleSheet } from "react-native";

export default function ActivityScreen() {
  const data = useActivity();
  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeArea style={styles.safeArea} edges={["top"]}>
      <Title style={styles.title}>Activity</Title>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={({ date }) => date.toDateString()}
        initialScrollIndex={data.length - 1}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        renderItem={({ item }) => (
          <ActivityItem key={item.date.toDateString()} item={item} />
        )}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingHorizontal: 0,
  },
  title: {
    paddingHorizontal: 16,
  },
});
