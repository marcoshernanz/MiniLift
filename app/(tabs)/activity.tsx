import ActivityAdd from "@/components/activity/ActivityAdd";
import ActivityItem from "@/components/activity/ActivityItem";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import { useActivity } from "@/lib/hooks/useActivity";
import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

export default function ActivityScreen() {
  const data = useActivity();
  const [currentIndex, setCurrentIndex] = useState(data.length - 1);

  const screenWidth = Dimensions.get("window").width;
  const currentDate = data[currentIndex]?.date || new Date();

  return (
    <SafeArea style={styles.safeArea} edges={["top"]}>
      <View style={{ position: "relative", flex: 1 }}>
        <Title style={styles.title}>Activity</Title>
        <FlashList
          data={data}
          style={{ flex: 1 }}
          estimatedItemSize={screenWidth}
          horizontal
          pagingEnabled
          directionalLockEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={({ date }) => date.toDateString()}
          initialScrollIndex={data.length - 1}
          onMomentumScrollEnd={(ev) => {
            const index = Math.round(
              ev.nativeEvent.contentOffset.x / screenWidth
            );
            setCurrentIndex(index);
          }}
          renderItem={({ item }) => <ActivityItem item={item} />}
        />

        <ActivityAdd date={currentDate} />
      </View>
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
