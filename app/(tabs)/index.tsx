import HomeActivity from "@/components/home/HomeActivity";
import HomeBodyweight from "@/components/home/HomeBodyweight";
import HomeScore from "@/components/home/HomeScore";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeArea style={{ paddingHorizontal: 0 }} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <Title style={{ paddingBottom: 20 }}>Home</Title>
        <HomeScore />
        <HomeBodyweight />
        <HomeActivity />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
