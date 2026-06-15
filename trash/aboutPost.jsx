// React State
import React, { useState, useEffect, useRef, memo } from 'react';
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

const { Text } = Typography;

const token = localStorage.getItem("token");

// const mockComments = [
//   {
//     id: 1,
//     post_id: 123,
//     parent_id: null,
//     user_id: 1,
//     content: "Thanks everyone for the feedback! Glad you found these tips helpful. 🔥",
//     gif_url: "https://media.giphy.com/media/26gR2qGFzKXgX7XIs/giphy.gif",
//     username_mention: null,
//     is_anonymous: 0,
//     anonymous_name: null,
//     anonymous_bg_color: null,
//     likes_count: 24,
//     reply_count: 2,
//     is_deleted: 0,
//     is_edited: 0,
//     created_at: "2026-06-13T10:30:00Z",
//     updated_at: "2026-06-13T10:30:00Z",
//     avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
//     display_name: "JohnDoe",
//     username: "JohnDoe",
//     is_liked: true,
//     replies: [
//       {
//         id: 101,
//         post_id: 123,
//         parent_id: 1,
//         user_id: 10,
//         content: "Great article John! When is part 2 coming?",
//         gif_url: null,
//         username_mention: "JohnDoe",
//         is_anonymous: 0,
//         anonymous_name: null,
//         anonymous_bg_color: null,
//         likes_count: 8,
//         reply_count: 0,
//         is_deleted: 0,
//         is_edited: 0,
//         created_at: "2026-06-13T10:35:00Z",
//         updated_at: "2026-06-13T10:35:00Z",
//         avatar_url: "https://randomuser.me/api/portraits/men/10.jpg",
//         display_name: "TechGuru",
//         username: "TechGuru",
//         is_liked: false
//       },
//       {
//         id: 102,
//         post_id: 123,
//         parent_id: 1,
//         user_id: 1,
//         content: "Working on it! Should be out next week. Stay tuned! 🚀",
//         gif_url: "https://media.giphy.com/media/3o7abB06u9bNzA8LC8/giphy.gif",
//         username_mention: "TechGuru",
//         is_anonymous: 0,
//         anonymous_name: null,
//         anonymous_bg_color: null,
//         likes_count: 12,
//         reply_count: 0,
//         is_deleted: 0,
//         is_edited: 0,
//         created_at: "2026-06-13T10:40:00Z",
//         updated_at: "2026-06-13T10:40:00Z",
//         avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
//         display_name: "JohnDoe",
//         username: "JohnDoe",
//         is_liked: true
//       }
//     ]
//   },
//   {
//     id: 2,
//     post_id: 123,
//     parent_id: null,
//     user_id: 12,
//     content: "The useCallback tip saved me from so many re-renders. Thanks for sharing! 🙏",
//     gif_url: "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
//     username_mention: null,
//     is_anonymous: 1,
//     anonymous_name: "🐧 Penguin",
//     anonymous_bg_color: "#4A90E2",
//     likes_count: 8,
//     reply_count: 1,
//     is_deleted: 0,
//     is_edited: 0,
//     created_at: "2026-06-13T08:00:00Z",
//     updated_at: "2026-06-13T08:00:00Z",
//     avatar_url: null,
//     display_name: "🐧 Penguin",
//     username: null,
//     is_liked: false,
//     replies: [
//       {
//         id: 103,
//         post_id: 123,
//         parent_id: 2,
//         user_id: 1,
//         content: "Glad it helped you! useCallback is definitely a game-changer when used correctly.",
//         gif_url: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
//         username_mention: null,
//         is_anonymous: 0,
//         anonymous_name: null,
//         anonymous_bg_color: null,
//         likes_count: 5,
//         reply_count: 0,
//         is_deleted: 0,
//         is_edited: 1,
//         created_at: "2026-06-13T09:00:00Z",
//         updated_at: "2026-06-13T09:05:00Z",
//         avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
//         display_name: "JohnDoe",
//         username: "JohnDoe",
//         is_liked: false
//       }
//     ]
//   },
//   {
//     id: 3,
//     post_id: 123,
//     parent_id: null,
//     user_id: 13,
//     content: "What about using SWR or React Query for data fetching optimization?",
//     gif_url: null,
//     username_mention: null,
//     is_anonymous: 0,
//     anonymous_name: null,
//     anonymous_bg_color: null,
//     likes_count: 12,
//     reply_count: 3,
//     is_deleted: 0,
//     is_edited: 0,
//     created_at: "2026-06-13T07:00:00Z",
//     updated_at: "2026-06-13T07:00:00Z",
//     avatar_url: "https://randomuser.me/api/portraits/women/4.jpg",
//     display_name: "CodeNewbie2024",
//     username: "CodeNewbie2024",
//     is_liked: true,
//     replies: [
//       {
//         id: 104,
//         post_id: 123,
//         parent_id: 3,
//         user_id: 1,
//         content: "Great question! Both are excellent. React Query is my personal favorite for automatic caching and background refetching.",
//         gif_url: "https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif",
//         username_mention: "CodeNewbie2024",
//         is_anonymous: 0,
//         anonymous_name: null,
//         anonymous_bg_color: null,
//         likes_count: 15,
//         reply_count: 0,
//         is_deleted: 0,
//         is_edited: 0,
//         created_at: "2026-06-13T08:00:00Z",
//         updated_at: "2026-06-13T08:00:00Z",
//         avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
//         display_name: "JohnDoe",
//         username: "JohnDoe",
//         is_liked: true
//       },
//       {
//         id: 105,
//         post_id: 123,
//         parent_id: 3,
//         user_id: 14,
//         content: "SWR is also great but React Query has more features IMO",
//         gif_url: null,
//         username_mention: null,
//         is_anonymous: 0,
//         anonymous_name: null,
//         anonymous_bg_color: null,
//         likes_count: 3,
//         reply_count: 0,
//         is_deleted: 0,
//         is_edited: 0,
//         created_at: "2026-06-13T09:00:00Z",
//         updated_at: "2026-06-13T09:00:00Z",
//         avatar_url: "https://randomuser.me/api/portraits/men/6.jpg",
//         display_name: "ReactMaster",
//         username: "ReactMaster",
//         is_liked: false
//       },
//       {
//         id: 106,
//         post_id: 123,
//         parent_id: 3,
//         user_id: 1,
//         content: "Agreed! TanStack Query has better dev tools too!",
//         gif_url: "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
//         username_mention: "ReactMaster",
//         is_anonymous: 0,
//         anonymous_name: null,
//         anonymous_bg_color: null,
//         likes_count: 7,
//         reply_count: 0,
//         is_deleted: 0,
//         is_edited: 1,
//         created_at: "2026-06-13T09:45:00Z",
//         updated_at: "2026-06-13T09:50:00Z",
//         avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
//         display_name: "JohnDoe",
//         username: "JohnDoe",
//         is_liked: true
//       }
//     ]
//   },
//   {
//     id: 4,
//     post_id: 123,
//     parent_id: null,
//     user_id: 15,
//     content: "Love the code examples! Very clear and easy to understand.",
//     gif_url: "https://media.giphy.com/media/l0MYt5jH6gkTWp8Gg/giphy.gif",
//     username_mention: null,
//     is_anonymous: 0,
//     anonymous_name: null,
//     anonymous_bg_color: null,
//     likes_count: 6,
//     reply_count: 0,
//     is_deleted: 0,
//     is_edited: 0,
//     created_at: "2026-06-13T06:00:00Z",
//     updated_at: "2026-06-13T06:00:00Z",
//     avatar_url: "https://randomuser.me/api/portraits/women/5.jpg",
//     display_name: "DesignLover",
//     username: "DesignLover",
//     is_liked: false,
//     replies: []
//   },
//   {
//     id: 5,
//     post_id: 123,
//     parent_id: null,
//     user_id: 1,
//     content: "For those asking about production examples, check the link in my bio! I've open-sourced a boilerplate with all these optimizations applied.",
//     gif_url: "https://media.giphy.com/media/26gR2qGFzKXgX7XIs/giphy.gif",
//     username_mention: null,
//     is_anonymous: 0,
//     anonymous_name: null,
//     anonymous_bg_color: null,
//     likes_count: 34,
//     reply_count: 2,
//     is_deleted: 0,
//     is_edited: 0,
//     created_at: "2026-06-13T05:00:00Z",
//     updated_at: "2026-06-13T05:00:00Z",
//     avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
//     display_name: "JohnDoe",
//     username: "JohnDoe",
//     is_liked: true,
//     replies: [
//       {
//         id: 107,
//         post_id: 123,
//         parent_id: 5,
//         user_id: 16,
//         content: "Just starred it! Great work on the CI/CD setup too.",
//         gif_url: "https://media.giphy.com/media/3o7abB06u9bNzA8LC8/giphy.gif",
//         username_mention: "JohnDoe",
//         is_anonymous: 0,
//         anonymous_name: null,
//         anonymous_bg_color: null,
//         likes_count: 4,
//         reply_count: 0,
//         is_deleted: 0,
//         is_edited: 0,
//         created_at: "2026-06-13T07:00:00Z",
//         updated_at: "2026-06-13T07:00:00Z",
//         avatar_url: "https://randomuser.me/api/portraits/men/7.jpg",
//         display_name: "DevOpsGuy",
//         username: "DevOpsGuy",
//         is_liked: false
//       },
//       {
//         id: 108,
//         post_id: 123,
//         parent_id: 5,
//         user_id: 1,
//         content: "Appreciate it! The GitHub Actions workflow was a pain to set up but worth it 😅",
//         gif_url: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
//         username_mention: "DevOpsGuy",
//         is_anonymous: 0,
//         anonymous_name: null,
//         anonymous_bg_color: null,
//         likes_count: 9,
//         reply_count: 0,
//         is_deleted: 0,
//         is_edited: 0,
//         created_at: "2026-06-13T08:00:00Z",
//         updated_at: "2026-06-13T08:00:00Z",
//         avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
//         display_name: "JohnDoe",
//         username: "JohnDoe",
//         is_liked: true
//       }
//     ]
//   },
//   {
//     id: 6,
//     post_id: 123,
//     parent_id: null,
//     user_id: 17,
//     content: "Any tips for optimizing Next.js apps specifically?",
//     gif_url: "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
//     username_mention: null,
//     is_anonymous: 1,
//     anonymous_name: "🌙 Night Owl",
//     anonymous_bg_color: "#6C5CE7",
//     likes_count: 3,
//     reply_count: 1,
//     is_deleted: 0,
//     is_edited: 1,
//     created_at: "2026-06-13T04:00:00Z",
//     updated_at: "2026-06-13T04:00:00Z",
//     avatar_url: null,
//     display_name: "🌙 Night Owl",
//     username: null,
//     is_liked: false,
//     replies: [
//       {
//         id: 109,
//         post_id: 123,
//         parent_id: 6,
//         user_id: 1,
//         content: "For Next.js specifically: use next/dynamic for lazy loading, Image component for optimization, and ISR for static pages.",
//         gif_url: "https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif",
//         username_mention: null,
//         is_anonymous: 0,
//         anonymous_name: null,
//         anonymous_bg_color: null,
//         likes_count: 11,
//         reply_count: 0,
//         is_deleted: 0,
//         is_edited: 1,
//         created_at: "2026-06-13T06:00:00Z",
//         updated_at: "2026-06-13T06:10:00Z",
//         avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
//         display_name: "JohnDoe",
//         username: "JohnDoe",
//         is_liked: true
//       }
//     ]
//   }
// ];


