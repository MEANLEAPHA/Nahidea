// import React, { useEffect, useState } from "react";
// import { Input, List, Card, Spin, Empty } from "antd";
// import axios from "axios";

// export default function GifFeed() {
//   const [gifs, setGifs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchGifs = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/gifs/getGifs`);

//       if (Array.isArray(res.data)) {
//         setGifs(res.data);
//       } else {
//         console.error("Invalid data:", res.data);
//         setGifs([]);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setGifs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const searchGif = async (value) => {
//     if (!value) return fetchGifs();

//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_SERVER_URL}/api/gifs/search?name=${value}`
//       );

//       if (Array.isArray(res.data)) {
//         setGifs(res.data);
//       } else {
//         setGifs([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setGifs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGifs();
//   }, []);

//   return (
//     <>
//       <Input.Search onSearch={searchGif} style={{ marginBottom: 16 }} />

//       {loading ? (
//         <Spin />
//       ) : gifs.length === 0 ? (
//         <Empty description="No GIFs found" />
//       ) : (
//         <List
//           grid={{ gutter: 16, column: 3 }}
//           dataSource={gifs}
//           renderItem={(gif) => (
//             <List.Item key={gif.id}>
//               <Card title={gif?.gif_name}>
//                 <img src={gif?.gif_url} style={{ width: "100%" }} />
//               </Card>
//             </List.Item>
//           )}
//         />
//       )}
//     </>
//   );
// }import React, { useEffect, useState } from "react";

import React, { useEffect, useState } from "react";
import { Input, Spin, Empty } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
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
      {/* 🔍 Search */}
      <Input.Search
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={searchGif}
        placeholder="Search GIFs..."
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
      <img src={gif.gif_url} alt={gif.gif_name} />

      <div className="gif-overlay">
        <span className="gif-name">{gif.gif_name}</span>

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