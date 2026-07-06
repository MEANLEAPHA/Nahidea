// context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axiosInstance";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const res = await api.get("/api/notifications/unread-count");
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, []);

  useEffect(() => {
    refreshUnreadCount();
    intervalRef.current = setInterval(refreshUnreadCount, 180000);

    const handleVisibility = () => {
      if (!document.hidden) refreshUnreadCount();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refreshUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);