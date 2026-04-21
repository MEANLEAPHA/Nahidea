// import React from 'react';
// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { List, Card, Spin, Tag, Avatar, Typography, Space, Empty, Button } from "antd";
// import { ReloadOutlined } from "@ant-design/icons";

// const { Text, Title } = Typography;

// import '../style/page/Home.css';

// const parseJSON = (val) => {
//   try {
//     return typeof val === "string" ? JSON.parse(val) : val;
//   } catch {
//     return [];
//   }
// };

// export default function Home() {

//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [source, setSource] = useState("");
//   const [error, setError] = useState(null);
// const [fetching, setFetching] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//  useEffect(() => {
//   fetchPosts(1);
//   setPage(1);
// }, []);

//   useEffect(()=>{
//     const handleScroll =()=>{
//       if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading && hasMore){
//         fetchPosts(page + 1)
//       }

//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [loading, hasMore, page])

// const fetchPosts = async (nextPage = 1) => {
//   if (fetching) return; // 🔥 prevent duplicate calls

//   try {
//     setFetching(true);
//     setLoading(true);

//     const res = await axios.get(
//       `${import.meta.env.VITE_SERVER_URL}/api/all-posts?page=${nextPage}`
//     );

//     const payload = res.data;
//     const newPosts = payload.data;

//     if (!payload || !Array.isArray(newPosts)) {
//       throw new Error("Bad response");
//     }

//     if (newPosts.length < 25) {
//       setHasMore(false);
//     }

//     setPosts(prev => [...prev, ...newPosts]);
//     setSource(payload.source);

//   } catch {
//     setError("Failed to load post");
//   } finally {
//     setLoading(false);
//     setFetching(false);
//   }
// };

//   const renderPostContent = (post) => {
//     const data = post.data;

//     if (!data) return <Text type="secondary">No content</Text>;

//     switch (post.post_type) {
//       case "content":
//         return (
//           <>
//             <Title level={5}>{data.title}</Title>
//             <Text>{data.text_body}</Text>
//             <div>{parseJSON(data.media_url)}</div>
//           </>
//         );

//       case "confession":
//         return (
//           <>
//             <Title level={5}>{data.title}</Title>
//             <Text type="secondary">Confession post</Text>
//           </>
//         );

//       case "question":
//         return (
//           <>
//             <Title level={5}>{data.title}</Title>
//             <Tag color="blue">{data.question_type}</Tag>

//             {data.question_type === "closedend" && (
//               <Space direction="vertical">
//                 <Text>Yes: {data.yes_title}</Text>
//                 <Text>No: {data.no_title}</Text>
//               </Space>
//             )}

//             {data.question_type === "range" && (
//               <Text>
//                 Range: {data.range_min} - {data.range_max}
//               </Text>
//             )}

//             {data.question_type === "singlechoice" && (
//               <ul>
//                 {data.choices?.map((c, i) => (
//                   <li key={i}>{c.choice_text}</li>
//                 ))}
//               </ul>
//             )}

//             {data.question_type === "multiplechoice" && (
//               <ul>
//                 {data.choices?.map((c, i) => (
//                   <li key={i}>{c.choice_text}</li>
//                 ))}
//               </ul>
//             )}

//             {data.question_type === "rankingorder" && (
//               <ol>
//                 {data.items?.map((i, idx) => (
//                   <li key={idx}>{i.item_text}</li>
//                 ))}
//               </ol>
//             )}

//             {data.question_type === "rating" && (
//               <Text>Rating icon: {data.rating_icon_id}</Text>
//             )}
//           </>
//         );

//       default:
//         return <Text>Unknown post type</Text>;
//     }
//   };

//   return (
//     <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
//       {/* Header */}
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
//         <Title level={3} style={{ margin: 0 }}>
//           Feed
//         </Title>

//         <Space>
//           <Tag color={source === "cache" ? "green" : "orange"}>
//             {source || "loading"}
//           </Tag>

//           <Button
//             icon={<ReloadOutlined />}
//             onClick={fetchPosts}
//             loading={loading}
//           >
//             Refresh
//           </Button>
//         </Space>
//       </div>

//       {/* Content */}

//       {loading ? (
//         <div style={{ textAlign: "center", padding: 40 }}>
//           <Spin size="large" />
//         </div>
//       ) : error ? (
//         <Text type="danger">{error}</Text>
//       ) : posts.length === 0 ? (
//         <Empty description="No posts found" />
//       ) : (
//         <List
//           dataSource={posts}
//           renderItem={(post) => (
//             <List.Item key={post.id}>
//               <Card style={{ width: "100%" }}>
//                 {/* Header */}
//                 <Space style={{ marginBottom: 10 }}>
//                   <Avatar>{post.username?.[0]?.toUpperCase()}</Avatar>
//                   <Text strong>{post.username}</Text>
//                   <Tag>{post.post_type}</Tag>
//                 </Space>

