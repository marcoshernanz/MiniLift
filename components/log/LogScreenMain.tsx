import { useAppContext } from "@/context/AppContext";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import React, { useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { Toast } from "../ui/Toast";
import * as StoreReview from "expo-store-review";
import LogBodyweight from "./LogBodyweight";
import LogLift from "./LogLift";
import uuidv4 from "@/lib/utils/uuidv4";
import SafeArea from "../ui/SafeArea";

interface Props {
  onClose: () => void;
  scrollViewRef: React.RefObject<Animated.ScrollView | null>;
  scrollX: SharedValue<number>;
  logLiftTitle?: string;
  logLiftDescription?: string;
  logBodyweightTitle?: string;
  logBodyweightDescription?: string;
  logDate?: Date;
}

export default function LogScreenMain({
  onClose,
  scrollViewRef,
  scrollX,
  logLiftTitle,
  logLiftDescription,
  logBodyweightTitle,
  logBodyweightDescription,
  logDate = new Date(),
}: Props) {
  const { setAppData, appData } = useAppContext();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const screenWidth = Dimensions.get("screen").width;

  const handleInputFocus = () => setIsInputFocused(true);
  const handleInputBlur = () => setIsInputFocused(false);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleLogLift = async ({
    exercise,
    weight,
    reps,
  }: {
    exercise: Exercise;
    weight: number;
    reps: number;
  }) => {
    const prevCount = appData.liftLogs.length + appData.bodyweightLogs.length;
    const newLog = {
      id: uuidv4(),
      date: logDate,
      exercise,
      weight,
      reps,
    };

    setAppData((prev) => ({
      ...prev,
      liftLogs: [...prev.liftLogs, newLog],
    }));

    Toast.show({
      text: `${exercise.name}: ${weight}kg x ${Math.floor(reps)}`,
      variant: "success",
    });
    if (prevCount + 1 === 200) {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (isAvailable) {
        await StoreReview.requestReview();
      }
    }
  };

  const handleLogBodyweight = async ({
    bodyweight,
  }: {
    bodyweight: number;
  }) => {
    const prevCount = appData.liftLogs.length + appData.bodyweightLogs.length;
    const newLog = {
      id: uuidv4(),
      date: logDate,
      bodyweight,
    };
    setAppData((prev) => ({
      ...prev,
      bodyweightLogs: [...prev.bodyweightLogs, newLog],
    }));

    Toast.show({ text: `${bodyweight}kg`, variant: "success" });
    if (prevCount + 1 === 200) {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (isAvailable) {
        await StoreReview.requestReview();
      }
    }
  };

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      overScrollMode="never"
      scrollEnabled={!isInputFocused && !isAnimating}
      scrollEventThrottle={16}
      onScroll={scrollHandler}
      onMomentumScrollBegin={() => setIsAnimating(true)}
      onMomentumScrollEnd={() => setIsAnimating(false)}
    >
      <View style={{ width: screenWidth }}>
        <SafeArea style={styles.safeArea} edges={["left", "right"]}>
          <View style={styles.container}>
            <LogLift
              onInputFocus={handleInputFocus}
              onInputBlur={handleInputBlur}
              editingEnabled={!isAnimating}
              title={logLiftTitle}
              description={logLiftDescription}
              handleLog={handleLogLift}
              onClose={onClose}
            />
          </View>
        </SafeArea>
      </View>
      <View style={{ width: screenWidth }}>
        <SafeArea>
          <View style={styles.container}>
            <LogBodyweight
              onInputFocus={handleInputFocus}
              onInputBlur={handleInputBlur}
              editingEnabled={!isAnimating}
              title={logBodyweightTitle}
              description={logBodyweightDescription}
              handleLog={handleLogBodyweight}
              onClose={onClose}
            />
          </View>
        </SafeArea>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 20 : 0,
  },
  safeArea: {
    paddingTop: 0,
  },
});
