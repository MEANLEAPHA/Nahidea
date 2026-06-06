
import React, { useState, useEffect } from "react";
import "../style/page/History.css";
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

const token = localStorage.getItem('token');

const Favorite = () => {
  const [searchHistory, setSearchHistory] = useState('');
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentGifs, setRecentGifs] = useState([]);
  const [pagePosts, setPagePosts] = useState(1);
  const [pageGifs, setPageGifs] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMoreGifs, setHasMoreGifs] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(1);

  // Filter by search
  const filteredPosts = recentPosts.filter(u =>
    u.title?.toLowerCase().includes(searchHistory.toLowerCase())
  );
  const filteredGifs = recentGifs.filter(u =>
    u.gif_name?.toLowerCase().includes(searchHistory.toLowerCase())
  );

  // Fetch posts
  const fetchPosts = async (nextPage = 1) => {
    if (loading || !hasMorePosts) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/posts/likes?page=${nextPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.data) {
        setRecentPosts(prev => [...prev, ...json.data]);
        setPagePosts(nextPage);
        setHasMorePosts(json.data.length === 25);
      }
    } catch (err) {
      console.error("Failed to fetch liked posts", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch gifs
  const fetchGifs = async (nextPage = 1) => {
    if (loading || !hasMoreGifs) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/posts/favorites/feed?page=${nextPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.data) {
        setRecentGifs(prev => [...prev, ...json.data]);
        setPageGifs(nextPage);
        setHasMoreGifs(json.data.length === 25);
      }
    } catch (err) {
      console.error("Failed to fetch favorite gifs", err);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    if (selected === 1 && recentPosts.length === 0) {
      fetchPosts(1);
    }
    if (selected === 2 && recentGifs.length === 0) {
      fetchGifs(1);
    }
  }, [selected]);

  // scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading) {
        if (selected === 1 && hasMorePosts) {
          fetchPosts(pagePosts + 1);
        }
        if (selected === 2 && hasMoreGifs) {
          fetchGifs(pageGifs + 1);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, selected, pagePosts, pageGifs, hasMorePosts, hasMoreGifs]);

  return (
    <div className="history-page">
      <div className='history-header'>
        <h3 className='history-title'><FontAwesomeIcon icon={faBookmark} /> Favorite</h3>
        <div className='history-sub-div'>
          <p className='history-subtitle'>Your favorite posts and gifs</p>
        </div>
      </div>

      {[{id: 1, label: "Posts"}, {id: 2, label: "Gifs"}].map((opt) => (
        <button
          key={opt.id}
          onClick={() => setSelected(opt.id)}
          style={{
            backgroundColor: selected === opt.id ? "var(--back-con)" : "transparent",
            borderBottom: selected === opt.id ? "2px solid #fd7648" : "2px solid transparent",
            color: selected === opt.id ? "#fd7648" : "grey",
          }}
          className='radio-button'
        >
          {opt.label}
        </button>
      ))}

      <br/><br/>

      {selected === 1 && (
        <div className='select-result-fav'>
          <Input
            placeholder="Search Favorite Post..."
            prefix={<SearchOutlined />}
            value={searchHistory}
            onChange={(e) => setSearchHistory(e.target.value)}
            id='search-chat'
          />
          <div className='history-body'>
            {filteredPosts.map((item) => (
              <PostHistoryCard key={item.id} item={item} />
            ))}
            {loading && <p>Loading...</p>}
          </div>
        </div>
      )}

      {selected === 2 && (
        <div className='select-result-fav'>
          <Input
            placeholder="Search Favorite Gif..."
            prefix={<SearchOutlined />}
            value={searchHistory}
            onChange={(e) => setSearchHistory(e.target.value)}
            id='search-chat'
          />
          <div className='masonry'>
            {filteredGifs.map((gif) => (
              <GifHistoryCard key={gif.gif_id} gif={gif} />
            ))}
            {loading && <p>Loading...</p>}
          </div>
        </div>
      )}
    </div>
  );
};

const PostHistoryCard = ({ item }) => (
  <div className="post-history-cards">
    <div className="post-history-card-infos">
      <p id="titles">{item.title}</p>
      <p id="author-names">{item.author}</p>
    </div>
  </div>
);

const GifHistoryCard = ({ gif }) => (
  <div className="post-history-cards">
    <div className="media-holders" style={{ "--preview-url-history-post": `url(${gif.gif_url})` }}>
      <img src={gif.gif_url} alt={gif.gif_name} />
    </div>
    <div className="post-history-card-infos">
      <p id="titles">{gif.gif_name}</p>
    </div>
  </div>
);

export default Favorite;
