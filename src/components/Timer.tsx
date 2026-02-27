"use client";

import { TimerMode, MODE_LABELS } from "@/types";

interface TimerProps {
  timeLeft: number;
  mode: TimerMode;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function Timer({
  timeLeft,
  mode,
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerProps) {
  const modeColors: Record<TimerMode, string> = {
    work: "text-red-400",
    break: "text-emerald-400",
    longBreak: "text-blue-400",
  };

  const buttonColors: Record<TimerMode, string> = {
    work: "bg-red-500 hover:bg-red-600",
    break: "bg-emerald-500 hover:bg-emerald-600",
    longBreak: "bg-blue-500 hover:bg-blue-600",
  };

  const ringColors: Record<TimerMode, string> = {
    work: "border-red-500/30",
    break: "border-emerald-500/30",
    longBreak: "border-blue-500/30",
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm font-medium tracking-widest uppercase opacity-60">
        {MODE_LABELS[mode]}
      </div>

      <div
        className={`relative flex h-56 w-56 items-center justify-center rounded-full border-4 ${ringColors[mode]} transition-colors duration-500`}
      >
        <span className={`text-6xl font-light tabular-nums ${modeColors[mode]} transition-colors duration-500`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex gap-3">
        {!isRunning ? (
          <button
            onClick={onStart}
            className={`rounded-full px-8 py-3 text-sm font-medium text-white transition-colors ${buttonColors[mode]}`}
          >
            {timeLeft === 0 ? "次へ" : "開始"}
          </button>
        ) : (
          <button
            onClick={onPause}
            className="rounded-full bg-zinc-700 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-600"
          >
            一時停止
          </button>
        )}
        <button
          onClick={onReset}
          className="rounded-full bg-zinc-800 px-6 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          リセット
        </button>
        <button
          onClick={onSkip}
          className="rounded-full bg-zinc-800 px-6 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          スキップ
        </button>
      </div>
    </div>
  );
}
