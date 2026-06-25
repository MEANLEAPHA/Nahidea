// src/assets/util/scrollStore.js
const scrollPositions = {};

export function saveScroll(key, value) {
  scrollPositions[key] = value;
}

export function getScroll(key) {
  return scrollPositions[key] ?? { y: 0, page: 1 };
}