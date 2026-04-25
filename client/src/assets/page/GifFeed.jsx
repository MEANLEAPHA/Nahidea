// import React, { useEffect, useState } from "react";
// import { Input, List, Card, Spin } from "antd";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// export default function GifFeed() {
//   const [gifs, setGifs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const fetchGifs = async () => {
//     setLoading(true);
//     const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/gifs`);
//     setGifs(res.data);
//     setLoading(false);
//   };

//   const searchGif = async (value) => {
//     if (!value) return fetchGifs();
//     setLoading(true);
//     const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/gifs/search?name=${value}`);
//     setGifs(res.data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchGifs();
//   }, []);

//   return (
//     <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
//       <button type="button" onClick={()=>{navigate('/create/gif')}}>Create Gif</button>
//       <Input.Search
//         placeholder="Search GIF by name"
//         onSearch={searchGif}
//         enterButton
//         style={{ marginBottom: 20 }}
//       />
//       {loading ? (
//         <Spin />
//       ) : (
//         <List
//           grid={{ gutter: 16, column: 3 }}
//           dataSource={gifs}
//           renderItem={(gif) => (
//             <List.Item>
//               <Card title={gif.gif_name}>
//                 <img src={gif.gif_url} alt={gif.gif_name} style={{ width: "100%" }} />
//               </Card>
//             </List.Item>
//           )}
//         />
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Input, List, Card, Spin, Empty } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GifFeed() {
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchGifs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/gifs`);
      // Ensure we always set an array
      setGifs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch GIFs:", err);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const searchGif = async (value) => {
    if (!value) return fetchGifs();
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/gifs/search?name=${value}`
      );
      setGifs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Search failed:", err);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifs();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <button type="button" onClick={() => navigate("/create/gif")}>
        Create Gif
      </button>
      <Input.Search
        placeholder="Search GIF by name"
        onSearch={searchGif}
        enterButton
        style={{ marginBottom: 20 }}
      />
      {loading ? (
        <Spin />
      ) : gifs.length === 0 ? (
        <Empty description="No GIFs yet" />
      ) : (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={gifs}
          renderItem={(gif) => (
            <List.Item>
              <Card title={gif.gif_name}>
                <img
                  src={gif.gif_url}
                  alt={gif.gif_name}
                  style={{ width: "100%" }}
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
