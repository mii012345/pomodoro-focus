"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TimerMode, TIMER_DURATIONS } from "@/types";

interface UseTimerReturn {
  timeLeft: number;
  mode: TimerMode;
  isRunning: boolean;
  pomodoroCount: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
}

export function useTimer(onPomodoroComplete: () => void): UseTimerReturn {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const onCompleteRef = useRef(onPomodoroComplete);

  useEffect(() => {
    onCompleteRef.current = onPomodoroComplete;
  }, [onPomodoroComplete]);

  const playNotificationSound = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gain.gain.value = 0.3;
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio not supported
    }
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  }, []);

  const nextMode = useCallback(() => {
    if (mode === "work") {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      onCompleteRef.current();
      playNotificationSound();
      if (newCount % 4 === 0) {
        setMode("longBreak");
        setTimeLeft(TIMER_DURATIONS.longBreak);
        sendNotification("長休憩", "4ポモドーロ完了！15分休憩しましょう");
      } else {
        setMode("break");
        setTimeLeft(TIMER_DURATIONS.break);
        sendNotification("休憩", "5分間休憩しましょう");
      }
    } else {
      setMode("work");
      setTimeLeft(TIMER_DURATIONS.work);
      playNotificationSound();
      sendNotification("集中", "次のポモドーロを始めましょう！");
    }
    setIsRunning(false);
  }, [mode, pomodoroCount, playNotificationSound, sendNotification]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          nextMode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, nextMode]);

  const start = useCallback(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(TIMER_DURATIONS[mode]);
  }, [mode]);

  const skip = useCallback(() => {
    setIsRunning(false);
    nextMode();
  }, [nextMode]);

  return { timeLeft, mode, isRunning, pomodoroCount, start, pause, reset, skip };
}
