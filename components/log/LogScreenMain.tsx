import { useAppContext } from "@/context/AppContext";
import getColor from "@/lib/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { XIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { v4 as uuidv4 } from "uuid";
import Button from "../ui/Button";
import { Toast } from "../ui/Toast";
import LogBodyweight from "./LogBodyweight";
import LogLift from "./LogLift";

interface Props {
  onClose: () => void;
  scrollViewRef: React.RefObject<Animated.ScrollView | null>;
  scrollX: SharedValue<number>;
  logLiftTitle?: string;
  logLiftDescription?: string;
  logBodyweightTitle?: string;
  logBodyweightDescription?: string;
}

export default function LogScreenMain({
  onClose,
  scrollViewRef,
  scrollX,
  logLiftTitle,
  logLiftDescription,
  logBodyweightTitle,
  logBodyweightDescription,
}: Props) {
  const { setAppData } = useAppContext();
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

  const handleLogLift = ({
    exercise,
    weight,
    reps,
  }: {
    exercise: Exercise;
    weight: number;
    reps: number;
  }) => {
    const newLog = {
      id: uuidv4(),
      date: new Date(),
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
  };

  const handleLogBodyweight = ({ bodyweight }: { bodyweight: number }) => {
    const newLog = {
      id: uuidv4(),
      date: new Date(),
      bodyweight,
    };
    setAppData((prev) => ({
      ...prev,
      bodyweightLogs: [...prev.bodyweightLogs, newLog],
    }));

    Toast.show({ text: `${bodyweight}kg`, variant: "success" });
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
      <View style={{ width: screenWidth, position: "relative" }}>
        <LogLift
          onInputFocus={handleInputFocus}
          onInputBlur={handleInputBlur}
          editingEnabled={!isAnimating}
          title={logLiftTitle}
          description={logLiftDescription}
          handleLog={handleLogLift}
          onClose={onClose}
        />
        <Button
          variant="ghost"
          containerStyle={styles.closeButtonContainer}
          pressableStyle={styles.closeButtonPressable}
          onPress={onClose}
        >
          <XIcon color={getColor("foreground")} />
        </Button>
      </View>
      <View style={{ width: screenWidth, position: "relative" }}>
        <LogBodyweight
          onInputFocus={handleInputFocus}
          onInputBlur={handleInputBlur}
          editingEnabled={!isAnimating}
          title={logBodyweightTitle}
          description={logBodyweightDescription}
          handleLog={handleLogBodyweight}
          onClose={onClose}
        />
        <Button
          variant="ghost"
          containerStyle={styles.closeButtonContainer}
          pressableStyle={styles.closeButtonPressable}
          onPress={onClose}
        >
          <XIcon color={getColor("foreground")} />
        </Button>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  closeButtonContainer: {
    position: "absolute",
    top: 20,
    right: 16,
    borderRadius: 9999,
    zIndex: 10,
  },
  closeButtonPressable: {
    borderRadius: 9999,
    padding: 10,
    height: 38,
    width: 38,
  },
});
