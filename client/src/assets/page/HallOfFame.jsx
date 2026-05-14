import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/page/HallOfFame.css";

export default function HallOfFame() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchHof() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/hof`);
        setItems(res.data.items);
      } catch (err) {
        console.error("Failed to load Hall of Fame:", err);
      }
    }
    fetchHof();
  }, []);

  return (
    <div className="hof-container">
      <h2 className="hof-title">🏆 Hall of Fame</h2>
      <ul className="hof-list">
        {items.map(user => (
          <li key={user.userId} className="hof-item">
            <div className="hof-rank">{user.rank}</div>
            <img src={user.avatar_url} alt={user.username} className="hof-avatar" />
            <div className="hof-info">
              <span className="hof-username">{user.username}</span>
              <span className="hof-profession">{user.profession}</span>
            </div>
            <div className="hof-score">{user.score} pts</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
