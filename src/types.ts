export type TimerMode = "work" | "break" | "longBreak";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  pomodoroCount: number;
  createdAt: number;
}

export interface DayStats {
  date: string; // YYYY-MM-DD
  completedPomodoros: number;
  totalFocusMinutes: number;
}

export const TIMER_DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

export const MODE_LABELS: Record<TimerMode, string> = {
  work: "集中",
  break: "休憩",
  longBreak: "長休憩",
};
