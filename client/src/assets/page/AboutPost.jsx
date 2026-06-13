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
import { DisplayAnimatedIcon } from "../util/upload/AnimatedIcon";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faPen, faEllipsis } from "@fortawesome/free-solid-svg-icons";

import nahIdeaAuth from "../img/nahIdeaAuth.png";
import {
  Typography,
  Space,
  Dropdown,
} from "antd";
import DotDropDown from './util/dotDropDown';
import { faAngleDown, faAngleUp, faMartiniGlassEmpty } from '@fortawesome/free-solid-svg-icons';
import { DeleteOutlined, EditOutlined, FlagOutlined, LinkOutlined } from '@ant-design/icons';
import ReportPostModal from './ReportPostModal';

const { Text } = Typography;

const token = localStorage.getItem("token");

const parseJSON = (val) => {
  try {
    return typeof val === "string" ? JSON.parse(val) : val;
  } catch {
    return [];
  }
};

// Helper: Convert timestamp to human readable
const timeAgo = (timestamp) => {
  if (!timestamp) return 'just now';
  
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now - past) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

const AboutPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useOutletContext();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [likingPosts, setLikingPosts] = useState(false);
  const [likingCommentId, setLikingCommentId] = useState(null);
  const [favoritingPosts, setFavoritingPosts] = useState(false);

  const [comments, setComments] = useState([]);
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
          fetchComments(page + 1);
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
      if (String(comment.id) === targetId) {
        found = true;
      }
      comment.replies?.forEach(reply => {
        if (String(reply.id) === targetId) {
          found = true;
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
      if (String(comment.id) === String(targetId)) return true;
      return comment.replies?.some(r => String(r.id) === String(targetId));
    });

    if (!found && hasMore) {
      fetchComments(page + 1);
    }
  }, [comments, hasMore]);

  // initial load
  useEffect(() => {
    handleFetchPost();
    handleView();
    handleHistory();
    fetchComments(1);
  }, [id]);

  // track view
  const handleView = async () => {
    if (!token) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/record-view-post/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleHistory = async () => {
    if (!token) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/history-post/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
    }
  };

  // fetch post
  const handleFetchPost = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/get-posts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data.data;
      setPost(data);
      if (data && data.is_anonymous !== 1 && data.avatar_url) {
        setUserProfilePic(data.avatar_url);
      }
    } catch (err) {
      console.error(err);
      setPost(null);
    }
  };

  // fetch comments/reply
  const fetchComments = async (pageNum = 1) => {
    if (loadingComments || !hasMore) return;

    try {
      setLoadingComments(true);
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/${id}/comments?page=${pageNum}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComments = res.data.comments;
      setComments(prev => pageNum === 1 ? newComments : [...prev, ...newComments]);
      setHasMore(res.data.pagination.has_more);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleDeleteComment = async (commentId, postId) => {
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

  // const toggleLikeComment = async (commentId) => {
  //   try {
  //     await axios.post(
  //       `${import.meta.env.VITE_SERVER_URL}/api/comments/${commentId}/like`,
  //       {},
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     setComments(prev =>
  //       prev.map(c => {
  //         if (c.id === commentId) {
  //           return {
  //             ...c,
  //             is_liked: !c.is_liked,
  //             likes_count: c.is_liked ? c.likes_count - 1 : c.likes_count + 1
  //           };
  //         }
  //         return {
  //           ...c,
  //           replies: c.replies?.map(r =>
  //             r.id === commentId
  //               ? {
  //                   ...r,
  //                   is_liked: !r.is_liked,
  //                   likes_count: r.is_liked ? r.likes_count - 1 : r.likes_count + 1
  //                 }
  //               : r
  //           )
  //         };
  //       })
  //     );
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
const toggleLikeComment = async (commentId) => {
  if (likingCommentId === commentId) return;
  
  setLikingCommentId(commentId);

  // Optimistic update - same pattern as Home component
  setComments(prevComments => {
    const updateComment = (comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          is_liked: !comment.is_liked,
          likes_count: comment.is_liked ? comment.likes_count - 1 : comment.likes_count + 1
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => updateComment(reply))
        };
      }
      return comment;
    };
    return prevComments.map(comment => updateComment(comment));
  });

  try {
    await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/comments/${commentId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    // Rollback - refetch to get correct state
    fetchComments(1);
    console.error(err);
  } finally {
    setLikingCommentId(null);
  }
};
  const renderName = (c) => {
    if (c.is_deleted === 1) return '[deleted]';
    return c.is_anonymous === 1 ? c.anonymous_name : (c.display_name || c.username);
  };

  const renderColor = (c) => {
    if (c.is_deleted === 1) return '#999';
    return c.is_anonymous === 1 ? c.anonymous_bg_color : '#999';
  };

  const renderAvatar = (c) => {
    if (c.is_deleted === 1) return null;
    if (c.is_anonymous === 1) return nahIdeaAuth;
    return c.avatar_url || userProfilePic;
  };

  const CommentCard = ({ c, isReply }) => (
    <div
      className={`
        comment
        ${isReply ? "reply" : ""}
        ${String(highlightedId) === String(c.id) ? "highlight-comment" : ""}
      `}
      id={c.id}
    >
      <div className="avatar" style={{ background: renderColor(c) }}>
        <img src={renderAvatar(c)} alt="avatar" />
      </div>

      <div className="comment-body">
        <div className="comment-header">
          <div className="comment-name-wrapper">
            <b className="comment-name">{renderName(c)}</b>
          </div>
          <CommentDropDown 
            ownerId={c.user_id} 
            comm_id={c.id} 
            comm_text={c.content} 
            comm_gif={c.gif_url} 
            post_id={id}
            onDelete={() => handleDeleteComment(c.id, id)}
          />
        </div>

        <div className="comment-text">
          {c.username_mention && (
            <span style={{ color: 'skyblue' }} className='comm-mention-name'>@{c.username_mention}</span>
          )}
          <span className='comm-content'>{c.content}
            {c.is_edited === 1 && !c.is_deleted && (
              <span className="edited-badge">
                <FontAwesomeIcon icon={faPen} /> Edited*
              </span>
            )}
          </span>
        </div>

        {c.gif_url && (
          <div className="comment-gif">
            <img src={c.gif_url} alt="gif" className="gif-com" />
          </div>
        )}

        <div className="comment-actions">
          <div className="comment-actions-left">
            {c.is_deleted === 0 && (
              <>
          <button
  className={`comment-like-button ${c.is_liked ? "liked" : ""}`}
  type="button"
  onClick={(e) => {
    e.preventDefault();
    toggleLikeComment(c.id);
  }}
>
  <motion.div
    className="action-icon-wrapper"
    whileTap={{ scale: 0.75 }}
    animate={likingCommentId === c.id ? { scale: [1, 1.35, 1], rotate: [0, -15, 15, 0] } : {}}
    transition={{ duration: 0.45, ease: "easeInOut" }}
  >
    <AnimatePresence mode="wait">
      {c.is_liked ? (
        <motion.div
          key="liked"
          initial={{ scale: 0.4, opacity: 0, rotate: -25 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.4, opacity: 0, rotate: 25 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
        >
          <Heart size={16} className="comment-like-icon liked-heart" fill="currentColor" />
        </motion.div>
      ) : (
        <motion.div
          key="unliked"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Heart size={16} className="comment-like-icon" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
  <span>{c.likes_count}</span>
</button>

                <span
                  onClick={() =>
                    navigate("/comment", {
                      state: {
                        postId: id,
                        comment_id: c.id,
                        user_id_mention: c.user_id || null,
                        username_mention: renderName(c),
                        mode: "reply"
                      }
                    })
                  }
                >
                  Reply
                </span>
              </>
            )}
          </div>
          <div className="comment-actions-right">
            <span className="comment-time">{timeAgo(c.created_at)}</span>
          </div>
        </div>

        {c.replies?.length > 0 && (
          <div className="reply-section">
            <button className="reply-toggle" onClick={() => toggleReplies(c.id)}>
              {expandedReplies[c.id] ? (
                <span className="hide-replies arrow-reply">
                  <FontAwesomeIcon icon={faAngleUp} /> Hide replies
                </span>
              ) : (
                <span className="show-replies arrow-reply">
                  <FontAwesomeIcon icon={faAngleDown} /> View {c.replies.length} replies
                </span>
              )}
            </button>

            {expandedReplies[c.id] && c.replies.map(r => (
              <CommentCard key={r.id} c={r} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (!post) {
    return (
      <div className="aboutPost">
        <h1>Post {id}</h1>
        <p>Loading...</p>
      </div>
    );
  }

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
                {post.tags && <div>{tagSplitter(post.tags)}</div>}
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
                <img src={data.media_url} className="preview-image" alt="confession" />
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
                  <Text>Range: {data.range_min} - {data.range_max}</Text>
                )}
                {data.question_type === "singlechoice" && (
                  <ul>{data.choices?.map((c, i) => <li key={i}>{c.choice_text}</li>)}</ul>
                )}
                {data.question_type === "multiplechoice" && (
                  <ul>{data.choices?.map((c, i) => <li key={i}>{c.choice_text}</li>)}</ul>
                )}
                {data.question_type === "rankingorder" && (
                  <ol>{data.items?.map((i, idx) => <li key={idx}>{i.item_text}</li>)}</ol>
                )}
                {data.question_type === "rating" && (
                  <Text>Rating icon: {data.rating_icon_id}</Text>
                )}
              </div>
            </div>
            <div className="post-thumbnail">
              <div className="preview-wrapper" style={{ "--preview-url": `url(${data.media_url})` }}>
                <img src={data.media_url} className="preview-image" alt="question" />
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setPost(previousPost);
      console.log(err);
    } finally {
      setLikingPosts(false);
    }
  };

  const handleFavorite = async (postId) => {
    if (favoritingPosts) return;
    setFavoritingPosts(true);

    const previousPost = { ...post };
    setPost({
      ...post,
      is_favorited: !post.is_favorited
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/${postId}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setPost(previousPost);
      console.log(err);
    } finally {
      setFavoritingPosts(false);
    }
  };

  return (
    <div className='home-container'>
      <article id="feed-article">
        <div className="about-posts">
          <div className='post-header'>
            <div className='post-user-profile'>
              <div id="author-pf-div" style={{ backgroundColor: post?.is_anonymous === 1 ? post.anonymous_bg_color : "" }}>
                <img src={post?.is_anonymous === 1 ? nahIdeaAuth : (post?.avatar_url || userProfilePic)} id="author-pf" alt="avatar" />
              </div>
              <div className='user-post-info'>
                <p className='post-username'>
                  {post?.username} 
                  <div className='dot'></div>
                  <div className='category-post-div'>
                    <span className="post-type-label">{post?.data?.type}</span> 
                    {post?.data?.cate_icon && (
                      <DisplayAnimatedIcon src={post?.data?.cate_icon} />
                    )}
                  </div>
                </p>
              <p className='post-at'>{post?.created_at}</p>
              </div> 
            </div>
            <DotDropDown 
              ownerId={post?.user_id} 
              post_type={post?.post_type} 
              post_id={post?.id}
              text_body={post?.data?.text_body || ""} 
              contentId={post?.data?.id || 1}
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
                  animate={likingPosts ? { scale: [1, 1.35, 1], rotate: [0, -15, 15, 0] } : {}}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  <AnimatePresence mode="wait">
                    {post?.is_liked ? (
                      <motion.div
                        key="liked"
                        initial={{ scale: 0.4, opacity: 0, rotate: -25 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.4, opacity: 0, rotate: 25 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      >
                        <Heart size={19} className="button-action-footer-icon liked-heart" fill="currentColor" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="unliked"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Heart size={19} className="button-action-footer-icon" />
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
                className={`button-action-footer button-action-footer-last favorite-button ${post?.is_favorited ? "favorited" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleFavorite(post?.id);
                }}
              >
                <motion.div
                  className="action-icon-wrapper"
                  whileTap={{ scale: 0.75 }}
                  animate={favoritingPosts ? { scale: [1, 1.25, 1], y: [0, -5, 0] } : {}}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <AnimatePresence mode="wait">
                    {post?.is_favorited ? (
                      <motion.div
                        key="favorited"
                        initial={{ scale: 0.4, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.4, opacity: 0, y: 10 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      >
                        <Bookmark size={18} className="button-action-footer-icon favorited-bookmark" fill="currentColor" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="unfavorited"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Bookmark size={18} className="button-action-footer-icon" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </button>
            </div>
          </div>
        </div>

        <div className="comment-box">
          <span id='label-com-count'>{post?.comments_count} Comment{post?.comments_count !== 1 && "s"}</span>
          <button
            onClick={() => navigate(`/comment`, { state: { postId: id } })}
            className="comment-btn"
          >
            Write a comment
          </button>

          {comments.map(c => (
            <CommentCard key={c.id} c={c} />
          ))}
          
          {comments.length === 0 && (
            <div id='no-com-div'>
              <FontAwesomeIcon icon={faMartiniGlassEmpty} className='no-com-p'/>
              <p className='no-com-p'>Be the first to comment</p>
            </div>
          )}

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

// Comment Dropdown Component
const CommentDropDown = ({ ownerId, comm_id, comm_text, comm_gif, post_id, onDelete }) => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/comments/${comm_id}/${post_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onDelete) onDelete();
      window.location.reload(); // Refresh to update comments
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${comm_id}`;
    navigator.clipboard.writeText(url);
  };

  const isOwner = Number(ownerId) === Number(user?.id);

  const menuItemsForAll = [
    {
      label: <li onClick={handleCopyLink}><LinkOutlined /> Copy link</li>,
      key: "0",
    },
    {
      label: (
        <li onClick={() => navigate('/report', { state: { commentId: comm_id } })}>
          <FlagOutlined /> Report
        </li>
      ),
      key: "1",
    },
  ];

  const menuItemsForOwner = [
    {
      label: (
        <li onClick={() => {
          navigate("/comment", {
            state: { 
              postId: post_id, 
              commentId: comm_id, 
              content: comm_text, 
              gif_url: comm_gif, 
              mode: "edit" 
            },
          });
        }}>
          <EditOutlined /> Edit
        </li>
      ),
      key: "0",
    },
    {
      label: (
        <li onClick={handleDelete}>
          <DeleteOutlined /> Delete
        </li>
      ),
      key: "1",
    },
    {
      label: <li onClick={handleCopyLink}><LinkOutlined /> Copy link</li>,
      key: "2",
    },
    {
      label: (
        <li onClick={() => navigate('/report', { state: { commentId: comm_id } })}>
          <FlagOutlined /> Report
        </li>
      ),
      key: "3",
    },
  ];

  return (
    <Dropdown
      menu={{ items: isOwner ? menuItemsForOwner : menuItemsForAll }}
      trigger={["click"]}
      classNames={{ root: "profile-dropdown" }}
    >
      <div className="comm-header-right">
        <FontAwesomeIcon icon={faEllipsis} className="icon-formore-comm" />
      </div>
    </Dropdown>
  );
};

export default AboutPost;