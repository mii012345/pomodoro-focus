"use client";

import { useState } from "react";
import { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (title: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSelectTask: (id: string) => void;
}

export default function TaskList({
  tasks,
  activeTaskId,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onSelectTask,
}: TaskListProps) {
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTask.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setNewTask("");
  };

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-3 text-sm font-medium tracking-widest uppercase opacity-60">
        タスク
      </h2>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="新しいタスクを追加..."
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-zinc-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-600"
        >
          追加
        </button>
      </form>

      <ul className="space-y-1">
        {incompleteTasks.map((task) => (
          <li
            key={task.id}
            onClick={() => onSelectTask(task.id)}
            className={`group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              activeTaskId === task.id
                ? "bg-red-500/10 border border-red-500/30"
                : "hover:bg-zinc-800/50 border border-transparent"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleTask(task.id);
              }}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-zinc-600 transition-colors hover:border-zinc-400"
              aria-label={`${task.title}を完了にする`}
            />
            <span className="flex-1 text-sm text-zinc-200">{task.title}</span>
            {task.pomodoroCount > 0 && (
              <span className="text-xs text-zinc-500">
                🍅 {task.pomodoroCount}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task.id);
              }}
              className="text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
              aria-label={`${task.title}を削除`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {completedTasks.length > 0 && (
        <>
          <div className="mt-4 mb-2 text-xs text-zinc-600">
            完了済み ({completedTasks.length})
          </div>
          <ul className="space-y-1">
            {completedTasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-center gap-3 rounded-lg px-3 py-2"
              >
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-600 text-xs text-white"
                  aria-label={`${task.title}を未完了に戻す`}
                >
                  ✓
                </button>
                <span className="flex-1 text-sm text-zinc-500 line-through">
                  {task.title}
                </span>
                {task.pomodoroCount > 0 && (
                  <span className="text-xs text-zinc-600">
                    🍅 {task.pomodoroCount}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
