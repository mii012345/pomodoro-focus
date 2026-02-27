"use client";

interface StatsProps {
  pomodoroCount: number;
  totalMinutes: number;
}

export default function Stats({ pomodoroCount, totalMinutes }: StatsProps) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center rounded-xl bg-zinc-800/50 px-6 py-4">
        <span className="text-2xl font-semibold text-red-400">
          {pomodoroCount}
        </span>
        <span className="mt-1 text-xs text-zinc-500">完了ポモドーロ</span>
      </div>
      <div className="flex flex-col items-center rounded-xl bg-zinc-800/50 px-6 py-4">
        <span className="text-2xl font-semibold text-emerald-400">
          {totalMinutes}
        </span>
        <span className="mt-1 text-xs text-zinc-500">集中時間(分)</span>
      </div>
    </div>
  );
}
