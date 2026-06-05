import React, { useState, useEffect } from "react";
import "../style/page/History.css";
import { Input } from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBookmark} from '@fortawesome/free-regular-svg-icons';
import { SearchOutlined, ClearOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from "axios";

const token = localStorage.getItem('token');
const Favorite = () => {
  const [searchHisory, setSearchHistory] = useState('');
  const [recentDataHis, setRecentDataHis] = useState([]);

  // Filter by search
  const filteredHistory = recentDataHis.filter(u =>
    u.title.toLowerCase().includes(searchHisory.toLowerCase())
  );

  const [searchHisoryGif, setSearchHistoryGif] = useState('');
  const [recentDataHisGif, setRecentDataHisGif] = useState([]);

  // Filter by search
  const filteredHistoryGif = recentDataHisGif.filter(u =>
    u.gif_name.toLowerCase().includes(searchHisoryGif.toLowerCase() || u.gif_label.toLowerCase().includes(searchHisoryGif.toLowerCase()))
  );
  const [selected, setSelected] = useState(1);

  // Load from localStorage on mount
  useEffect(() => {
    fetchFavoritePost();
  }, [selected === 1]);

  useEffect(() => {
    fetchFavoriteGif();
  }, [selected === 2]);

  const fetchFavoriteGif = async () => {
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/favorite/gif`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      setRecentDataHisGif(data);
    }catch(error){
      console.log(error);
    }
  }
  const fetchFavoritePost = async () => {
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/favorite`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      setRecentDataHis(data);
    }catch(error){
      console.log(error);
    }
  }

  // Delete single post
  const deletePostHistory = (postId) => {
    const postData = JSON.parse(localStorage.getItem("recentPostHis")) || [];
    const update = postData.filter((item) => item.id !== postId);
    localStorage.setItem("recentPostHis", JSON.stringify(update));
    setRecentDataHis(update);
  };



  return (
    <div className="history-page">
      <div className='history-header'>
        <h3 className='history-title'><FontAwesomeIcon icon={faBookmark} /> Favorite</h3>
        <div className='history-sub-div'>
          <p className='history-subtitle'>Your favorite posts and gifs</p>
        </div>
      </div>
<div  className='radio-button-div'>
             {[{id: 1, label: "Preview"}, {id: 2, label: "Tutorial"}, {id: 3, label: ` Rule`}].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                style={{
                  borderBottom: selected === opt.id ? "2px solid #fd7648" : "2px solid transparent",
                  color: selected === opt.id ? "#fd7648" : "grey",
                }}
                className='radio-button'
              >
                {opt.label}
              </button>
            ))}
            {
                selected === 1 && <div className='history-div-result'>
                    <Input
                      placeholder="Search Favorite Post......"
                      prefix={<SearchOutlined />}
                      value={searchHisory}
                      onChange={(e) => setSearchHistory(e.target.value)}
                      id='search-chat'
                    />

                  <div className='history-body'>
                    {filteredHistory.map((item) => (
                      <PostHistoryCard
                        key={item.id}
                        item={item}
                        deletePostHistory={deletePostHistory}
                      />
                    ))}
                  </div>
                </div>
            }
            {
                selected === 2 && <FavoritesFeed />
            }
        </div>
    
      </div>
  );
};

const PostHistoryCard = ({ item, deletePostHistory }) => {
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
        <button
          id="history-card-deletes"
          onClick={() => deletePostHistory(item.id)}
        >
          <DeleteOutlined />
        </button>
      </div>
    </div>
  );
};

export default Favorite;

 function FavoritesFeed() {
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

    let stored = JSON.parse(localStorage.getItem("favorites_gif") || "[]");

    // ✅ LocalStorage first, only for page 1
    if (stored.length > 0 && nextPage === 1) {
      setGifs(stored);
      setHasMore(false); // localStorage doesn’t paginate
      setLoading(false);
      return;
    }

    // ✅ DB fallback with pagination
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/gifs/favorites/feed?page=${nextPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newPosts = res.data.data || [];

      if (nextPage === 1) {
        setGifs(newPosts);
        // hydrate localStorage with DB results
        localStorage.setItem("favorites_gif", JSON.stringify(newPosts));
      } else {
        setGifs((prev) => [...prev, ...newPosts]);
        // append to localStorage
        const current = JSON.parse(localStorage.getItem("favorites_gif") || "[]");
        const updated = [...current, ...newPosts];
        localStorage.setItem("favorites_gif", JSON.stringify(updated));
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
    let stored = JSON.parse(localStorage.getItem("favorites_gif") || "[]");

    if (stored.some((f) => f.gif_id === gif.gif_id)) {
      // Unfavorite
      stored = stored.filter((f) => f.gif_id !== gif.gif_id);
      localStorage.setItem("favorites_gif", JSON.stringify(stored));
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/gifs/favorites/remove`,
        { gif_id: gif.gif_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGifs((prev) => prev.filter((f) => f.gif_id !== gif.gif_id));
    } else {
      // Add back
      const newFav = {
        gif_id: gif.gif_id,
        gif_name: gif.gif_name,
        gif_url: gif.gif_url,
      };
      stored.push(newFav);
      localStorage.setItem("favorites_gif", JSON.stringify(stored));
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/gifs/favorites/add`,
        { gif_id: gif.gif_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGifs((prev) => [newFav, ...prev]);
    }
  };

  return (
    <div className="gif-feed-container">
      {loading && <p>Loading...</p>}
      {!loading && gifs.length === 0 && <Empty description="No favorites yet" />}
      <div className="masonry">
        {gifs.map((gif) => (
          <div key={gif.gif_id} className="gif-card">
            <img src={gif.gif_url} alt={gif.gif_name} />
            <div className="gif-overlay">
              <span className="gif-name">{gif.gif_name}</span>
              <span className="gif-fav" onClick={() => toggleFavorite(gif)}>
                {JSON.parse(localStorage.getItem("favorites_gif") || "[]").some(
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
