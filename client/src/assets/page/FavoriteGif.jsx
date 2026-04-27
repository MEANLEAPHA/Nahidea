import React, { useEffect, useState } from "react";
import { Empty } from "antd";
import axios from "axios";
import "../style/page/GifFeed.css";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

export default function FavoritesFeed() {
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadFavorites(1);
    setPage(1);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => {
          const next = prev + 1;
          loadFavorites(next);
          return next;
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const loadFavorites = async (nextPage = 1) => {
    setLoading(true);

    // First check localStorage
    let stored = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (stored.length > 0 && nextPage === 1) {
      setGifs(stored);
      setHasMore(false); // localStorage doesn’t paginate
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/favorites/feed?&page=${nextPage}`
      );
      const newPosts = res.data.data || [];

      if (nextPage === 1) {
        setGifs(newPosts);
      } else {
        setGifs((prev) => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length === 25);
    } catch (err) {
      console.error(err);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (gif) => {
    let stored = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (stored.some((f) => f.gif_id === gif.gif_id)) {
      // Unfavorite
      stored = stored.filter((f) => f.gif_id !== gif.gif_id);
      localStorage.setItem("favorites", JSON.stringify(stored));
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/favorites/remove`, {
        gif_id: gif.gif_id,
      });
      setGifs((prev) => prev.filter((f) => f.gif_id !== gif.gif_id));
    } else {
      // Add back
      const newFav = { gif_id: gif.gif_id, gif_name: gif.gif_name, gif_url: gif.gif_url };
      stored.push(newFav);
      localStorage.setItem("favorites", JSON.stringify(stored));
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/favorites/add`, {
        gif_id: gif.gif_id,
      });
      setGifs((prev) => [newFav, ...prev]);
    }
  };

  return (
    <div className="gif-feed-container">
      <h2>Your Favorites</h2>
      {loading && <p>Loading...</p>}
      {!loading && gifs.length === 0 && <Empty description="No favorites yet" />}
      <div className="masonry">
        {gifs.map((gif) => (
          <div key={gif.gif_id} className="gif-card">
            <img src={gif.gif_url} alt={gif.gif_name} />
            <div className="gif-overlay">
              <span className="gif-name">{gif.gif_name}</span>
              <span className="gif-fav" onClick={() => toggleFavorite(gif)}>
                {JSON.parse(localStorage.getItem("favorites") || "[]").some(
                  (f) => f.gif_id === gif.gif_id
                ) ? (
                  <HeartFilled style={{ color: "red" }} />
                ) : (
                  <HeartOutlined />
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
