import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

import api from "../api/axiosInstance";
const RankingContext = createContext(null);

export const RankingProvider = ({ children }) => {
  const [ranking, setRanking] = useState({
    rank: null,
    score: 0,
    badgeTier: null,
    loadings: true,
    error: null,
  });

  const fetchMyRanking = useCallback(async () => {
    try {
      setRanking((prev) => ({ ...prev, loadings: true, error: null }));
      const {data} = await api.get(`/api/ranking/me`);

      setRanking({
        rank: data.rank,
        score: data.score,
        badgeTier: data.badgeTier,
        loadings: false,
        error: null,
      });
    } catch (err) {
      setRanking((prev) => ({
        ...prev,
        loadings: false,
        error: err?.response?.data?.error || "Failed to load ranking",
      }));
    }
  }, []);

  useEffect(() => {
    fetchMyRanking();
  }, [fetchMyRanking]);

  return (
    <RankingContext.Provider value={{ ...ranking, refresh: fetchMyRanking }}>
      {children}
    </RankingContext.Provider>
  );
};

// Usage anywhere: const { rank, badgeTier, score, loading } = useRanking();
export const useRanking = () => {
  const ctx = useContext(RankingContext);
  if (!ctx) throw new Error("useRanking must be used within a RankingProvider");
  return ctx;
};