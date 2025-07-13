import { useAppContext } from "@/context/AppContext";
import useScoresByDay from "@/lib/hooks/score/useScoresByDay";
import { eachDayOfInterval, format } from "date-fns";

export type DataType = {
  score: Record<string, number | null>;
  oneRepMax: Record<string, number | null>;
};

export default function useDailyScore(exerciseId?: string): DataType {
  const { appData } = useAppContext();
  const scoresByDay = useScoresByDay(exerciseId);

  if (!exerciseId) {
    return { oneRepMax: {}, score: {} };
  }

  const { liftLogs } = appData;
  const filteredLogs = liftLogs.filter((log) => log.exercise.id === exerciseId);
  if (filteredLogs.length === 0) {
    return { oneRepMax: {}, score: {} };
  }
  const logs = filteredLogs.sort((a, b) => a.date.getTime() - b.date.getTime());

  const startDate = logs[0].date;
  const endDate = new Date();
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const resultOneRepMax: Record<string, number | null> = {};
  const resultScore: Record<string, number | null> = {};

  days.forEach((day) => {
    const key = format(day, "yyyy-MM-dd");
    const entries = scoresByDay[key];

    if (entries && entries.length > 0) {
      const totalOneRepMax = entries.reduce((sum, e) => sum + e.oneRepMax, 0);
      const totalScore = entries.reduce((sum, e) => sum + e.score, 0);

      resultOneRepMax[key] = totalOneRepMax / entries.length;
      resultScore[key] = totalScore / entries.length;
    } else {
      resultOneRepMax[key] = null;
      resultScore[key] = null;
    }
  });

  return { oneRepMax: resultOneRepMax, score: resultScore };
}
