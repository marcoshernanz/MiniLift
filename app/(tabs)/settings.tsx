import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import { Toast } from "@/components/ui/Toast";

export default function SettingsScreen() {
  return (
    <SafeArea>
      <Button
        containerStyle={{ marginTop: 200 }}
        onPress={() =>
          Toast.show({
            text: "Exercise added successfully",
            variant: "success",
          })
        }
      >
        Show Toast
      </Button>
    </SafeArea>
  );
}
