// import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
// import api from "../api/axiosInstance";
// import { useAuth } from "./AuthContext"; // adjust path to match your structure

// const RankingContext = createContext(null);

// const INITIAL_STATE = {
//   rank: null,
//   score: 0,
//   badgeTier: null,
//   loadings: true,
//   error: null,
// };

// export const RankingProvider = ({ children }) => {
//   const { token, user } = useAuth(); // re-fetch whenever auth identity changes
//   const [ranking, setRanking] = useState(INITIAL_STATE);
//   const requestIdRef = useRef(0); // guard against out-of-order responses, same pattern as AuthContext

//   const fetchMyRanking = useCallback(async () => {
//     const myRequestId = ++requestIdRef.current;
//     try {
//       setRanking((prev) => ({ ...prev, loadings: true, error: null }));
//       const { data } = await api.get(`/api/ranking/me`);

//       if (myRequestId !== requestIdRef.current) return; // a newer call superseded this one

//       setRanking({
//         rank: data.rank,
//         score: data.score,
//         badgeTier: data.badgeTier,
//         loadings: false,
//         error: null,
//       });
//     } catch (err) {
//       if (myRequestId !== requestIdRef.current) return;
//       setRanking((prev) => ({
//         ...prev,
//         loadings: false,
//         error: err?.response?.data?.error || "Failed to load ranking",
//       }));
//     }
//   }, []);

//   useEffect(() => {
//     if (!token || !user) {
//       // logged out — wipe any previous user's ranking immediately
//       requestIdRef.current++; // invalidate any in-flight request from the previous user
//       setRanking(INITIAL_STATE);
//       return;
//     }
//     fetchMyRanking();
//   }, [token, user?.id, fetchMyRanking]); // refetch whenever the logged-in identity changes

//   return (
//     <RankingContext.Provider value={{ ...ranking, refresh: fetchMyRanking }}>
//       {children}
//     </RankingContext.Provider>
//   );
// };

// export const useRanking = () => {
//   const ctx = useContext(RankingContext);
//   if (!ctx) throw new Error("useRanking must be used within a RankingProvider");
//   return ctx;
// };
import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import api from "../api/axiosInstance";

const RankingContext = createContext(null);

export const RankingProvider = ({ children }) => {
  // cache: { [userId]: { rank, score, badgeTier, loading, error } }
  const [cache, setCache] = useState({});
  const inFlightRef = useRef(new Set()); // prevents duplicate simultaneous fetches for the same userId

  const fetchRankingFor = useCallback(async (userId) => {
    if (!userId) return;
    const id = userId.toString();

    // Already cached (and not stale) or already being fetched — skip
    if (cache[id] && !cache[id].loading) return;
    if (inFlightRef.current.has(id)) return;

    inFlightRef.current.add(id);
    setCache((prev) => ({
      ...prev,
      [id]: { rank: null, score: 0, badgeTier: null, loading: true, error: null },
    }));

    try {
      const { data } = await api.get(`/api/ranking/user/${id}`);
      setCache((prev) => ({
        ...prev,
        [id]: {
          rank: data.rank,
          score: data.score,
          badgeTier: data.badgeTier,
          loadings: false,
          error: null,
        },
      }));
    } catch (err) {
      setCache((prev) => ({
        ...prev,
        [id]: { rank: null, score: 0, badgeTier: null, loadings: false, error: "Failed to load" },
      }));
    } finally {
      inFlightRef.current.delete(id);
    }
  }, [cache]);

  return (
    <RankingContext.Provider value={{ cache, fetchRankingFor }}>
      {children}
    </RankingContext.Provider>
  );
};

export const useRankingContext = () => {
  const ctx = useContext(RankingContext);
  if (!ctx) throw new Error("useRankingContext must be used within a RankingProvider");
  return ctx;
};