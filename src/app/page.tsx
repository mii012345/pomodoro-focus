"use client";

import { useCallback } from "react";
import { useTimer } from "@/hooks/useTimer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Timer from "@/components/Timer";
import TaskList from "@/components/TaskList";
import Stats from "@/components/Stats";
import { Task } from "@/types";

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Home() {
  const [tasks, setTasks, tasksHydrated] = useLocalStorage<Task[]>("pomo-tasks", []);
  const [activeTaskId, setActiveTaskId] = useLocalStorage<string | null>("pomo-active-task", null);
  const [dailyPomodoros, setDailyPomodoros] = useLocalStorage<Record<string, number>>("pomo-daily", {});

  const todayKey = getTodayKey();
  const todayCount = dailyPomodoros[todayKey] || 0;

  const handlePomodoroComplete = useCallback(() => {
    setDailyPomodoros((prev) => ({
      ...prev,
      [todayKey]: (prev[todayKey] || 0) + 1,
    }));

    if (activeTaskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeTaskId ? { ...t, pomodoroCount: t.pomodoroCount + 1 } : t
        )
      );
    }
  }, [todayKey, activeTaskId, setDailyPomodoros, setTasks]);

  const timer = useTimer(handlePomodoroComplete);

  const addTask = useCallback(
    (title: string) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        pomodoroCount: 0,
        createdAt: Date.now(),
      };
      setTasks((prev) => [...prev, newTask]);
    },
    [setTasks]
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      if (activeTaskId === id) {
        setActiveTaskId(null);
      }
    },
    [setTasks, activeTaskId, setActiveTaskId]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (activeTaskId === id) {
        setActiveTaskId(null);
      }
    },
    [setTasks, activeTaskId, setActiveTaskId]
  );

  const selectTask = useCallback(
    (id: string) => {
      setActiveTaskId(activeTaskId === id ? null : id);
    },
    [activeTaskId, setActiveTaskId]
  );

  if (!tasksHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-400" />
      </div>
    );
  }

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 px-4 py-12 text-white">
      <header className="mb-12 text-center">
        <h1 className="text-2xl font-bold tracking-tight">🍅 Pomodoro Focus</h1>
        {activeTask && (
          <p className="mt-2 text-sm text-zinc-400">
            作業中: <span className="text-red-400">{activeTask.title}</span>
          </p>
        )}
      </header>

      <main className="flex w-full max-w-lg flex-col items-center gap-10">
        <Timer
          timeLeft={timer.timeLeft}
          mode={timer.mode}
          isRunning={timer.isRunning}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.reset}
          onSkip={timer.skip}
        />

        <Stats pomodoroCount={todayCount} totalMinutes={todayCount * 25} />

        <TaskList
          tasks={tasks}
          activeTaskId={activeTaskId}
          onAddTask={addTask}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onSelectTask={selectTask}
        />
      </main>

      <footer className="mt-16 text-xs text-zinc-600">
        Built with Claude Code
      </footer>
    </div>
  );
}