// const mockPagination = {
//   page: 1,
//   limit: 10,
//   total: 6,
//   total_pages: 1,
//   has_more: false
// };

// const mockCommentsResponse = {
//   comments: mockComments,
//   pagination: mockPagination
// };

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

// Memoized Comment Like Button Component
const CommentLikeButton = memo((({ isLiked, likesCount, onLike, isAnimating }) => {
  return (
    <button
      className={`comment-like-button ${isLiked ? "liked" : ""}`}
      type="button"
      onClick={onLike}
    >
      <motion.div
        className="action-icon-wrapper"
        whileTap={{ scale: 0.75 }}
        animate={isAnimating ? { scale: [1, 1.35, 1], rotate: [0, -15, 15, 0] } : {}}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {isLiked ? (
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
      <span>{likesCount}</span>
    </button>
  );
}), (prevProps, nextProps) => {
  return (
    prevProps.isLiked === nextProps.isLiked &&
    prevProps.likesCount === nextProps.likesCount &&
    prevProps.isAnimating === nextProps.isAnimating
  );
});

// Memoized Comment Card Component
const CommentCard = memo(({ c, isReply, postId, expandedReplies, onToggleReplies, onLikeComment, onReplyClick, highlightedId, timeAgoFn, renderNameFn, renderColorFn, renderAvatarFn, likingCommentId, onDeleteComment }) => {
  const isExpanded = expandedReplies[c.id];
  
  return (
    <div
      className={`
        comment
        ${isReply ? "reply" : ""}
        ${String(highlightedId) === String(c.id) ? "highlight-comment" : ""}
      `}
      id={c.id}
    >
      <div className="avatar" style={{ background: renderColorFn(c) }}>
        <img src={renderAvatarFn(c)} alt="avatar" className="avatar-image"/>
      </div>

      <div className="comment-body">
        <div className="comment-header">
          <div className="comment-name-wrapper">
            <b className="comment-name">{renderNameFn(c)}</b>
          </div>
          <CommentDropDown 
            ownerId={c.user_id} 
            comm_id={c.id} 
            comm_text={c.content} 
            comm_gif={c.gif_url} 
            post_id={postId}
            onDelete={() => onDeleteComment(c.id, postId)}
          />
        </div>

        <div className="comment-text">
          {c.username_mention && (
            <span style={{ color: 'skyblue' }} className='comm-mention-name'>@{c.username_mention}</span>
          )}
          <span className='comm-content'>{c.content}
            {c.is_edited === 1 && !c.is_deleted && (
              <span className="edited-badge">
                 Edited*
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
         
            {c.is_deleted === 0 && (
               <div className="comment-actions-left">
                <CommentLikeButton
                  isLiked={c.is_liked}
                  likesCount={c.likes_count}
                  onLike={(e) => {
                    e.preventDefault();
                    onLikeComment(c.id);
                  }}
                  isAnimating={likingCommentId === c.id}
                />
                <span onClick={() => onReplyClick(c)}>
                  Reply
                </span>
              </div>
            )}
          
          <div className="comment-actions-right">
            <span className="comment-time">
              {c.is_edited === 1 ? timeAgoFn(c.updated_at) : timeAgoFn(c.created_at)}
              </span>
          </div>
        </div>

        {c.replies?.length > 0 && (
          <div className="reply-section">
            <button className="reply-toggle" onClick={() => onToggleReplies(c.id)}>
              {isExpanded ? (
                <span className="hide-replies arrow-reply">
                  <FontAwesomeIcon icon={faAngleUp} /> Hide replies
                </span>
              ) : (
                <span className="show-replies arrow-reply">
                  <FontAwesomeIcon icon={faAngleDown} /> View {c.replies.length} replies
                </span>
              )}
            </button>

            {isExpanded && c.replies.map(r => (
              <CommentCard 
                key={r.id} 
                c={r} 
                isReply={true}
                postId={postId}
                expandedReplies={expandedReplies}
                onToggleReplies={onToggleReplies}
                onLikeComment={onLikeComment}
                onReplyClick={onReplyClick}
                highlightedId={highlightedId}
                timeAgoFn={timeAgoFn}
                renderNameFn={renderNameFn}
                renderColorFn={renderColorFn}
                renderAvatarFn={renderAvatarFn}
                likingCommentId={likingCommentId}
                onDeleteComment={onDeleteComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

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

  const [select, setSelect] = useState(1);
  
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

//   const fetchComments = async (pageNum = 1) => {
//   setLoadingComments(true);
  
//   // Simulate API delay
//   setTimeout(() => {
//     setComments(pageNum === 1 ? mockComments : [...comments, ...mockComments]);
//     setHasMore(false);
//     setPage(pageNum);
//     setLoadingComments(false);
//   }, 500);
// };
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

  const toggleLikeComment = async (commentId) => {
    if (likingCommentId === commentId) return;
    
    setLikingCommentId(commentId);

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
      fetchComments(1);
      console.error(err);
    } finally {
      setLikingCommentId(null);
    }
  };

  const handleReplyClick = (c) => {
    navigate("/comment", {
      state: {
        postId: id,
        comment_id: c.id,
        user_id_mention: c.user_id || null,
        username_mention: renderName(c),
        mode: "reply"
      }
    });
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
          {post?.type === "question" ? (
            <>
              <div className='radio-button-div-chat'>
                {[
                  { id: 1, label: "Anwsers" },
                  { id: 2, label: "Comments" }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    style={{
                      borderBottom: select === opt.id ? "2px solid #fd7648" : "2px solid transparent",
                      color: select === opt.id ? "#fd7648" : "grey",
                      background: select === opt.id ? "var(--back-con)" : "transparent",
                    }}
                    className='radio-button-chat'
                    disabled={loading}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {
                select === 1 && (
                  <>
                    <span id='label-com-count'>{post?.comments_count} Answer{post?.comments_count !== 1 && "s"}</span>
                    <button
                      onClick={() => navigate(`/comment`, { state: { postId: id } })}
                      className="comment-btn"
                    >
                      Answer this question
                    </button>
                    
                  </>
                )
              }
              {
                select === 2 && (
                  <>
                  <span id='label-com-count'>{post?.comments_count} Comment{post?.comments_count !== 1 && "s"}</span>
                  <button
                    onClick={() => navigate(`/comment`, { state: { postId: id } })}
                    className="comment-btn"
                  >
                    Write a comment
                  </button>

                  {comments.map(c => (
                    <CommentCard 
                      key={c.id}
                      c={c}
                      isReply={false}
                      postId={id}
                      expandedReplies={expandedReplies}
                      onToggleReplies={toggleReplies}
                      onLikeComment={toggleLikeComment}
                      onReplyClick={handleReplyClick}
                      highlightedId={highlightedId}
                      timeAgoFn={timeAgo}
                      renderNameFn={renderName}
                      renderColorFn={renderColor}
                      renderAvatarFn={renderAvatar}
                      likingCommentId={likingCommentId}
                      onDeleteComment={handleDeleteComment}
                    />
                  ))}
                
                  {comments.length === 0 && (
                    <div id='no-com-div'>
                      <FontAwesomeIcon icon={faMartiniGlassEmpty} className='no-com-p'/>
                      <p className='no-com-p'>Be the first to comment</p>
                    </div>
                  )}

                  <div ref={observerRef} style={{ height: "20px" }} />
                  </>
                )
              }
            </>
              
          )
          :
          (
            <>
              <span id='label-com-count'>{post?.comments_count} Comment{post?.comments_count !== 1 && "s"}</span>
              <button
                onClick={() => navigate(`/comment`, { state: { postId: id } })}
                className="comment-btn"
              >
                Write a comment
              </button>

              {comments.map(c => (
                <CommentCard 
                  key={c.id}
                  c={c}
                  isReply={false}
                  postId={id}
                  expandedReplies={expandedReplies}
                  onToggleReplies={toggleReplies}
                  onLikeComment={toggleLikeComment}
                  onReplyClick={handleReplyClick}
                  highlightedId={highlightedId}
                  timeAgoFn={timeAgo}
                  renderNameFn={renderName}
                  renderColorFn={renderColor}
                  renderAvatarFn={renderAvatar}
                  likingCommentId={likingCommentId}
                  onDeleteComment={handleDeleteComment}
                />
              ))}
            
              {comments.length === 0 && (
                <div id='no-com-div'>
                  <FontAwesomeIcon icon={faMartiniGlassEmpty} className='no-com-p'/>
                  <p className='no-com-p'>Be the first to comment</p>
                </div>
              )}

              <div ref={observerRef} style={{ height: "20px" }} />
            </>
          )
        }
         {/* {loadingComments && <p>Loading comments...</p>} */}
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