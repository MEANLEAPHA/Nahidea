

import React, { useEffect, useState } from "react";
import { Input, Spin, Empty } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "../style/page/GifFeed.css";

export default function GifFeed() {
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const fetchGifs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/gifs/getGifs`
      );

      setGifs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const searchGif = async (value) => {
    const navigate = useNavigate();
    setQuery(value);

    if (!value) return fetchGifs();

    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/gifs/search?name=${value}`
      );
      setGifs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    fetchGifs();
  };

  useEffect(() => {
    fetchGifs();
  }, []);

  return (
    <div className="gif-feed-container">
      <div className="gif-header"> 
         <p>Help us upload your favourite GIFs and share them with Nahidea's community</p>
         <button onClick={()=>{navigate("/upload/gif")}} type="button" className="btn-upload-gif">Upload GIF</button>
      </div>
      {/* 🔍 Search */}
      <Input.Search
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={searchGif}
        placeholder="Search GIFs on Nahidea..."
        allowClear
        onClear={handleClear}
        className="gif-search"
      />

      {/* 🔄 Loading */}
      {loading && <Spin className="center-spin" />}

      {/* ❌ Empty */}
      {!loading && gifs.length === 0 && (
        <Empty description="No GIFs found" />
      )}

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

        <span
          className="gif-fav"
          onClick={() => setFav(!fav)}
        >
          {fav ? <HeartFilled /> : <HeartOutlined />}
        </span>
      </div>
    </div>
  );
}