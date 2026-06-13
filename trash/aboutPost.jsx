// React State
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useOutletContext, useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";
// lucide
import {
  Heart,
  Bookmark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// style
import "../style/page/Aboutpost.css";
import "../style/page/Home.css";
import "../style/upload/MultipleMedia.css";
import "../style/upload/Postpreview.css";

import { MediaPreview } from "../util/mediaUploader";

// util
import MoreDropDown from "../util/upload/MoreDropDown";
import {DisplayAnimatedIcon} from "../util/upload/AnimatedIcon";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

import nahIdeaAuth from "../img/nahIdeaAuth.png";
import {
  Typography,
  Space,
} from "antd";
import DotDropDown from './util/dotDropDown';
import { faMartiniGlassEmpty } from '@fortawesome/free-solid-svg-icons';

const { Text } = Typography;

const token = localStorage.getItem("token");

const parseJSON = (val) => {
  try {
    return typeof val === "string" ? JSON.parse(val) : val;
  } catch {
    return [];
  }
};
const mockPost = {
  id: 123,
  user_id: 1,
  username: "JohnDoe",
  avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
  is_anonymous: 0, // 0 = not anonymous, 1 = anonymous
  anonymous_name: null,
  anonymous_bg_color: null,
  post_type: "content", // "content", "confession", or "question"
  likes_count: 42,
  comments_count: 7,
  views_count: 328,
  created_at: "2 hours ago",
  status: "active",
  tags: "javascript,react,coding,webdev",
  is_liked: false,
  is_favorited: false,
  data: {
    id: 123,
    // For content type
    title: "10 Tips for Better React Performance",
    type: "tutorial",
    text_body: `## React Performance Optimization Tips

### 1. Use React.memo for expensive components
\`\`\`jsx
const ExpensiveComponent = React.memo(({ data }) => {
  // component logic
});
\`\`\`

### 2. Implement virtualization for long lists
Use **react-window** or **react-virtualized** for rendering large datasets.

### 3. Avoid inline functions in render
\`\`\`jsx
// ❌ Bad
<button onClick={() => handleClick()}>Click</button>

// ✅ Good
<button onClick={handleClick}>Click</button>
\`\`\`

### 4. Lazy load components
\`\`\`jsx
const LazyComponent = React.lazy(() => import('./Component'));
\`\`\`

### 5. Use useCallback and useMemo appropriately

These are just a few tips to get started! What performance issues are you facing?`,
    media_url: JSON.stringify([
      "https://picsum.photos/id/1/800/400",
      "https://picsum.photos/id/2/800/400",
      "https://picsum.photos/id/3/800/400"
    ])
  }
};
// MOCK COMMENTS DATA
const mockComments = [
  {
    id: 1,
    user_id: 10,
    username: "TechGuru",
    avatar_url: "https://randomuser.me/api/portraits/men/5.jpg",
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    content: "Great tips! Number 2 about virtualization saved my app from crashing with 10k+ items! 🚀",
    likes_count: 15,
    is_liked: true,
    created_at: "1 hour ago",
    is_deleted: 0,
    username_mention: null,
    replies: [
      {
        id: 101,
        user_id: 11,
        username: "ReactNewbie",
        is_anonymous: 0,
        anonymous_name: null,
        anonymous_bg_color: null,
        content: "Which virtualization library do you recommend?",
        likes_count: 3,
        is_liked: false,
        created_at: "30 minutes ago",
        is_deleted: 0,
        username_mention: "TechGuru"
      },
      {
        id: 102,
        user_id: 10,
        username: "TechGuru",
        is_anonymous: 0,
        anonymous_name: null,
        anonymous_bg_color: null,
        content: "react-window is great for simple lists, react-virtualized for more complex needs!",
        likes_count: 5,
        is_liked: true,
        created_at: "15 minutes ago",
        is_deleted: 0,
        username_mention: "ReactNewbie"
      }
    ]
  },
  {
    id: 2,
    user_id: 12,
    username: null,
    is_anonymous: 1,
    anonymous_name: "🐧 Penguin",
    anonymous_bg_color: "#4A90E2",
    content: "The useCallback tip saved me from so many re-renders. Thanks for sharing! 🙏",
    likes_count: 8,
    is_liked: false,
    created_at: "2 hours ago",
    is_deleted: 0,
    username_mention: null,
    replies: []
  },
  {
    id: 3,
    user_id: 13,
    username: "CodeNewbie2024",
    avatar_url: "https://randomuser.me/api/portraits/women/4.jpg",
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    content: "What about using SWR or React Query for data fetching optimization?",
    likes_count: 12,
    is_liked: true,
    created_at: "3 hours ago",
    is_deleted: 0,
    username_mention: null,
    replies: [
      {
        id: 103,
        user_id: 1,
        username: "JohnDoe",
        is_anonymous: 0,
        anonymous_name: null,
        anonymous_bg_color: null,
        content: "Great point! React Query handles caching and background updates automatically. Definite must-have for data-heavy apps!",
        likes_count: 7,
        is_liked: false,
        created_at: "1 hour ago",
        is_deleted: 0,
        username_mention: "CodeNewbie2024"
      }
    ]
  }
];

const AboutPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useOutletContext();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [likingPosts, setLikingPosts] = useState(false);
  const [favoritingPosts, setFavoritingPosts] = useState(false);

  const [comments, setComments] = useState(mockComments);
  const [userProfilePic, setUserProfilePic] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIMICmqUJvaXbGlMPkkTZdGfR_y1ptPhg7tg&s");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  const [expandedReplies, setExpandedReplies] = useState({});

  const [highlightedId, setHighlightedId] = useState(null);

  const observerRef = useRef(null);

  const targetCommentId = useRef(null);
  const hasScrolledToHash = useRef(false);

  // use Location to get comment hash
  useEffect(() => {
    if (location.hash) {
      targetCommentId.current = location.hash.replace("#", "");
    }
  }, [location]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loadingComments
        ) {
          // fetchComments(page + 1);
        }
      },
      {
        threshold: 1
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [page, hasMore, loadingComments]);

  // Auto Open Replies + Scroll To Target
  useEffect(() => {
    if (
      !targetCommentId.current ||
      comments.length === 0 ||
      hasScrolledToHash.current
    ) return;

    const targetId = String(targetCommentId.current);

    let found = false;

    comments.forEach(comment => {
      // top-level comment
      if (String(comment.id) === targetId) {
        found = true;
      }

      // replies
      comment.replies?.forEach(reply => {
        if (String(reply.id) === targetId) {
          found = true;
          // auto expand replies
          setExpandedReplies(prev => ({
            ...prev,
            [comment.id]: true
          }));
        }
      });
    });

    if (found) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
          hasScrolledToHash.current = true;
          setHighlightedId(targetId);

          setTimeout(() => {
            setHighlightedId(null);
          }, 4000);
        }
      }, 300);
    }
  }, [comments]);

  // Advanced Deep Link Fetching
  useEffect(() => {
    if (hasScrolledToHash.current) return;
    const targetId = targetCommentId.current;

    if (!targetId || !hasMore || loadingComments) return;

    const found = comments.some(comment => {
      if (String(comment.id) === String(targetId)) {
        return true;
      }
      return comment.replies?.some(
        r => String(r.id) === String(targetId)
      );
    });

    // not found -> load next page
    if (!found && hasMore) {
      // fetchComments(page + 1);
    }
  }, [comments, hasMore]);

  // initial load
  useEffect(() => {
    handleFetchPost();
    handleView();
    handleHistory();
    // fetchComments(1);
  
  }, [id]);

  // track view
  const handleView = async () => {
    if (!token) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/record-view-post/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  const handleHistory = async () => {
    if (!token) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/history-post/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  // fetch post
  const handleFetchPost = async () => {
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/get-posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = res.data.data; // Fixed: extracted data from response
      console.log(data);
      setPost(data);
      // Set user profile pic if not anonymous
      if (data && data.is_anonymous !== 1 && data.avatar_url) {
        setUserProfilePic(data.avatar_url);
      }
    }
    catch (err) {
      console.error(err);
      setPost(null);
    }
  }

  // fetch comments/reply
  const fetchComments = async (pageNum = 1) => {
    if (loadingComments || !hasMore) return;

    try {
      setLoadingComments(true);

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/${id}/comments?page=${pageNum}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const newComments = res.data.comments;

      setComments(prev =>
        pageNum === 1
          ? newComments
          : [...prev, ...newComments]
      );

      setHasMore(res.data.pagination.has_more);
      setPage(pageNum);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  // toggle replies
  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // delete comment
  const handleDelete = async (commentId, postId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/comments/${commentId}/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments(1);
    } catch (err) {
      console.error(err);
    }
  };

  // like comment
  const toggleLike = async (commentId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(prev =>
        prev.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              is_liked: !c.is_liked,
              likes_count: c.is_liked ? c.likes_count - 1 : c.likes_count + 1
            };
          }
          return {
            ...c,
            replies: c.replies?.map(r =>
              r.id === commentId
                ? {
                  ...r,
                  is_liked: !r.is_liked,
                  likes_count: r.is_liked ? r.likes_count - 1 : r.likes_count + 1
                }
                : r
            )
          };
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  // render name
  const renderName = (c) =>
    c.is_anonymous === 1 ? c.anonymous_name : c.username;

  // render bg color for anonymous
  const renderColor = (c) =>
    c.is_anonymous === 1 ? c.anonymous_bg_color : "#999";

  // comment card
  const CommentCard = ({ c, isReply }) => (
    <div
      className={`
        comment
        ${isReply ? "reply" : ""}
        ${String(highlightedId) === String(c.id)
          ? "highlight-comment"
          : ""}
      `}
      id={c.id}
    >
      <div
        className="avatar"
        style={{ background: renderColor(c) }}
      >
        {renderName(c)?.slice(0, 2)}
      </div>

      <div className="comment-body">
        <div className="comment-header">
          <b>{renderName(c)}</b>
        </div>

        <div className="comment-text">
          <span style={{ color: 'skyblue' }}>@{c.username_mention}</span>
          {c.content}
        </div>

        <div className="comment-actions">
          {
            (c && c.is_deleted === 0) && (
              <>
                <span onClick={(e) => {
                  e.preventDefault();
                  toggleLike(c.id);
                }}>
                  ❤️ {c.likes_count}
                </span>
                <span
                  onClick={() =>
                    navigate("/comment", {
                      state: {
                        postId: id,
                        comment_id: c.id,
                        user_id_mention: c && Number(c.user_id) || null,
                        username_mention: renderName(c),
                        mode: "reply"
                      }
                    })
                  }
                >
                  Reply
                </span>
              </>
            )
          }

          {(c && String(c.user_id) === String(user?.id) && c.is_deleted === 0) && (
            <>
              <span onClick={() => {
                navigate("/comment", {
                  state: {
                    postId: id,
                    commentId: c.id,
                    content: c.content,
                    mode: "edit"
                  }
                });
              }}>Edit</span>
              <span onClick={() => handleDelete(c.id, id)}>Delete</span>
            </>
          )}

          <span
            onClick={() =>
              navigate("/report", {
                state: { commentId: c.id }
              })
            }
          >
            Report
          </span>
        </div>

        {c.replies?.length > 0 && (
          <div className="reply-section">
            <button
              className="reply-toggle"
              onClick={() => toggleReplies(c.id)}
            >
              {expandedReplies[c.id]
                ? `▲ Hide replies`
                : `▼ View ${c.replies.length} replies`}
            </button>

            {expandedReplies[c.id] &&
              c.replies.map(r => (
                <CommentCard key={r.id} c={r} isReply />
              ))
            }
          </div>
        )}
      </div>
    </div>
  );

  // if (!post) {
  //   return (
  //     <div className="aboutPost">
  //       <h1>Post {id}</h1>
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  function tagSplitter(tags = "") {
    if (!tags) return null;
    return tags
      .split(",")
      .map(t => t.trim())
      .filter(Boolean)
      .map((t, i) => (
        <span key={i} className="tag-text">#{t}</span>
      ));
  }

  const renderPostContent = (post) => {
    const data = post?.data;

    if (!data) return <Text type="secondary">No content</Text>;

    switch (post.post_type) {
      case "content":
        return (
          <>
            <div className='post-body'>
              <div className='post-caption'>
                <p>{data.title}</p>
              </div>

              <div className='post-content-type'>
                <span className='content-type'>{data.type}</span>
              </div>
              <div className='post-body-text'>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {data.text_body || ""}
                </ReactMarkdown>
              </div>
              <div className='post-tags'>
                {post.tags && (
                  <div>
                    {tagSplitter(post.tags)}
                  </div>
                )}
              </div>
            </div>

            <div className='post-thumbnail'>
              <MediaPreview files={parseJSON(data.media_url)} />
            </div>
          </>
        );

      case "confession":
        return (
          <>
            <div>
              <div className='post-caption'>
                <p>{data.title}</p>
              </div>
            </div>

            <div className="post-thumbnail">
              <div className="preview-wrapper" style={{ "--preview-url": `url(${data.media_url})` }}>
                <img
                  src={data.media_url}
                  className="preview-image"
                  alt="confession"
                />
              </div>
            </div>
          </>
        );

      case "question":
        return (
          <>
            <div>
              <div className='post-caption'>
                <p>{data.title}</p>
              </div>
              <div className="post-question-answer-preview">
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
              </div>
            </div>
            <div className="post-thumbnail">
              <div className="preview-wrapper" style={{ "--preview-url": `url(${data.media_url})` }}>
                <img
                  src={data.media_url}
                  className="preview-image"
                  alt="question"
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const handleLike = async (postId, ownerId) => {
    if (likingPosts) return;
    setLikingPosts(true);

    // optimistic update
    const previousPost = { ...post };
    setPost({
      ...post,
      is_liked: !post.is_liked,
      likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/${postId}/${ownerId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (err) {
      // rollback on fail
      setPost(previousPost);
      console.log(err);
    } finally {
      setLikingPosts(false);
    }
  }

  const handleFavorite = async (postId) => {
    if (favoritingPosts) return;
    setFavoritingPosts(true);

    // optimistic update
    const previousPost = { ...post };
    setPost({
      ...post,
      is_favorited: !post.is_favorited
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/${postId}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (err) {
      // rollback
      setPost(previousPost);
      console.log(err);
    } finally {
      setFavoritingPosts(false);
    }
  }

  return (
    <div className='home-container'>
      <article id="feed-article">
        <div className="about-posts">
          <div className='post-header'>
            <div className='post-user-profile'>
              <div id="author-pf-div" style={{backgroundColor : post?.is_anonymous === 1 ? post.anonymous_bg_color : ""}}>
                  <img src={post?.is_anonymous === 1 ? nahIdeaAuth : post?.avatar_url} id="author-pf"/>
              </div>
              <div className='user-post-info'>
                <p className='post-username'>
                  {post?.username} 
                  <div className='dot'></div>
                  <div className='category-post-div'>
                    <span className="post-type-label">{post?.data?.type}</span> 
                      {post?.data?.cate_icon && (
                        <DisplayAnimatedIcon
                          src={post?.data?.cate_icon}
                        />
                      )}
                  </div>
                </p>
                <p className='post-at'>{post?.created_at}</p>
              </div> 
            </div>
            {/* <MoreDropDown /> */}
            <DotDropDown ownerId={post?.user_id} post_type={post?.post_type} post_id={post?.id}
                         text_body={post?.data?.text_body || ""} contentId={post?.data?.id || 1}
            />
          </div>

          <div className='post-body'>
            {renderPostContent(post)}
          </div>

          <div className='post-footer'>
            <div className='post-footer-left'>
              <button
                className={`button-action-footer like-button ${post?.is_liked ? "liked" : ""}`}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleLike(post?.id, post?.user_id);
                }}
              >
                <motion.div
                  className="action-icon-wrapper"
                  whileTap={{ scale: 0.75 }}
                  animate={
                    likingPosts
                      ? {
                        scale: [1, 1.35, 1],
                        rotate: [0, -15, 15, 0]
                      }
                      : {}
                  }
                  transition={{
                    duration: 0.45,
                    ease: "easeInOut"
                  }}
                >
                  <AnimatePresence mode="wait">
                    {post?.is_liked ? (
                      <motion.div
                        key="liked"
                        initial={{
                          scale: 0.4,
                          opacity: 0,
                          rotate: -25
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          rotate: 0
                        }}
                        exit={{
                          scale: 0.4,
                          opacity: 0,
                          rotate: 25
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 22
                        }}
                      >
                        <Heart
                          size={19}
                          className="button-action-footer-icon liked-heart"
                          fill="currentColor"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="unliked"
                        initial={{
                          scale: 0.4,
                          opacity: 0
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1
                        }}
                        exit={{
                          scale: 0.4,
                          opacity: 0
                        }}
                        transition={{
                          duration: 0.2
                        }}
                      >
                        <Heart
                          size={19}
                          className="button-action-footer-icon"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <p>
                  <span>{post?.likes_count}</span>
                  <span className="count-label"> Like</span>
                </p>
              </button>
            </div>
            <div className='post-footer-right'>
              <button
                className={`button-action-footer button-action-footer-last favorite-button ${post?.is_favorited ? "favorited" : ""
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleFavorite(post?.id);
                }}
              >
                <motion.div
                  className="action-icon-wrapper"
                  whileTap={{ scale: 0.75 }}
                  animate={
                    favoritingPosts
                      ? {
                        scale: [1, 1.25, 1],
                        y: [0, -5, 0]
                      }
                      : {}
                  }
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut"
                  }}
                >
                  <AnimatePresence mode="wait">
                    {post?.is_favorited ? (
                      <motion.div
                        key="favorited"
                        initial={{
                          scale: 0.4,
                          opacity: 0,
                          y: 10
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          y: 0
                        }}
                        exit={{
                          scale: 0.4,
                          opacity: 0,
                          y: 10
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 22
                        }}
                      >
                        <Bookmark
                          size={18}
                          className="button-action-footer-icon favorited-bookmark"
                          fill="currentColor"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="unfavorited"
                        initial={{
                          scale: 0.4,
                          opacity: 0
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1
                        }}
                        exit={{
                          scale: 0.4,
                          opacity: 0
                        }}
                        transition={{
                          duration: 0.2
                        }}
                      >
                        <Bookmark
                          size={18}
                          className="button-action-footer-icon"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </button>
            </div>
          </div>
        </div>
        <div className="comment-box">
          <span id='label-com-count'>{post?.comments_count}20 Comment{post?.comments_count > 1 && "s"}</span>
          <button
            onClick={() => navigate(`/comment`, { state: { postId: id } })}
            className="comment-btn"
          >
            Write a comment
          </button>

          {comments.map(c => (
            <CommentCard key={c.id} c={c} />
          ))}
          {
            comments.length === 0 && 
            <div id='no-com-div'>
              <FontAwesomeIcon icon={faMartiniGlassEmpty} className='no-com-p'/>
              <p className='no-com-p'>Be the first to comment</p>
            </div>
          }

          <div ref={observerRef} style={{ height: "20px" }} />

          {loadingComments && <p>Loading comments...</p>}
        </div>
      </article>

      <article id='his-article'>
        <div className='rule-absolute'>
          <p>Nahidea Rule</p>
          <p>Private Policy</p>
          <p>User Agreement</p>
          <p>Accessibility</p>
          <div>
            <p>Nahidea. © 2026. All rights reserved</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default AboutPost;