import React, { useEffect, useState } from "react";
import { Input, List, Card, Spin, Empty } from "antd";
import axios from "axios";

export default function GifFeed() {
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGifs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/gifs`);

      if (Array.isArray(res.data)) {
        setGifs(res.data);
      } else {
        console.error("Invalid data:", res.data);
        setGifs([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
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

      if (Array.isArray(res.data)) {
        setGifs(res.data);
      } else {
        setGifs([]);
      }
    } catch (err) {
      console.error(err);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifs();
  }, []);

  return (
    <>
      <Input.Search onSearch={searchGif} style={{ marginBottom: 16 }} />

      {loading ? (
        <Spin />
      ) : gifs.length === 0 ? (
        <Empty description="No GIFs found" />
      ) : (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={gifs}
          renderItem={(gif) => (
            <List.Item key={gif.id}>
              <Card title={gif?.gif_name}>
                <img src={gif?.gif_url} style={{ width: "100%" }} />
              </Card>
            </List.Item>
          )}
        />
      )}
    </>
  );
}