//                 {/* Body */}
//                 <div>{renderPostContent(post)}</div>
//               </Card>
//             </List.Item>
//           )}
//         />
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  Card,
  Avatar,
  Typography,
  Tag,
  Space,
  Spin,
  Empty,
  Button,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // UI loader
  const [fetching, setFetching] = useState(false); // request lock
  const [source, setSource] = useState("");
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // =====================
  // INITIAL LOAD
  // =====================
  useEffect(() => {
    fetchPosts(1);
    setPage(1);
  }, []);

  // =====================
  // SCROLL LISTENER
  // =====================
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        !fetching &&
        hasMore
      ) {
        setPage((prev) => {
          const next = prev + 1;
          fetchPosts(next);
          return next;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, fetching, hasMore]);

  // =====================
  // FETCH POSTS
  // =====================
  const fetchPosts = async (nextPage = 1) => {
    if (fetching) return;

    try {
      setFetching(true);
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/all-posts?page=${nextPage}`
      );

      const payload = res.data;
      const newPosts = payload.data;

      if (!payload || !Array.isArray(newPosts)) {
        throw new Error("Bad response");
      }

      if (newPosts.length < 25) {
        setHasMore(false);
      }

      setPosts((prev) => [...prev, ...newPosts]);
      setSource(payload.source);
    } catch {
      setError("Failed to load post");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  // =====================
  // REFRESH
  // =====================
  const handleRefresh = () => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchPosts(1);
  };

  // =====================
  // RENDER CONTENT
  // =====================
  const renderPostContent = (post) => {
    const data = post.data;

    if (!data) return <Text type="secondary">No content</Text>;

    switch (post.post_type) {
      case "content":
        return (
          <>
            <Title level={5}>{data.title}</Title>
            <Text>{data.text_body}</Text>
            <div>{parseJSON(data.media_url)}</div>
          </>
        );

      case "confession":
        return (
          <>
            <Title level={5}>{data.title}</Title>
            <Text type="secondary">Confession post</Text>
          </>
        );

      case "question":
        return (
          <>
            <Title level={5}>{data.title}</Title>
            <Tag color="blue">{data.question_type}</Tag>

            {data.question_type === "closedend" && (
              <Space direction="vertical">
                <Text>Yes: {data.yes_title}</Text>
                <Text>No: {data.no_title}</Text>
              </Space>
            )}

            {data.question_type === "range" && (
              <Text>
                Range: {data.range_min} - {data.range_max}
              </Text>
            )}

            {data.question_type === "singlechoice" && (
              <ul>
                {data.choices?.map((c, i) => (
                  <li key={i}>{c.choice_text}</li>
                ))}
              </ul>
            )}

            {data.question_type === "multiplechoice" && (
              <ul>
                {data.choices?.map((c, i) => (
                  <li key={i}>{c.choice_text}</li>
                ))}
              </ul>
            )}

            {data.question_type === "rankingorder" && (
              <ol>
                {data.items?.map((i, idx) => (
                  <li key={idx}>{i.item_text}</li>
                ))}
              </ol>
            )}

            {data.question_type === "rating" && (
              <Text>Rating icon: {data.rating_icon_id}</Text>
            )}
          </>
        );

      default:
        return <Text>Unknown post type</Text>;
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Feed
        </Title>

        <Space>
          <Tag color={source === "cache" ? "green" : "orange"}>
            {source || "loading"}
          </Tag>

          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* CONTENT */}
      {error ? (
        <Text type="danger">{error}</Text>
      ) : posts.length === 0 && !loading ? (
        <Empty description="No posts found" />
      ) : (
        <>
          <List
            dataSource={posts}
            renderItem={(post) => (
              <List.Item key={post.id}>
                <Card style={{ width: "100%" }}>
                  <Space style={{ marginBottom: 10 }}>
                    <Avatar>
                      {post.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Text strong>{post.username}</Text>
                    <Tag>{post.post_type}</Tag>
                  </Space>

                  <div>{renderPostContent(post)}</div>
                </Card>
              </List.Item>
            )}
          />

          {/* BOTTOM LOADER */}
          {loading && (
            <div style={{ textAlign: "center", padding: 20 }}>
              <Spin />
            </div>
          )}
        </>
      )}
    </div>
  );
}



  // const fetchPosts = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const res = await axios.get(
  //       `${import.meta.env.VITE_SERVER_URL}/api/all-posts`
  //     );

  //     const playLoad = res.data;
  //     if(!playLoad || !Array.isArray(playLoad.data)){
  //       throw new Error("Something wrong with our Server Sorry!");
  //     }
  //     setPosts(playLoad.data || []);
  //     setSource(playLoad.source);
  //   } catch (err) {
  //     setError("Failed to load posts");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchPosts();
  // }, []);

// export default function Home(){
//     return(
//       <div id='home-container'>
//         <article id='feed-article'>


//         </article>
//         <article id='sub-article'>
//           acdsa
//             <div className='rule-absolute'>
//                 <p>Nahidea Rule</p>
//                 <p>Private Policy</p>
//                 <p>User Agreement</p>
//                 <p>Accessibility</p>
//                 <p>Nahidea. © 2026. All rights reserved </p>
//             </div>
             
//         </article>
//       </div>
//     )
// }

