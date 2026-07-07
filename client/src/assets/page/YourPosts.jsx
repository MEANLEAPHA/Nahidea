import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
import api from "../api/axiosInstance";
import { Input, Popconfirm, Tag, Empty, Spin } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
  FormOutlined,
  QuestionCircleOutlined,
  SoundOutlined
} from "@ant-design/icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faNewspaper, faMessage} from '@fortawesome/free-regular-svg-icons'
import "../style/page/YourPosts.css";

const token = localStorage.getItem("token");
export default function YourPosts() {

  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");

  const loadMoreRef = useRef(null);

  const fetchPosts = async () => {

    if (loading || !hasMore) return;

    try {

      setLoading(true);

      // const res = await axios.get(
      //   `${import.meta.env.VITE_SERVER_URL}/api/get-post-by-user?page=${page}`,
      //   {
      //     headers : {
      //       Authorization: `Bearer ${token}`
      //     }
      //   }
      // );
    const res = await api.get(`/api/user/${userId}/posts?page=${nextPage}`);
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


  const handleSolved = async (postId) => {

    try {

      await api.patch(
        `/api/posts/${postId}/solve`,
        {}
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

  const handleDeletePost = async (postId) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this post? This can't be undone."
    );
  if (!confirmed) return;
  try {
    await api.delete(`/api/delete-post/${postId}`);
    toast.success("Post deleted successfully");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete post");
  }
};

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="history-page" onClick={() => navigate(`/aboutpost/${item.id}`)}>

      <div className="history-header">
          <h3 className='history-title'><FontAwesomeIcon icon={faNewspaper} /> Your Posts</h3>
           <div className='history-sub-div'>
                <p className='history-subtitle'> Manage all published content</p>
           </div>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        prefix={<SearchOutlined />}
        placeholder="Search posts..."
        id="search-chat"
      />
    <br/>
    <br/>
      {filteredPosts.length === 0 ? (
        <Empty description="No posts found" />
      ) : (

        <div className="posts-list">

          {filteredPosts.map(post => {


            let safeImg = null;
            try {
                if (typeof post.media_url === "string") {
                if (post.media_url.trim().startsWith("[")) {
                    const arr = JSON.parse(post.media_url);
                    if (Array.isArray(arr) && arr.length > 0) {
                    safeImg = arr[0];
                    }
                } else {
                    safeImg = post.media_url;
                }
                }
            } catch (err) {
                console.warn("Invalid mediaSrc format", err);
            }



            let created_at = null;
            try{
               // get the time now in ms
              const getTimeNow =  Date.now();

              // find the gap from post created_at in ms
              const DiffMs = getTimeNow - new Date(post.created_at).getTime();

              const seconds = Math.floor(DiffMs/1000);
              const minutes = Math.floor(seconds/60);
              const hours = Math.floor(minutes/60);
              const days = Math.floor(hours/24);
              const weeks   = Math.floor(days / 7);
              const months  = Math.floor(days / 30); 
              const years   = Math.floor(days / 365);

              if(seconds < 60){
                created_at = `${seconds} second${seconds > 1 ? "s" : ""} ago`;
              }
              else if(minutes < 60){
                created_at = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
              }
              else if(hours < 24){
                created_at = `${hours} hour${hours > 1 ? "s" : ""} ago`;
              }
              else if(days < 7){
                created_at = `${days} day${days > 1 ? "s" : ""} ago`;
              }
              else if(weeks < 4){
                created_at = `${weeks} week${weeks > 1 ? "s" : ""} ago`;
              }
              else if(months < 12){
                created_at = `${months} month${months > 1 ? "s" : ""} ago`;
              }
              else{
                created_at = `${years} year${years > 1 ? "s" : ""} ago`;
              }
            }catch(err){
              console.warn("Invalid Time", err);
            }

            return (

              <div
                className="post-row"
                key={post.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/aboutpost/${post.id}`)} 
              >

                  {safeImg && (
                        <div
                        className="media-holders"
                        style={{ "--preview-url-history-post": `url(${safeImg})` }}
                        >
                        <img src={safeImg} alt="post-media" />
                        </div>
                    )}

                

                <div className="post-main">

                  <div className="post-title-row">

                    <h3>{post.title}</h3>

                  </div>
                  <p className="post-date">{created_at}</p>

                  <div className="stats-row">
                    <Tag style={{alignItems : "center"}}>
                      {post.post_type === "content" ? <FormOutlined /> : post.post_type === "question" ? <QuestionCircleOutlined /> : <SoundOutlined />}
                      {post.post_type}
                    </Tag>
                    <span>
                      <EyeOutlined />
                      {post.views_count}
                    </span>

                    <span>
                      <HeartOutlined />
                      {post.likes_count}
                    </span>

                    <span>
                    
                      <FontAwesomeIcon icon={faMessage} />
                      {post.comments_count}
                    </span>

                  </div>

                </div>

                <div className="post-actions">

                  {post.post_type ===
                    "content" && (
                    <button
                      className="edit-btn"
                       onClick={(e) => {
                        e.stopPropagation();
                        navigate("/edit/content", {
                          state: { postId: post.id},
                        });
                      }}
                    >
                      <EditOutlined />
                      Edit Text Body
                    </button>
                  )}

                    {post.post_type === "question" && (
                      <button
                        className={
                          post.question_status === "solved"
                            ? "solve-btn solved-btn"
                            : "solve-btn"
                        }
                        disabled={post.question_status === "solved"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (post.question_status !== "solved") {
                            handleSolved(post.id);
                          }
                        }}
                      >
                        <CheckCircleOutlined />

                        {post.question_status === "solved"
                          ? "Solved"
                          : "Mark Solved"}
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post.id);
                      }}
                    >
                      <DeleteOutlined />
                      Delete
                    </button>
                  

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