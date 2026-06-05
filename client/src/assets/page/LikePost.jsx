import React, { useState, useEffect } from "react";
import "../style/page/History.css";
import { Input } from 'antd';
import { SearchOutlined, HeartOutlined } from '@ant-design/icons';

const token = localStorage.getItem('token');

const LikePost = () => {
  const [searchHistory, setSearchHistory] = useState('');
  const [recentDataHis, setRecentDataHis] = useState([]);

  // Filter by search
  const filteredHistory = recentDataHis.filter(u =>
    u.title?.toLowerCase().includes(searchHistory.toLowerCase())
  );

  // Fetch liked posts from backend
  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const res = await fetch("/api/posts/likes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.data) {
          setRecentDataHis(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch liked posts", err);
      }
    };
    fetchLikedPosts();
  }, []);

  return (
    <div className="history-page">
      <div className='history-header'>
        <h3 className='history-title'><HeartOutlined /> Like Post</h3>
        <div className='history-sub-div'>
          <p className='history-subtitle'>You have {recentDataHis.length} liked posts</p>
        </div>
      </div>

      <Input
        placeholder="Search History......"
        prefix={<SearchOutlined />}
        value={searchHistory}
        onChange={(e) => setSearchHistory(e.target.value)}
        id='search-chat'
      />

      <div className='history-body'>
        {filteredHistory.map((item) => (
          <PostHistoryCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

const PostHistoryCard = ({ item }) => {
  let safeImg = null;
  try {
    if (typeof item.mediaSrc === "string") {
      if (item.mediaSrc.trim().startsWith("[")) {
        const arr = JSON.parse(item.mediaSrc);
        if (Array.isArray(arr) && arr.length > 0) {
          safeImg = arr[0];
        }
      } else {
        safeImg = item.mediaSrc;
      }
    }
  } catch (err) {
    console.warn("Invalid mediaSrc format", err);
  }

  return (
    <div className="post-history-cards">
      {safeImg && (
        <div
          className="media-holders"
          style={{ "--preview-url-history-post": `url(${safeImg})` }}
        >
          <img src={safeImg} alt="post-media" />
        </div>
      )}
      <div className="post-history-card-infos">
        <div id="author-infos">
          <div
            id="author-pf-divs"
            style={{
              backgroundColor: item.isAnonymous === 1 ? item.anonymousBg : "",
            }}
          >
            <img
              src={
                item.isAnonymous === 1
                  ? "https://api.dicebear.com/9.x/adventurer/svg?seed=Anon"
                  : item.authurPf || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"
              }
              alt="user-profile"
              id="author-pfs"
            />
          </div>
          <p id="author-names">{item.author}</p>
        </div>
        <div id="title-divs">
          <p id="titles">{item.title}</p>
        </div>
      </div>
    </div>
  );
};

export default LikePost;
