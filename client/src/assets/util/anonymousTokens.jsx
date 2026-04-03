// src/utils/anonymousTokens.js

const STORAGE_TOKENS = "AnnoymousUsed";
const STORAGE_RESET = "AnnoymousResetDate";

import React from "react";
import { useState, useEffect, useRef } from 'react';
// Compute next local midnight
 function getNextLocalMidnight() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
}

// Read tokens from localStorage
 function readTokens() {
  const raw = localStorage.getItem(STORAGE_TOKENS);
  return raw == null ? 3 : Number(raw);
}

// Save tokens
 function saveTokens(n) {
  localStorage.setItem(STORAGE_TOKENS, String(n));
}

// Read reset date
 function readResetDate() {
  const raw = localStorage.getItem(STORAGE_RESET);
  return raw ? new Date(raw) : null;
}

// Save reset date
 function saveResetDate(date) {
  localStorage.setItem(STORAGE_RESET, date.toISOString());
}

// Clear reset
 function clearResetDate() {
  localStorage.removeItem(STORAGE_RESET);
}

// Format countdown seconds to HH:MM:SS
 function formatSeconds(s) {
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export  function useAnonymousTokens() {
  const [tokens, setTokens] = useState(3);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef(null);

  const startCountdown = (targetDate) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const tick = () => {
      const diff = targetDate.getTime() - Date.now();

      if (diff <= 0) {
        setTokens(3);
        saveTokens(3);
        clearResetDate();
        setCountdown(0);
        clearInterval(intervalRef.current);
        return;
      }

      setCountdown(Math.ceil(diff / 1000));
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
  };

  useEffect(() => {
    const stored = readTokens();
    setTokens(stored);

    const resetDate = readResetDate();
    if (resetDate) {
      if (resetDate.getTime() > Date.now()) {
        startCountdown(resetDate);
      } else {
        setTokens(3);
        saveTokens(3);
        clearResetDate();
      }
    }

    return () => clearInterval(intervalRef.current);
  }, []);

  const consume = () => {
    const next = Math.max(0, tokens - 1);
    setTokens(next);
    saveTokens(next);

    if (next === 0) {
      const midnight = getNextLocalMidnight();
      saveResetDate(midnight);
      startCountdown(midnight);
    }
  };

  return { tokens, countdown, consume };
}

export function AnonymousToggle({
  enabled,
  setEnabled,
  tokens,
  countdown,
}) {
  if (tokens === 0) {
    return (
      <div>
        <span>Tokens exhausted. Reset at midnight.</span>
        <div>Remaining: {tokens}</div>
        <div>Time left: {formatSeconds(countdown)}</div>
      </div>
    );
  }

  return (
    <div className="toggle-switch">
      <span>Post anonymous</span>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
        id="deadlineStatus"
      />
      <label htmlFor="deadlineStatus"></label>
      <div>Remaining tokens: {tokens}</div>
    </div>
  );
}