// src/assets/util/scrollStore.js
const STORAGE_KEY = 'home_scroll_data';

const saveCurrentScroll = () => {
  saveScroll("home", {
    y: scrollYRef.current,
    page: pageRef.current,
  });

  console.log(
    "Saving scroll",
    scrollYRef.current,
    "page",
    pageRef.current
  );
};

export function getScroll(key) {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    if (stored) {
      const data = JSON.parse(stored);
      // Optional: Expire old scroll positions after 1 hour
      if (Date.now() - data.timestamp < 3600000) {
        return { y: data.y, page: data.page };
      }
    }
  } catch (e) {
    console.warn('Failed to get scroll position:', e);
  }
  return { y: 0, page: 1 };
}