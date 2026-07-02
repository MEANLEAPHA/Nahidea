import {
  createContext, useContext, useState, useEffect, useRef, useCallback,
} from "react";
import api from "../api/axiosInstance";
import { authStore } from "../api/authStore";
import { disconnectSocket } from "../../socket";

const AuthContext = createContext();

const safeStorage = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => safeStorage.get("token"));
  const [loading, setLoading] = useState(true);

  const requestIdRef = useRef(0);   // guards against out-of-order responses
  const logoutTimerRef = useRef(null);

  const logout = useCallback(() => {
    safeStorage.remove("token");
    safeStorage.remove("tokenExpiry");
    authStore.setToken(null);

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    disconnectSocket();
    setTokenState(null);
    setUser(null);
  }, []);

  // The ONLY way a login should ever happen. Call this from Login.jsx
  // instead of touching localStorage directly.
  const login = useCallback((newToken, expiryTimestamp) => {
    const persisted = safeStorage.set("token", newToken);
    safeStorage.set("tokenExpiry", String(expiryTimestamp));

    if (!persisted) {
      console.warn("Session couldn't be saved (private browsing?). Won't survive a refresh.");
    }

    authStore.setToken(newToken);
    setUser(null);          // wipe the previous account's data immediately
    setTokenState(newToken);
  }, []);

  useEffect(() => {
    authStore.registerLogoutHandler(logout);
  }, [logout]);

  useEffect(() => {
    const myRequestId = ++requestIdRef.current;

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    const run = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const expiry = Number(safeStorage.get("tokenExpiry"));
      if (!expiry || Date.now() > expiry) {
        logout();
        setLoading(false);
        return;
      }

      logoutTimerRef.current = setTimeout(logout, expiry - Date.now());
      authStore.setToken(token);
      setLoading(true);

      try {
        const res = await api.get("/api/me");

        // a newer login happened while this was in flight — discard this result
        if (myRequestId !== requestIdRef.current) return;

        const data = res.data.userData || res.data;
        setUser({
          id: data.id,
          email: data.email,
          username: data.username,
          avatar_url: data.avatar_url,
          banner_url: data.banner_url,
          profession: data.profession,
          work_location: data.work_place,
          bio: data.bio,
          nickname: data.nickname,
        });
      } catch (err) {
        if (myRequestId !== requestIdRef.current) return;
        console.error(err);
        logout();
      } finally {
        if (myRequestId === requestIdRef.current) setLoading(false);
      }
    };

    run();

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);









// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//   const [user, setUser] = useState(null);

//   const [token, setToken] = useState(
//     localStorage.getItem("token")
//   );

//   const [loading, setLoading] = useState(true);
//   const logout = () => {

//     localStorage.removeItem("token");
//     localStorage.removeItem("tokenExpiry");

//     setToken(null);
//     setUser(null);

//   };
//   useEffect(() => {

//   const validateSession = async () => {

//     try {

//       // no token
//       if (!token) {
//         setUser(null);
//         setLoading(false);
//         return;
//       }

//       // expiry check
//       const expiry = Number(
//         localStorage.getItem("tokenExpiry")
//       );

//       if (!expiry || Date.now() > expiry) {

//         localStorage.removeItem("token");
//         localStorage.removeItem("tokenExpiry");

//         setToken(null);
//         setUser(null);
//         setLoading(false);

//         return;
//       }

//       // validate token with backend
//       const res = await axios.get(
//         `${import.meta.env.VITE_SERVER_URL}/api/me`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = res.data.userData || res.data;

//       setUser({
//         id: data.id,
//         email: data.email,
//         username: data.username,
//         avatar_url: data.avatar_url,
//         banner_url: data.banner_url,
//         profession: data.profession,
//         work_location: data.work_place,
//         bio: data.bio,
//         nickname: data.nickname,
//       });

//     } catch (err) {

//       console.error(err);

//       localStorage.removeItem("token");
//       localStorage.removeItem("tokenExpiry");

//       setToken(null);
//       setUser(null);

//     } finally {

//       setLoading(false);

//     }
//   };

//   validateSession();

// }, [token]);
//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         setUser,
//         setToken,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


// export const useAuth = () => useContext(AuthContext);

