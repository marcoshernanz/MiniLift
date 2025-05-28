import getColor from "@/lib/getColor";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Statistics() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: getColor("background"),
      }}
    ></SafeAreaView>
  );
}
