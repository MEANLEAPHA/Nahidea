import React, { useEffect, useState } from "react";
import { Input, Spin, Empty } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Space } from 'antd';
import axios from "axios";
import "../style/page/GifFeed.css";

import nahideaTran from "../img/nahidea-tran.png";
import {gif_category} from "../data/post_type_data";


const items = item_list.map((cat, idx) => ({
  key: String(idx + 1),
  label: cat.label,
  onClick: () => searchCategory(cat.value, 1),
}));

export default function GifFeed() {
  const navigate = useNavigate();

  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchGifs(1);
    setPage(1);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading &&
        !fetching &&
        hasMore
      ) {
        setPage((prev) => {
          const next = prev + 1;
          if (query) {
            searchGif(query, next);
          } else if (activeCategory) {
            searchCategory(activeCategory, next);
          } else {
            fetchGifs(next);
          }
          return next;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, fetching, hasMore, query, activeCategory]);

  const fetchGifs = async (nextPage = 1) => {
    if (fetching) return;
    try {
      setFetching(true);
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/gifs/getGifs?page=${nextPage}`
      );

      const newPosts = res.data.data;
      if (!Array.isArray(newPosts)) throw new Error("Bad response");

      if (newPosts.length < 25) setHasMore(false);

      if (nextPage === 1) {
        setGifs(newPosts);
      } else {
        setGifs((prev) => [...prev, ...newPosts]);
      }
    } catch (err) {
      setError("Failed to load post");
      setGifs([]);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  const searchGif = async (value, pageNum = 1) => {
    if (pageNum === 1) setQuery(value);

    if (!value) {
      setPage(1);
      return fetchGifs(1);
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/gifs/search?name=${value}&page=${pageNum}`
      );
      const newPosts = res.data.data || [];

      if (pageNum === 1) {
        setGifs(newPosts);
      } else {
        setGifs((prev) => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length === 25);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const searchCategory = async (category, pageNum = 1) => {
    setQuery("");
    setActiveCategory(category);
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/gifs/category?category=${category}&page=${pageNum}`
      );
      const newPosts = res.data.data || [];

      if (pageNum === 1) {
        setGifs(newPosts);
      } else {
        setGifs((prev) => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length === 25);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setActiveCategory(null);
    setPage(1);
    fetchGifs(1);
  };

  const items = gif_category.map((cat, idx) => ({
    key: String(idx + 1),
    label: cat.label,
    onClick: () => searchCategory(cat.value, 1),
  }));
  return (
    <div className="gif-feed-container">
      <div className="gif-header">
        <p>Help us upload your favourite GIFs and share them with Nahidea's community</p>
        <Dropdown menu={{ items }} placement="bottom">
            <Button>Category</Button>
        </Dropdown>
        <button
          onClick={() => navigate("/upload/gif")}
          type="button"
          className="btn-upload-gif"
        >
          Upload GIF
        </button>
      </div>

      {/* 🔍 Search */}
      <Input.Search
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={(val) => searchGif(val, 1)} // always reset to page 1
        placeholder="Search GIFs on Nahidea..."
        allowClear
        onClear={handleClear}
        className="gif-search"
      />

      {/* 🔄 Loading */}
      {loading && <Loader />}

      {/* ❌ Empty */}
      {!loading && gifs.length === 0 && <Empty description="No GIFs found" />}

      {/* 🧱 Masonry */}
      <div className="masonry">
        {gifs.map((gif) => (
          <GifCard key={gif.id} gif={gif} />
        ))}
      </div>
    </div>
  );
}

/* 🔥 Card component */
function GifCard({ gif }) {
  const [fav, setFav] = useState(false);

  return (
    <div className="gif-card">
      <img src={gif.gif_url} alt={gif.gif_label} />
      <div className="gif-overlay">
        <span className="gif-name">{gif.gif_label}</span>
        <span className="gif-fav" onClick={() => setFav(!fav)}>
          {fav ? <HeartFilled /> : <HeartOutlined />}
        </span>
      </div>
    </div>
  );
}

const Loader = () => {
  return(
     <div className="loader-container">
          <img src={nahideaTran} alt="Loading..." className="loader-img"/>
    </div>
  )
};



