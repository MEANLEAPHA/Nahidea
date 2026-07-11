import { useEffect } from "react";
import { useRankingContext } from "../../context/RankContext";

/**
 * useUserRanking(userId) — call this anywhere you show a rank/badge for a specific user.
 * Automatically dedupes: if 10 components on the same page ask for the same userId,
 * only ONE request fires; every other caller gets served from cache.
 */
export const useUserRanking = (userId) => {
  const { cache, fetchRankingFor } = useRankingContext();

  useEffect(() => {
    if (userId) fetchRankingFor(userId);
  }, [userId, fetchRankingFor]);

  const id = userId?.toString();
  return cache[id] || { rank: null, score: 0, badgeTier: null, loadings: !!userId, error: null };
};