import Button from "@/components/ui/Button";
import Chart from "@/components/ui/SimpleChart";
import SimpleDialog from "@/components/ui/SimpleDialog";
import Text from "@/components/ui/Text";
import getColor from "@/lib/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { useRouter } from "expo-router";
import { CircleHelpIcon, MaximizeIcon } from "lucide-react-native";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const dummyData = {
  "Jan 01": 90,
  "Jan 02": 91,
  "Jan 03": 88,
  "Jan 04": 100,
  "Jan 05": 85,
  "Jan 06": 105,
  "Jan 07": 100,
  "Jan 08": 95,
  "Jan 09": 90,
  "Jan 10": 105,
  "Jan 11": 90,
  "Jan 12": 95,
  "Jan 13": 100,
  "Jan 14": 95,
  "Jan 15": 90,
  "Jan 16": 115,
  "Jan 17": 105,
  "Jan 18": 110,
  "Jan 19": 130,
  "Jan 20": 95,
  "Jan 21": 110,
  "Jan 22": 115,
  "Jan 23": 120,
  "Jan 24": 125,
  "Jan 25": 110,
  "Jan 26": 115,
  "Jan 27": 100,
  "Jan 28": 105,
  "Jan 29": 120,
  "Jan 30": 115,
};

interface Props {
  exercise: Exercise;
}

export default function ExerciseDetailsScore({ exercise }: Props) {
  const [helpVisible, setHelpVisible] = useState(false);

  const change = 0.1;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Score</Text>
        <Button
          variant="ghost"
          containerStyle={{
            marginTop: 2.5,
            marginLeft: 2,
            height: 32,
            width: 32,
            borderRadius: 999,
          }}
          pressableStyle={{ padding: 8 }}
          onPress={() => setHelpVisible(true)}
        >
          <CircleHelpIcon color={getColor("mutedForeground")} />
        </Button>
      </View>

      <SimpleDialog
        title="Score"
        content="Your score shows how strong you are for your body weight. It’s your max lift divided by your body weight, shown as a percent."
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
      />

      <Text style={styles.description}>
        Last 30 days{" "}
        <Text
          style={{
            color: change >= 0 ? getColor("green") : getColor("red"),
            fontWeight: 600,
          }}
        >
          {change >= 0 && "+"}
          {change * 100}%
        </Text>
      </Text>

      <Chart
        data={dummyData}
        width={Dimensions.get("window").width - 32}
        height={250}
        labelCount={4}
      />

      <Button
        variant="ghost"
        pressableStyle={styles.maximizeButton}
        containerStyle={styles.maximizeButtonContainer}
        onPress={() => router.push(`/exercise/${exercise.id}/chart`)}
      >
        <MaximizeIcon color={getColor("foreground")} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
  },
  description: {
    fontSize: 14,
    fontWeight: 400,
    color: getColor("mutedForeground"),
    paddingBottom: 16,
  },
  maximizeButtonContainer: {
    position: "absolute",
    right: 16,
    height: 46,
    width: 46,
    borderRadius: 999,
  },
  maximizeButton: {
    padding: 12,
  },
});
