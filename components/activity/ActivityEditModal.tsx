import { LogType } from "@/lib/hooks/useActivity";
import { Modal } from "react-native";

interface Props {
  log: LogType;
  visible: boolean;
  onClose: () => void;
}

export default function ActivityEditModal({ log, visible, onClose }: Props) {
  return <Modal visible={visible} onRequestClose={onClose}></Modal>;
}
