// src/utils/anonymousTokens.js

const STORAGE_TOKENS = "AnnoymousUsed";
const STORAGE_RESET = "AnnoymousResetDate";

// Compute next local midnight
export function getNextLocalMidnight() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
}

// Read tokens from localStorage
export function readTokens() {
  const raw = localStorage.getItem(STORAGE_TOKENS);
  return raw == null ? 3 : Number(raw);
}

// Save tokens
export function saveTokens(n) {
  localStorage.setItem(STORAGE_TOKENS, String(n));
}

// Read reset date
export function readResetDate() {
  const raw = localStorage.getItem(STORAGE_RESET);
  return raw ? new Date(raw) : null;
}

// Save reset date
export function saveResetDate(date) {
  localStorage.setItem(STORAGE_RESET, date.toISOString());
}

// Clear reset
export function clearResetDate() {
  localStorage.removeItem(STORAGE_RESET);
}

// Format countdown seconds to HH:MM:SS
export function formatSeconds(s) {
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

