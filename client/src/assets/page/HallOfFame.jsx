import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import  toast  from "react-hot-toast";
import "../style/page/HallOfFame.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";

const fmt = (n) => Number(n ?? 0).toLocaleString("en-US");


export default function HallOfFame() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const triggerButterflies = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 10000);
  };

  // Fetch a specific page (replaces or appends)
  const fetchPage = async (pageNum, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      if (USE_MOCK_DATA) {
        // Mock behavior – simulate pagination from MOCK_ITEMS
        await new Promise((resolve) => setTimeout(resolve, 800));
        const limit = 20;
        const start = (pageNum - 1) * limit;
        const paginated = MOCK_ITEMS.slice(start, start + limit);
        const total = MOCK_ITEMS.length;
        const totalPages = Math.ceil(total / limit);
        const newItems = paginated.map((item, idx) => ({
          ...item,
          rank: start + idx + 1,
        }));
        if (append) {
          setItems(prev => [...prev, ...newItems]);
        } else {
          setItems(newItems);
        }
        setTotalPages(totalPages);
      } else {
       
        // const res = await axios.get(
        //   `${import.meta.env.VITE_SERVER_URL}/api/hof`,
        //   { params: { page: pageNum, limit: 20 } }
        // );
        const res = await api.get(
          `/api/hof`,
          { params: { page: pageNum, limit: 20 } }
        )
        const { items: newItems, totalPages: totalPagesFromServer } = res.data;
        if (append) {
          setItems(prev => [...prev, ...newItems]);
        } else {
          setItems(newItems);
        }
        setTotalPages(totalPagesFromServer);
      }
    } catch (err) {
      console.error("Failed to load Hall of Fame:", err);
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    triggerButterflies();
    fetchPage(1, false);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, true);
  };

  const hasMore = page < totalPages;

  // Sort items by rank (just in case)
  const sorted = [...items].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
  const first = sorted.find(u => u.rank === 1);
  const second = sorted.find(u => u.rank === 2);
  const third = sorted.find(u => u.rank === 3);
  const rest = sorted.filter(u => (u.rank ?? 999) > 3);

  return (
    <div className="hof-root">
      {showCelebration && <div className="celebration-overlay"></div>}

      {/* Header */}
      <div className="hof-header">
        <div>
          <span className="hof-eyebrow">Leaderboard</span>
          <h1 className="hof-title">
            Hall of <span className="hof-title-accent">Fame</span>
          </h1>
        </div>
        <FontAwesomeIcon icon={faRankingStar} id="rank-icon-head" />
      </div>

      {/* Podium */}
      <div className="hof-podium">
        {second && <PodiumCard user={second} variant="second" />}
        {first && <PodiumCard user={first} variant="first" />}
        {third && <PodiumCard user={third} variant="third" />}
      </div>

      {/* List */}
      <div className="hof-list-wrap">
        <div className="hof-list">
          {loading && items.length === 0 && (
            <div className="hof-empty">Loading rankings…</div>
          )}
          {!loading && items.length === 0 && (
            <div className="hof-empty">No entries yet.</div>
          )}
          {rest.map((user) => (
            <div key={user.userId} className="hof-row">
              <div className="hof-rank-num">
                {String(user.rank).padStart(2, "0")}
              </div>
              <img
                src={user.avatar_url || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"}
                alt={user.username}
                className="hof-row-avatar"
                loading="lazy"
              />
              <div className="hof-row-info">
                <div className="hof-row-name">{user.username}</div>
                <div className="hof-row-prof">{user.profession}</div>
              </div>
              <div className="hof-row-score">
                <div className="hof-row-points">{fmt(user.score)} PTS</div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {!loading && hasMore && (
          <div className="hof-load-more">
            <button onClick={loadMore} disabled={loadingMore} className="hof-load-more-btn">
              {loadingMore ? "Loading..." : "Load 20 more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- PodiumCard component (unchanged) ----------
function PodiumCard({ user, variant }) {
  if (variant === "first") {
    return (
      <div className="hof-podium-card hof-podium-first">
        <div className="hof-podium-avatar-wrap">
          <img src={user.avatar_url} alt={user.username} className="hof-podium-avatar-first" />
          <div className="hof-podium-badge">1</div>
        </div>
        <div className="hof-podium-meta">
          <h3 className="hof-podium-name hof-podium-name-first">{user.username}</h3>
          <p className="hof-podium-prof hof-podium-prof-first">{user.profession}</p>
          <div className="hof-podium-score hof-podium-score-first">
            {fmt(user.score)} <span className="hof-pts">PTS</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`hof-podium-card hof-podium-${variant}`}>
      <div className="hof-podium-avatar-wrap">
        <img
          src={user.avatar_url || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"}
          alt={user.username}
          className={`hof-podium-avatar hof-podium-avatar-${variant}`}
        />
        <div className={`hof-podium-badge hof-podium-badge-${variant}`}>{user.rank}</div>
      </div>
      <div className="hof-podium-meta">
        <h3 className="hof-podium-name">{user.username}</h3>
        <p className="hof-podium-prof">{user.profession}</p>
        <div className="hof-podium-score">
          {fmt(user.score)} <span className="hof-pts">PTS</span>
        </div>
      </div>
    </div>
  );
}