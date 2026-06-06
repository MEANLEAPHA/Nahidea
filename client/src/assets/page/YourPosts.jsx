import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Input, Popconfirm, Tag, Empty, Spin } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined
} from "@ant-design/icons";

import "../style/page/YourPosts.css";

const token = localStorage.getItem("token");
export default function YourPosts() {

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");

  const loadMoreRef = useRef(null);

  const fetchPosts = async () => {

    if (loading || !hasMore) return;

    try {

      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/get-post-by-user?page=${page}`,
        {
          headers : {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPosts(prev => [...prev, ...res.data.data]);

      setHasMore(res.data.hasMore);

      setPage(prev => prev + 1);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {

        if (
          entry.isIntersecting &&
          hasMore &&
          !loading
        ) {
          fetchPosts();
        }
      },
      {
        threshold: 0.1
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();

  }, [loading, hasMore]);

  const handleDelete = async (postId) => {

    try {

      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/${postId}`,
        {
          withCredentials: true
        }
      );

      setPosts(prev =>
        prev.filter(post => post.id !== postId)
      );

    } catch (err) {
      console.error(err);
    }
  };

  const handleSolved = async (postId) => {

    try {

      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/${postId}/solve`,
        {},
        {
          withCredentials: true
        }
      );

      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                question_status: "solved"
              }
            : post
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="your-posts-page">

      <div className="posts-header">

        <div>
          <h1>Your Posts</h1>
          <p>
            Manage all published content
          </p>
        </div>

      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        prefix={<SearchOutlined />}
        placeholder="Search posts..."
        className="post-search"
      />

      {filteredPosts.length === 0 ? (
        <Empty description="No posts found" />
      ) : (

        <div className="posts-list">

          {filteredPosts.map(post => {

            let preview = null;

            try {

              if (post.media_url) {

                const parsed = JSON.parse(
                  post.media_url
                );

                preview = parsed?.[0];

              }

            } catch {
              preview = post.media_url;
            }

            return (

              <div
                className="post-row"
                key={post.id}
              >

                <div className="post-preview">

                  {preview ? (
                    <img
                      src={preview}
                      alt=""
                    />
                  ) : (
                    <div className="no-image">
                      No Media
                    </div>
                  )}

                </div>

                <div className="post-main">

                  <div className="post-title-row">

                    <h3>{post.title}</h3>

                    <div className="post-tags">

                      <Tag>
                        {post.post_type}
                      </Tag>

                      {post.post_type ===
                        "question" && (

                        <Tag
                          color={
                            post.question_status ===
                            "solved"
                              ? "green"
                              : "orange"
                          }
                        >
                          {post.question_status}
                        </Tag>

                      )}

                    </div>

                  </div>

                  <div className="stats-row">

                    <span>
                      <EyeOutlined />
                      {post.views_count}
                    </span>

                    <span>
                      <HeartOutlined />
                      {post.likes_count}
                    </span>

                    <span>
                      <MessageOutlined />
                      {post.comments_count}
                    </span>

                  </div>

                </div>

                <div className="post-actions">

                  {post.post_type ===
                    "content" && (
                    <button
                      className="edit-btn"
                    >
                      <EditOutlined />
                      Edit
                    </button>
                  )}

                  {post.post_type ===
                    "question" &&
                    post.question_status ===
                      "open" && (
                      <button
                        className="solve-btn"
                        onClick={() =>
                          handleSolved(post.id)
                        }
                      >
                        <CheckCircleOutlined />
                        Solved
                      </button>
                    )}

                  <Popconfirm
                    title="Delete post?"
                    onConfirm={() =>
                      handleDelete(post.id)
                    }
                  >
                    <button
                      className="delete-btn"
                    >
                      <DeleteOutlined />
                      Delete
                    </button>
                  </Popconfirm>

                </div>

              </div>

            );

          })}

        </div>

      )}

      <div ref={loadMoreRef} />

      {loading && (
        <div className="loading">
          <Spin />
        </div>
      )}

    </div>
  );
}