// React State
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useParams, useOutletContext, useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MutualFriend from "../util/mutualFriend";
import RecentHistory from "../util/recentHistory";
import Rule from "../util/upload/Rule";
// import Rule from './util/rule';
import axios from "axios";
// lucide
import {
  Heart,
  Bookmark,
  ArrowUp,
  ArrowDown,
  Trophy,
  BarChart3,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence, transform } from "framer-motion";
// style
import "../style/page/Aboutpost.css";
import "../style/page/Home.css";
import "../style/upload/MultipleMedia.css";
import "../style/upload/Postpreview.css";

import { MediaPreview } from "../util/mediaUploader";

// util
import { DisplayAnimatedIcon } from "../util/upload/AnimatedIcon";
import {iconOptions} from "../data/post_type_data";

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
import { BorderOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EnterOutlined, FlagOutlined, LeftOutlined, LinkOutlined } from '@ant-design/icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

const { Text } = Typography;

const token = localStorage.getItem("token");

const mockContentPost = {
  id: 123,
  user_id: 1,
  username: "JohnDoe",
  avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
  is_anonymous: 0,
  anonymous_name: null,
  anonymous_bg_color: null,
  post_type: "content",
  likes_count: 42,
  comments_count: 7,
  views_count: 328,
  created_at: "2026-06-15T10:30:00Z",
  status: "active",
  tags: "javascript,react,coding,webdev",
  is_liked: false,
  is_favorited: false,
  data: {
    id: 123,
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

// For CONFESSION type post
const mockConfessionPost = {
  id: 124,
  user_id: 2,
  username: "Anonymous Confession",
  avatar_url: null,
  is_anonymous: 1,
  anonymous_name: "🕊️ Lost Soul",
  anonymous_bg_color: "#FF6B6B",
  post_type: "confession",
  likes_count: 156,
  comments_count: 23,
  views_count: 1245,
  created_at: "2026-06-14T10:30:00Z",
  status: "active",
  tags: "confession,life,truth",
  is_liked: true,
  is_favorited: false,
  data: {
    id: 124,
    title: "I've been pretending to be happy for 2 years",
    media_url: "https://picsum.photos/id/20/800/400"
  }
};

// For QUESTION type post - CLOSEDEND
const mockQuestionPostClosedEnd = {
  id: 125,
  user_id: 1,
  username: "JohnDoe",
  avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
  is_anonymous: 0,
  anonymous_name: null,
  anonymous_bg_color: null,
  post_type: "question",
  likes_count: 89,
  comments_count: 12,
  views_count: 678,
  created_at: "2026-06-15T08:00:00Z",
  status: "active",
  tags: "poll,opinion,tech",
  is_liked: false,
  is_favorited: true,
  data: {
    id: 125,
    title: "Do you think AI will replace developers?",
    question_type: "closedend",
    yes_title: "Yes, eventually",
    no_title: "No, AI is just a tool",
    answers_count: 8,
    media_url: "https://picsum.photos/id/26/800/400"
  }
};

// For QUESTION type post - RATING
const mockQuestionPostRating = {
  id: 126,
  user_id: 3,
  username: "MovieBuff",
  avatar_url: "https://randomuser.me/api/portraits/women/1.jpg",
  is_anonymous: 0,
  anonymous_name: null,
  anonymous_bg_color: null,
  post_type: "question",
  likes_count: 234,
  comments_count: 45,
  views_count: 1890,
  created_at: "2026-06-14T10:30:00Z",
  status: "active",
  tags: "movies,rating,review",
  is_liked: false,
  is_favorited: false,
  data: {
    id: 126,
    title: "Rate the new Dune movie from 1-10",
    question_type: "rating",
    rating_icon_id: 2,
    answers_count: 15,
    media_url: "https://picsum.photos/id/15/800/400"
  }
};

// For QUESTION type post - SINGLECHOICE
const mockQuestionPostSingleChoice = {
  id: 127,
  user_id: 4,
  username: "TechEnthusiast",
  avatar_url: "https://randomuser.me/api/portraits/men/2.jpg",
  is_anonymous: 0,
  anonymous_name: null,
  anonymous_bg_color: null,
  post_type: "question",
  likes_count: 56,
  comments_count: 8,
  views_count: 345,
  created_at: "2026-06-13T10:30:00Z",
  status: "active",
  tags: "poll,opinion,tech",
  is_liked: true,
  is_favorited: false,
  data: {
    id: 127,
    title: "Which JavaScript framework do you prefer?",
    question_type: "singlechoice",
    choice: [
      { id: 1, choice_text: "React ⚛️" },
      { id: 2, choice_text: "Vue.js 💚" },
      { id: 3, choice_text: "Angular 🔴" },
      { id: 4, choice_text: "Svelte 🟠" }
    ],
    answers_count: 12,
    media_url: "https://picsum.photos/id/104/800/400"
  }
};

// For QUESTION type post - MULTIPLECHOICE
const mockQuestionPostMultipleChoice = {
  id: 128,
  user_id: 5,
  username: "FoodieMaster",
  avatar_url: "https://randomuser.me/api/portraits/women/2.jpg",
  is_anonymous: 0,
  anonymous_name: null,
  anonymous_bg_color: null,
  post_type: "question",
  likes_count: 78,
  comments_count: 34,
  views_count: 567,
  created_at: "2026-06-12T10:30:00Z",
  status: "active",
  tags: "food,pizza,survey",
  is_liked: false,
  is_favorited: false,
  data: {
    id: 128,
    title: "What toppings do you want on your pizza?",
    question_type: "multiplechoice",
    choices: [
      { id: 1, choices_text: "Pepperoni 🍕" },
      { id: 2, choices_text: "Mushrooms 🍄" },
      { id: 3, choices_text: "Bell Peppers 🫑" },
      { id: 4, choices_text: "Olives 🫒" },
      { id: 5, choices_text: "Extra Cheese 🧀" }
    ],
    answers_count: 10,
    media_url: "https://picsum.photos/id/108/800/400"
  }
};

// For QUESTION type post - RANKINGORDER
const mockQuestionPostRanking = {
  id: 129,
  user_id: 6,
  username: "GameReviewer",
  avatar_url: "https://randomuser.me/api/portraits/men/3.jpg",
  is_anonymous: 0,
  anonymous_name: null,
  anonymous_bg_color: null,
  post_type: "question",
  likes_count: 145,
  comments_count: 28,
  views_count: 890,
  created_at: "2026-06-11T10:30:00Z",
  status: "active",
  tags: "gaming,ranking,best",
  is_liked: false,
  is_favorited: true,
  data: {
    id: 129,
    title: "Rank the best games of 2024",
    question_type: "rankingorder",
    items: [
      { id: 1, item_text: "Elden Ring" },
      { id: 2, item_text: "Black Myth: Wukong" },
      { id: 3, item_text: "Final Fantasy VII Rebirth" },
      { id: 4, item_text: "Helldivers 2" },
      { id: 5, item_text: "Dragon's Dogma 2" }
    ],
    answers_count: 7,
    media_url: "https://picsum.photos/id/104/800/400"
  }
};

// For QUESTION type post - RANGE
const mockQuestionPostRange = {
  id: 130,
  user_id: 7,
  username: "HealthCoach",
  avatar_url: "https://randomuser.me/api/portraits/women/3.jpg",
  is_anonymous: 0,
  anonymous_name: null,
  anonymous_bg_color: null,
  post_type: "question",
  likes_count: 34,
  comments_count: 8,
  views_count: 234,
  created_at: "2026-06-10T10:30:00Z",
  status: "active",
  tags: "health,fitness,wellness",
  is_liked: false,
  is_favorited: false,
  data: {
    id: 130,
    title: "How many hours do you sleep per night?",
    question_type: "range",
    range_min: 0,
    range_max: 12,
    step: 0.5,
    default_range_value: 7,
    answers_count: 9,
    media_url: "https://picsum.photos/id/29/800/400"
  }
};

// ================================
// 2. MOCK ANSWERS DATA (All Question Types)
// ================================

// ClosedEnd Answers
const mockClosedEndAnswers = [
  {
    id: 1,
    question_id: 125,
    user_id: 8,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 125,
    question_type: "closedend",
    text_answer: null,
    yes_no: "yes",
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T09:00:00Z",
    updated_at: "2026-06-15T09:00:00Z",
    author_name: "TechGuru",
    author_avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    author_bg_color: null,
    upvotes: 12,
    downvotes: 1,
    vote_score: 11,
    user_vote_type: "upvote"
  },
  {
    id: 2,
    question_id: 125,
    user_id: 10,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 125,
    question_type: "closedend",
    text_answer: null,
    yes_no: "yes",
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T08:30:00Z",
    updated_at: "2026-06-15T08:30:00Z",
    author_name: "SarahDev",
    author_avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    author_bg_color: null,
    upvotes: 8,
    downvotes: 0,
    vote_score: 8,
    user_vote_type: null
  },
  {
    id: 3,
    question_id: 125,
    user_id: 12,
    is_anonymous: 1,
    anonymous_name: "🌙 NightOwl",
    anonymous_bg_color: "#6C5CE7",
    post_id: 125,
    question_type: "closedend",
    text_answer: null,
    yes_no: "no",
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-14T22:00:00Z",
    updated_at: "2026-06-14T22:00:00Z",
    author_name: "🌙 NightOwl",
    author_avatar: null,
    author_bg_color: "#6C5CE7",
    upvotes: 5,
    downvotes: 3,
    vote_score: 2,
    user_vote_type: "downvote"
  },
  {
    id: 4,
    question_id: 125,
    user_id: 14,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 125,
    question_type: "closedend",
    text_answer: null,
    yes_no: "yes",
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-14T20:00:00Z",
    updated_at: "2026-06-14T20:00:00Z",
    author_name: "CodeMaster",
    author_avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    author_bg_color: null,
    upvotes: 6,
    downvotes: 0,
    vote_score: 6,
    user_vote_type: null
  },
  {
    id: 5,
    question_id: 125,
    user_id: 15,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 125,
    question_type: "closedend",
    text_answer: null,
    yes_no: "no",
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-14T18:00:00Z",
    updated_at: "2026-06-14T18:00:00Z",
    author_name: "AI_Skeptic",
    author_avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    author_bg_color: null,
    upvotes: 3,
    downvotes: 0,
    vote_score: 3,
    user_vote_type: null
  },
  {
    id: 6,
    question_id: 125,
    user_id: 16,
    is_anonymous: 1,
    anonymous_name: "🐱 CatLover",
    anonymous_bg_color: "#FF6B6B",
    post_id: 125,
    question_type: "closedend",
    text_answer: null,
    yes_no: "yes",
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-14T16:00:00Z",
    updated_at: "2026-06-14T16:00:00Z",
    author_name: "🐱 CatLover",
    author_avatar: null,
    author_bg_color: "#FF6B6B",
    upvotes: 4,
    downvotes: 1,
    vote_score: 3,
    user_vote_type: null
  }
];

// Rating Answers
const mockRatingAnswers = [
  {
    id: 7,
    question_id: 126,
    user_id: 8,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 126,
    question_type: "rating",
    text_answer: null,
    yes_no: null,
    rating_value: 5,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T11:00:00Z",
    updated_at: "2026-06-15T11:00:00Z",
    author_name: "MovieBuff",
    author_avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    author_bg_color: null,
    upvotes: 20,
    downvotes: 0,
    vote_score: 20,
    user_vote_type: "upvote"
  },
  {
    id: 8,
    question_id: 126,
    user_id: 10,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 126,
    question_type: "rating",
    text_answer: null,
    yes_no: null,
    rating_value: 4,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T10:30:00Z",
    updated_at: "2026-06-15T10:30:00Z",
    author_name: "FilmCritic",
    author_avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    author_bg_color: null,
    upvotes: 15,
    downvotes: 1,
    vote_score: 14,
    user_vote_type: null
  },
  {
    id: 9,
    question_id: 126,
    user_id: 12,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 126,
    question_type: "rating",
    text_answer: null,
    yes_no: null,
    rating_value: 3,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T10:00:00Z",
    updated_at: "2026-06-15T10:00:00Z",
    author_name: "CasualViewer",
    author_avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    author_bg_color: null,
    upvotes: 8,
    downvotes: 2,
    vote_score: 6,
    user_vote_type: null
  },
  {
    id: 10,
    question_id: 126,
    user_id: 14,
    is_anonymous: 1,
    anonymous_name: "🎬 Cinephile",
    anonymous_bg_color: "#4A90E2",
    post_id: 126,
    question_type: "rating",
    text_answer: null,
    yes_no: null,
    rating_value: 5,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T09:30:00Z",
    updated_at: "2026-06-15T09:30:00Z",
    author_name: "🎬 Cinephile",
    author_avatar: null,
    author_bg_color: "#4A90E2",
    upvotes: 12,
    downvotes: 0,
    vote_score: 12,
    user_vote_type: null
  },
  {
    id: 11,
    question_id: 126,
    user_id: 15,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 126,
    question_type: "rating",
    text_answer: null,
    yes_no: null,
    rating_value: 1,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-14T23:00:00Z",
    updated_at: "2026-06-14T23:00:00Z",
    author_name: "HarshCritic",
    author_avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    author_bg_color: null,
    upvotes: 3,
    downvotes: 5,
    vote_score: -2,
    user_vote_type: "downvote"
  }
];

// SingleChoice Answers
const mockSingleChoiceAnswers = [
  {
    id: 12,
    question_id: 127,
    user_id: 8,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 127,
    question_type: "singlechoice",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: 1,
    singlechoice_option_value: "React ⚛️",
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T09:00:00Z",
    updated_at: "2026-06-15T09:00:00Z",
    author_name: "ReactDev",
    author_avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    author_bg_color: null,
    upvotes: 25,
    downvotes: 2,
    vote_score: 23,
    user_vote_type: "upvote"
  },
  {
    id: 13,
    question_id: 127,
    user_id: 10,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 127,
    question_type: "singlechoice",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: 2,
    singlechoice_option_value: "Vue.js 💚",
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T08:30:00Z",
    updated_at: "2026-06-15T08:30:00Z",
    author_name: "VueLover",
    author_avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    author_bg_color: null,
    upvotes: 10,
    downvotes: 3,
    vote_score: 7,
    user_vote_type: "downvote"
  },
  {
    id: 14,
    question_id: 127,
    user_id: 12,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 127,
    question_type: "singlechoice",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: 1,
    singlechoice_option_value: "React ⚛️",
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T08:00:00Z",
    updated_at: "2026-06-15T08:00:00Z",
    author_name: "FrontendGuru",
    author_avatar: "https://randomuser.me/api/portraits/men/9.jpg",
    author_bg_color: null,
    upvotes: 8,
    downvotes: 0,
    vote_score: 8,
    user_vote_type: null
  },
  {
    id: 15,
    question_id: 127,
    user_id: 14,
    is_anonymous: 1,
    anonymous_name: "🦊 CodeFox",
    anonymous_bg_color: "#FF6B35",
    post_id: 127,
    question_type: "singlechoice",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: 4,
    singlechoice_option_value: "Svelte 🟠",
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-14T22:00:00Z",
    updated_at: "2026-06-14T22:00:00Z",
    author_name: "🦊 CodeFox",
    author_avatar: null,
    author_bg_color: "#FF6B35",
    upvotes: 6,
    downvotes: 1,
    vote_score: 5,
    user_vote_type: null
  },
  {
    id: 16,
    question_id: 127,
    user_id: 15,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 127,
    question_type: "singlechoice",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: 3,
    singlechoice_option_value: "Angular 🔴",
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-14T20:00:00Z",
    updated_at: "2026-06-14T20:00:00Z",
    author_name: "AngularFan",
    author_avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    author_bg_color: null,
    upvotes: 4,
    downvotes: 2,
    vote_score: 2,
    user_vote_type: null
  }
];

// MultipleChoice Answers
const mockMultipleChoiceAnswers = [
  {
    id: 17,
    question_id: 128,
    user_id: 8,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 128,
    question_type: "multiplechoice",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: "[1,2,3,5]",
    multiplechoice_option_value: '["Pepperoni 🍕", "Mushrooms 🍄", "Bell Peppers 🫑", "Extra Cheese 🧀"]',
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T12:00:00Z",
    updated_at: "2026-06-15T12:00:00Z",
    author_name: "PizzaLover",
    author_avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    author_bg_color: null,
    upvotes: 30,
    downvotes: 1,
    vote_score: 29,
    user_vote_type: "upvote"
  },
  {
    id: 18,
    question_id: 128,
    user_id: 10,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 128,
    question_type: "multiplechoice",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: "[1,4]",
    multiplechoice_option_value: '["Pepperoni 🍕", "Olives 🫒"]',
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T11:30:00Z",
    updated_at: "2026-06-15T11:30:00Z",
    author_name: "OliveFan",
    author_avatar: "https://randomuser.me/api/portraits/women/9.jpg",
    author_bg_color: null,
    upvotes: 12,
    downvotes: 4,
    vote_score: 8,
    user_vote_type: null
  },
  {
    id: 19,
    question_id: 128,
    user_id: 12,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 128,
    question_type: "multiplechoice",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: "[2,3,4]",
    multiplechoice_option_value: '["Mushrooms 🍄", "Bell Peppers 🫑", "Olives 🫒"]',
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T11:00:00Z",
    updated_at: "2026-06-15T11:00:00Z",
    author_name: "VeggieLover",
    author_avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    author_bg_color: null,
    upvotes: 10,
    downvotes: 2,
    vote_score: 8,
    user_vote_type: null
  },
  {
    id: 20,
    question_id: 128,
    user_id: 14,
    is_anonymous: 1,
    anonymous_name: "🍕 PizzaAddict",
    anonymous_bg_color: "#E74C3C",
    post_id: 128,
    question_type: "multiplechoice",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: "[1,2,3,4,5]",
    multiplechoice_option_value: '["Pepperoni 🍕", "Mushrooms 🍄", "Bell Peppers 🫑", "Olives 🫒", "Extra Cheese 🧀"]',
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-14T23:00:00Z",
    updated_at: "2026-06-14T23:00:00Z",
    author_name: "🍕 PizzaAddict",
    author_avatar: null,
    author_bg_color: "#E74C3C",
    upvotes: 8,
    downvotes: 0,
    vote_score: 8,
    user_vote_type: null
  }
];

// RankingOrder Answers
const mockRankingAnswers = [
  {
    id: 21,
    question_id: 129,
    user_id: 8,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 129,
    question_type: "rankingorder",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: "[5,2,3,4,1]",
    ranking_position_value: '["Elden Ring", "Black Myth: Wukong", "Final Fantasy VII Rebirth", "Helldivers 2", "Dragon\'s Dogma 2"]',
    range_value: null,
    created_at: "2026-06-15T14:00:00Z",
    updated_at: "2026-06-15T14:00:00Z",
    author_name: "GameMaster",
    author_avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    author_bg_color: null,
    upvotes: 18,
    downvotes: 2,
    vote_score: 16,
    user_vote_type: "upvote"
  },
  {
    id: 22,
    question_id: 129,
    user_id: 10,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 129,
    question_type: "rankingorder",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: "[3,4,2,5,1]",
    ranking_position_value: '["Final Fantasy VII Rebirth", "Elden Ring", "Black Myth: Wukong", "Dragon\'s Dogma 2", "Helldivers 2"]',
    range_value: null,
    created_at: "2026-06-15T13:00:00Z",
    updated_at: "2026-06-15T13:00:00Z",
    author_name: "RPG_Fan",
    author_avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    author_bg_color: null,
    upvotes: 12,
    downvotes: 1,
    vote_score: 11,
    user_vote_type: null
  },
  {
    id: 23,
    question_id: 129,
    user_id: 12,
    is_anonymous: 1,
    anonymous_name: "🎮 Gamer",
    anonymous_bg_color: "#2ECC71",
    post_id: 129,
    question_type: "rankingorder",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: "[5,4,1,3,1]",
    ranking_position_value: '["Black Myth: Wukong", "Helldivers 2", "Elden Ring", "Final Fantasy VII Rebirth", "Dragon\'s Dogma 2"]',
    range_value: null,
    created_at: "2026-06-14T20:00:00Z",
    updated_at: "2026-06-14T20:00:00Z",
    author_name: "🎮 Gamer",
    author_avatar: null,
    author_bg_color: "#2ECC71",
    upvotes: 8,
    downvotes: 3,
    vote_score: 5,
    user_vote_type: null
  }
];

// Range Answers
const mockRangeAnswers = [
  {
    id: 24,
    question_id: 130,
    user_id: 8,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 130,
    question_type: "range",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: 8,
    created_at: "2026-06-15T13:00:00Z",
    updated_at: "2026-06-15T13:00:00Z",
    author_name: "SleepExpert",
    author_avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    author_bg_color: null,
    upvotes: 22,
    downvotes: 0,
    vote_score: 22,
    user_vote_type: "upvote"
  },
  {
    id: 25,
    question_id: 130,
    user_id: 10,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 130,
    question_type: "range",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: 6,
    created_at: "2026-06-15T12:30:00Z",
    updated_at: "2026-06-15T12:30:00Z",
    author_name: "Insomniac",
    author_avatar: "https://randomuser.me/api/portraits/men/13.jpg",
    author_bg_color: null,
    upvotes: 10,
    downvotes: 1,
    vote_score: 9,
    user_vote_type: null
  },
  {
    id: 26,
    question_id: 130,
    user_id: 12,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 130,
    question_type: "range",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: 7,
    created_at: "2026-06-15T12:00:00Z",
    updated_at: "2026-06-15T12:00:00Z",
    author_name: "AverageSleeper",
    author_avatar: "https://randomuser.me/api/portraits/women/13.jpg",
    author_bg_color: null,
    upvotes: 8,
    downvotes: 0,
    vote_score: 8,
    user_vote_type: null
  },
  {
    id: 27,
    question_id: 130,
    user_id: 14,
    is_anonymous: 1,
    anonymous_name: "🌙 NightOwl",
    anonymous_bg_color: "#6C5CE7",
    post_id: 130,
    question_type: "range",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: 5,
    created_at: "2026-06-14T23:00:00Z",
    updated_at: "2026-06-14T23:00:00Z",
    author_name: "🌙 NightOwl",
    author_avatar: null,
    author_bg_color: "#6C5CE7",
    upvotes: 6,
    downvotes: 2,
    vote_score: 4,
    user_vote_type: "downvote"
  },
  {
    id: 28,
    question_id: 130,
    user_id: 15,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 130,
    question_type: "range",
    text_answer: null,
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: 9,
    created_at: "2026-06-14T22:00:00Z",
    updated_at: "2026-06-14T22:00:00Z",
    author_name: "OverSleeper",
    author_avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    author_bg_color: null,
    upvotes: 4,
    downvotes: 0,
    vote_score: 4,
    user_vote_type: null
  }
];

// OpenEnd Answers
const mockOpenEndAnswers = [
  {
    id: 29,
    question_id: 131,
    user_id: 8,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 131,
    question_type: "openend",
    text_answer: "React Query is the best choice for data fetching. It handles caching, background updates, and pagination automatically. I've been using it for 2 years and it's a game changer!",
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T10:30:00Z",
    updated_at: "2026-06-15T10:30:00Z",
    author_name: "TechMaster",
    author_avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    author_bg_color: null,
    upvotes: 24,
    downvotes: 3,
    vote_score: 21,
    user_vote_type: "upvote"
  },
  {
    id: 30,
    question_id: 131,
    user_id: 10,
    is_anonymous: 1,
    anonymous_name: "🦊 CodeFox",
    anonymous_bg_color: "#FF6B35",
    post_id: 131,
    question_type: "openend",
    text_answer: "SWR is simpler to set up and has great DevTools. It's perfect if you're using Next.js or just want something lightweight.",
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-15T09:00:00Z",
    updated_at: "2026-06-15T09:00:00Z",
    author_name: "🦊 CodeFox",
    author_avatar: null,
    author_bg_color: "#FF6B35",
    upvotes: 15,
    downvotes: 2,
    vote_score: 13,
    user_vote_type: null
  },
  {
    id: 31,
    question_id: 131,
    user_id: 12,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    post_id: 131,
    question_type: "openend",
    text_answer: "For enterprise apps with complex state, Redux Toolkit is still king. It's battle-tested and has the best ecosystem.",
    yes_no: null,
    rating_value: null,
    singlechoice_option_id: null,
    singlechoice_option_value: null,
    multiplechoice_option_ids: null,
    multiplechoice_option_value: null,
    ranking_positions: null,
    ranking_position_value: null,
    range_value: null,
    created_at: "2026-06-14T18:00:00Z",
    updated_at: "2026-06-14T18:00:00Z",
    author_name: "EnterpriseDev",
    author_avatar: "https://randomuser.me/api/portraits/men/16.jpg",
    author_bg_color: null,
    upvotes: 8,
    downvotes: 1,
    vote_score: 7,
    user_vote_type: "downvote"
  }
];

// ================================
// 3. MOCK COMMENTS DATA
// ================================

const mockComments = [
  {
    id: 1,
    post_id: 125,
    parent_id: null,
    user_id: 1,
    content: "Great question! I think AI will definitely change how we work.",
    gif_url: null,
    username_mention: null,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    likes_count: 12,
    reply_count: 2,
    is_deleted: 0,
    is_edited: 0,
    created_at: "2026-06-15T10:30:00Z",
    updated_at: "2026-06-15T10:30:00Z",
    avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
    display_name: "JohnDoe",
    username: "JohnDoe",
    is_liked: true,
    replies: [
      {
        id: 101,
        post_id: 125,
        parent_id: 1,
        user_id: 8,
        content: "True! But it will create new jobs too.",
        gif_url: null,
        username_mention: "JohnDoe",
        is_anonymous: 0,
        anonymous_name: null,
        anonymous_bg_color: null,
        likes_count: 5,
        reply_count: 0,
        is_deleted: 0,
        is_edited: 0,
        created_at: "2026-06-15T11:00:00Z",
        updated_at: "2026-06-15T11:00:00Z",
        avatar_url: "https://randomuser.me/api/portraits/men/4.jpg",
        display_name: "TechGuru",
        username: "TechGuru",
        is_liked: false
      },
      {
        id: 102,
        post_id: 125,
        parent_id: 1,
        user_id: 10,
        content: "I agree with both of you!",
        gif_url: "https://media.giphy.com/media/26gR2qGFzKXgX7XIs/giphy.gif",
        username_mention: null,
        is_anonymous: 0,
        anonymous_name: null,
        anonymous_bg_color: null,
        likes_count: 3,
        reply_count: 0,
        is_deleted: 0,
        is_edited: 1,
        created_at: "2026-06-15T11:30:00Z",
        updated_at: "2026-06-15T11:35:00Z",
        avatar_url: "https://randomuser.me/api/portraits/women/4.jpg",
        display_name: "SarahDev",
        username: "SarahDev",
        is_liked: false
      }
    ]
  },
  {
    id: 2,
    post_id: 125,
    parent_id: null,
    user_id: 12,
    content: "AI is just a tool. It won't replace creativity.",
    gif_url: null,
    username_mention: null,
    is_anonymous: 1,
    anonymous_name: "🌙 NightOwl",
    anonymous_bg_color: "#6C5CE7",
    likes_count: 8,
    reply_count: 1,
    is_deleted: 0,
    is_edited: 0,
    created_at: "2026-06-14T22:00:00Z",
    updated_at: "2026-06-14T22:00:00Z",
    avatar_url: null,
    display_name: "🌙 NightOwl",
    username: null,
    is_liked: false,
    replies: [
      {
        id: 103,
        post_id: 125,
        parent_id: 2,
        user_id: 14,
        content: "Creativity is the one thing AI can't replicate!",
        gif_url: null,
        username_mention: null,
        is_anonymous: 0,
        anonymous_name: null,
        anonymous_bg_color: null,
        likes_count: 7,
        reply_count: 0,
        is_deleted: 0,
        is_edited: 0,
        created_at: "2026-06-15T08:00:00Z",
        updated_at: "2026-06-15T08:00:00Z",
        avatar_url: "https://randomuser.me/api/portraits/men/5.jpg",
        display_name: "CodeMaster",
        username: "CodeMaster",
        is_liked: true
      }
    ]
  },
  {
    id: 3,
    post_id: 125,
    parent_id: null,
    user_id: 15,
    content: "I've seen AI write better code than some juniors! 😂",
    gif_url: "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
    username_mention: null,
    is_anonymous: 0,
    anonymous_name: null,
    anonymous_bg_color: null,
    likes_count: 15,
    reply_count: 0,
    is_deleted: 0,
    is_edited: 0,
    created_at: "2026-06-14T20:00:00Z",
    updated_at: "2026-06-14T20:00:00Z",
    avatar_url: "https://randomuser.me/api/portraits/women/5.jpg",
    display_name: "AI_Skeptic",
    username: "AI_Skeptic",
    is_liked: false,
    replies: []
  }
];

// ================================
// 4. CALCULATED AVERAGE DATA (Based on mockAnswers)
// ================================

// ClosedEnd Average
const mockClosedEndAverage = {
  type: "closedend",
  yes: {
    count: 4,
    percentage: 67
  },
  no: {
    count: 2,
    percentage: 33
  },
  total: 6
};

// Rating Average
const mockRatingAverage = {
  type: "rating",
  average: 3.8,
  total: 5,
  distribution: [
    { value: 2, count: 1, percentage: 20 },
    { value: 3, count: 1, percentage: 20 },
    { value: 4, count: 1, percentage: 20 },
    { value: 5, count: 2, percentage: 40 }
  ]
};

// SingleChoice Average
const mockSingleChoiceAverage = {
  type: "singlechoice",
  total: 5,
  choices: [
    { label: "React ⚛️", count: 2, percentage: 40 },
    { label: "Vue.js 💚", count: 1, percentage: 20 },
    { label: "Svelte 🟠", count: 1, percentage: 20 },
    { label: "Angular 🔴", count: 1, percentage: 20 }
  ]
};

// MultipleChoice Average
const mockMultipleChoiceAverage = {
  type: "multiplechoice",
  total: 4,
  choices: [
    { label: "Pepperoni 🍕", count: 3, percentage: 75 },
    { label: "Mushrooms 🍄", count: 2, percentage: 50 },
    { label: "Bell Peppers 🫑", count: 2, percentage: 50 },
    { label: "Olives 🫒", count: 2, percentage: 50 },
    { label: "Extra Cheese 🧀", count: 2, percentage: 50 }
  ]
};

// RankingOrder Average
const mockRankingAverage = {
  type: "rankingorder",
  total: 3,
  items: [
    { label: "Elden Ring", avgPosition: "1.7" },
    { label: "Black Myth: Wukong", avgPosition: "2.3" },
    { label: "Final Fantasy VII Rebirth", avgPosition: "2.7" },
    { label: "Helldivers 2", avgPosition: "3.7" },
    { label: "Dragon's Dogma 2", avgPosition: "4.7" }
  ]
};

// Range Average
const mockRangeAverage = {
  type: "range",
  average: 7.0,
  min: 5,
  max: 9,
  total: 5
};

// OpenEnd Average
const mockOpenEndAverage = {
  type: "openend",
  total: 3,
  avgWords: 18.3
};

// ================================
// 5. POPULAR/TOP ANSWER (Highest vote_score)
// ================================

const mockPopularAnswer = {
  id: 1,
  question_id: 125,
  user_id: 8,
  is_anonymous: 0,
  anonymous_name: null,
  anonymous_bg_color: null,
  post_id: 125,
  question_type: "closedend",
  text_answer: null,
  yes_no: "yes",
  rating_value: null,
  singlechoice_option_id: null,
  singlechoice_option_value: null,
  multiplechoice_option_ids: null,
  multiplechoice_option_value: null,
  ranking_positions: null,
  ranking_position_value: null,
  range_value: null,
  created_at: "2026-06-15T09:00:00Z",
  updated_at: "2026-06-15T09:00:00Z",
  author_name: "TechGuru",
  author_avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  author_bg_color: null,
  upvotes: 12,
  downvotes: 1,
  vote_score: 11,
  user_vote_type: "upvote"
};

// ================================
// 6. COMPLETE MOCK RESPONSE
// ================================

const mockAnswersResponse = {
  success: true,
  data: mockClosedEndAnswers,
  pagination: {
    page: 1,
    limit: 10,
    total: 6,
    total_pages: 1,
    has_more: false
  }
};

const mockCommentsResponse = {
  comments: mockComments,
  pagination: {
    page: 1,
    limit: 10,
    total: 3,
    total_pages: 1,
    has_more: false
  }
};

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

// ================================
// ANSWER UTILITY FUNCTIONS
// ================================

// Calculate average/aggregated answer for each question type
const calculateAverageAnswer = (answers, questionType) => {
  if (!answers || answers.length === 0) return null;

  switch (questionType) {
    case 'closedend': {
      const yesCount = answers.filter(a => a.yes_no === 'yes').length;
      const noCount = answers.filter(a => a.yes_no === 'no').length;
      const total = answers.length;
      return {
        type: 'closedend',
        yes: {
          count: yesCount,
          percentage: Math.round((yesCount / total) * 100)
        },
        no: {
          count: noCount,
          percentage: Math.round((noCount / total) * 100)
        },
        total
      };
    }

    case 'rating': {
      const total = answers.length;
      const sum = answers.reduce((acc, a) => acc + (a.rating_value || 0), 0);
      const average = (sum / total).toFixed(1);
      // Count distribution
      const distribution = {};
      answers.forEach(a => {
        const val = a.rating_value || 0;
        distribution[val] = (distribution[val] || 0) + 1;
      });
      return {
        type: 'rating',
        average: parseFloat(average),
        total,
        distribution: Object.keys(distribution).sort().map(key => ({
          value: parseInt(key),
          count: distribution[key],
          percentage: Math.round((distribution[key] / total) * 100)
        }))
      };
    }

    case 'singlechoice': {
      const counts = {};
      answers.forEach(a => {
        const val = a.singlechoice_option_value || 'Unknown';
        counts[val] = (counts[val] || 0) + 1;
      });
      const total = answers.length;
      const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
      return {
        type: 'singlechoice',
        total,
        choices: sorted.map(key => ({
          label: key,
          count: counts[key],
          percentage: Math.round((counts[key] / total) * 100)
        }))
      };
    }

    case 'multiplechoice': {
      const counts = {};
      answers.forEach(a => {
        const values = parseJSON(a.multiplechoice_option_value) || [];
        values.forEach(val => {
          counts[val] = (counts[val] || 0) + 1;
        });
      });
      const total = answers.length;
      const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
      return {
        type: 'multiplechoice',
        total,
        choices: sorted.map(key => ({
          label: key,
          count: counts[key],
          percentage: Math.round((counts[key] / total) * 100)
        }))
      };
    }

    case 'rankingorder': {
      // Calculate average position for each item
      const positionMap = {};
      answers.forEach(a => {
        const texts = parseJSON(a.ranking_position_value) || [];
        const positions = parseJSON(a.ranking_positions) || [];
        texts.forEach((text, idx) => {
          if (!positionMap[text]) {
            positionMap[text] = { sum: 0, count: 0 };
          }
          positionMap[text].sum += positions[idx] || idx + 1;
          positionMap[text].count += 1;
        });
      });
      const sorted = Object.keys(positionMap).sort((a, b) => {
        const avgA = positionMap[a].sum / positionMap[a].count;
        const avgB = positionMap[b].sum / positionMap[b].count;
        return avgA - avgB;
      });
      return {
        type: 'rankingorder',
        total: answers.length,
        items: sorted.map(key => ({
          label: key,
          avgPosition: (positionMap[key].sum / positionMap[key].count).toFixed(1)
        }))
      };
    }

    case 'range': {
      const total = answers.length;
      const sum = answers.reduce((acc, a) => acc + (a.range_value || 0), 0);
      const average = (sum / total).toFixed(1);
      const min = Math.min(...answers.map(a => a.range_value || 0));
      const max = Math.max(...answers.map(a => a.range_value || 0));
      return {
        type: 'range',
        average: parseFloat(average),
        min,
        max,
        total
      };
    }

    case 'openend': {
      const total = answers.length;
      // For open-ended, show count of answers and word count stats
      const wordCounts = answers.map(a => (a.text_answer || '').split(' ').length);
      const avgWords = (wordCounts.reduce((a, b) => a + b, 0) / total).toFixed(1);
      return {
        type: 'openend',
        total,
        avgWords: parseFloat(avgWords)
      };
    }

    default:
      return null;
  }
};

// ================================
// AVERAGE ANSWER DISPLAY COMPONENT
// ================================

const AverageAnswerDisplay = ({ averageData, questionType, ratingIcon }) => {
  if (!averageData) return null;

  const renderContent = () => {
    switch (questionType) {
      case 'closedend':
        return (
          <div className="average-closedend">
            <div className="average-bar-container">
              <div className="average-bar-label">
                <span><CheckOutlined />  Yes</span>
                <span>{averageData.yes.count} ({averageData.yes.percentage}%)</span>
              </div>
              <div className="average-bar-track">
                <div 
                  className="average-bar-fill yes-fill" 
                  style={{ width: `${averageData.yes.percentage}%` }}
                />
              </div>
            </div>
            <div className="average-bar-container">
              <div className="average-bar-label">
                <span><CloseOutlined />  No</span>
                <span>{averageData.no.count} ({averageData.no.percentage}%)</span>
              </div>
              <div className="average-bar-track">
                <div 
                  className="average-bar-fill no-fill" 
                  style={{ width: `${averageData.no.percentage}%` }}
                />
              </div>
            </div>
            <div className="average-total-votes">
              {averageData.total} total vote{averageData.total > 1 ? 's' : ''}
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="average-rating">
            <div className="average-rating-score">
              <span className="avg-score">{averageData.average}</span>
              <span className="avg-out-of">/ 5</span>
            </div>
            <div className="average-rating-distribution">
              {averageData.distribution.map(item => (
                <div key={item.value} className="rating-distribution-row">
                  <span className="rating-value">{item.value}</span>
                  <div className="rating-bar-track">
                    <div 
                      className="rating-bar-fill" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="rating-count">{item.count}</span>
                </div>
              ))}
            </div>
            <div className="average-total-votes">
              {averageData.total} total rating{averageData.total > 1 ? 's' : ''}
            </div>
          </div>
        );

      case 'singlechoice':
      case 'multiplechoice':
        return (
          <div className="average-choices">
            {averageData.choices.map((choice, idx) => (
              <div key={idx} className="choice-bar-container">
                <div className="choice-bar-label">
                  <span>{choice.label}</span>
                  <span>{choice.count} ({choice.percentage}%)</span>
                </div>
                <div className="choice-bar-track">
                  <div 
                    className="choice-bar-fills" 
                    style={{ 
                      width: `${choice.percentage}%`
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="average-total-votes">
              {averageData.total} total response{averageData.total > 1 ? 's' : ''}
            </div>
          </div>
        );

      case 'rankingorder':
        return (
          <div className="average-ranking">
            {averageData.items.map((item, idx) => (
              <div key={idx} className="ranking-item">
                <span className="ranking-position">{idx + 1}. </span>
                <span className="ranking-label"> {item.label}</span>
                <span className="ranking-avg">Avg: {item.avgPosition}</span>
              </div>
            ))}
            <div className="average-total-votes">
              {averageData.total} total ranking{averageData.total > 1 ? 's' : ''}
            </div>
          </div>
        );

      case 'range':
        return (
          <div className="average-range">
            <div className="range-stats">
              <span>Min: {averageData.min}</span>
              <span>Average: {averageData.average}</span>
              <span>Max: {averageData.max}</span>
            </div>
            <div className="average-total-votes">
              {averageData.total} total response{averageData.total > 1 ? 's' : ''}
            </div>
          </div>
        );

      case 'openend':
        return (
          null
        );

      default:
        return null;
    }
  };

  return (
    <div className="average-answer-container">
      <div className="average-answer-header">
        <BarChart3 size={18} />
        <span>Analytic Answer</span>
      </div>
      <div className="average-answer-body">
        {renderContent()}
      </div>
    </div>
  );
};

// ================================
// ANSWER VOTE BUTTON
// ================================

const AnswerVoteButton = memo(({ voteScore, userVote, onUpvote, onDownvote, isVoting }) => {
  return (
    <div className="answer-vote-container">
      <button 
        className={`answer-vote-btn upvote ${userVote === 'upvote' ? 'active' : ''}`}
        onClick={onUpvote}
        disabled={isVoting}
      >
        <ArrowUp size={16} />
      </button>
      <span className="answer-vote-score">{voteScore}</span>
      <button 
        className={`answer-vote-btn downvote ${userVote === 'downvote' ? 'active' : ''}`}
        onClick={onDownvote}
        disabled={isVoting}
      >
        <ArrowDown size={16} />
      </button>
    </div>
  );
});

// ================================
// ANSWER CARD
// ================================

const AnswerCard = memo(({ answer, onUpvote, onDownvote, isVoting, onAnswerClick, highlightedAnswerId, ratingIcon }) => {
  const renderAnswerContent = () => {
    switch (answer.question_type) {
      case 'openend':
        return <p className="answer-text"><EnterOutlined style={{transform: 'scaleX(-1)', fontSize: "15px",}}/> {answer.text_answer}</p>;
      case 'closedend':
        return (
          <div className={`${answer.yes_no === 'yes' ? 'answer-yess' : 'answer-nos'}`}>
            <EnterOutlined style={{transform: 'scaleX(-1)', fontSize: "15px",}}/>
            {answer.yes_no === 'yes' ? 'Yes' : 'No'}
          </div>
        );
      case 'rating':
        return (
          <div className="answer-rating">
            <EnterOutlined style={{transform: 'scaleX(-1)', fontSize: "15px",}}/>
            {
              Array.from({ length: answer.rating_value || 0 }).map((_, i) => (
                <FontAwesomeIcon 
                  key={`${answer.id}-${i}`} 
                  icon={iconOptions.find((opt) => opt.id === ratingIcon)?.icon}
                  style={{ fontSize: "20px", color: "var(--primary-color)" }}
                />
              ))
            }
          </div>
        );
      case 'singlechoice':
        return (
          <div className="answer-choice-badge">
            <EnterOutlined style={{transform: 'scaleX(-1)', fontSize: "15px"}}/> {answer.singlechoice_option_value}
          </div>
        );
      case 'multiplechoice': {
        const choices = parseJSON(answer.multiplechoice_option_value);
        return (
          <div className='answer-multiple'>
          <EnterOutlined style={{transform: 'scaleX(-1)', fontSize: "15px",}}/>
          <div className="answer-choices">
            {choices.map((choice, idx) => (
              <span key={idx} className="answer-choice-badge"> {choice}</span>
            ))}
          </div>
          </div>
        );
      }
      case 'range':
        return (
          <div className="answer-range">
            <EnterOutlined style={{transform: 'scaleX(-1)', fontSize: "15px",}}/> {answer.range_value}
          </div>
        );
      case 'rankingorder':
        const rankingItems = parseJSON(answer.ranking_position_value);
        return (
          <div className='answer-multiple'>
          <EnterOutlined style={{transform: 'scaleX(-1)', fontSize: "15px",}}/>
          <div className="answer-ranking">
         
             {
               rankingItems.map((item, idx) => (
                 <div key={idx} className="ranking-item">
                   <span className="ranking-position">{idx + 1}. </span>
                   <span className="ranking-label">{item}</span>
                 </div>
               ))
             }
          </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`answer-card ${highlightedAnswerId === answer.id ? 'highlight-answer' : ''}`}
      id={`answer-${answer.id}`}
      onClick={() => onAnswerClick?.(answer.id)}
    >
      <div className="answer-header">
        <div className="answer-author">
          <div 
            className="answer-avatar" 
            style={{ background: answer.author_bg_color || '#999' }}
          >
            {answer.author_name?.slice(0, 2) || '??'}
          </div>
          <div className="answer-author-info">
            <span className="answer-author-name">{answer.author_name || 'Anonymous'}</span>
            <span className="answer-time">{timeAgo(answer.created_at)}</span>
          </div>
        </div>
      </div>
      
      <div className="answer-body">
        {renderAnswerContent()}
      </div>
      
      <div className="answer-footer">
        <AnswerVoteButton
          voteScore={answer.vote_score || 0}
          userVote={answer.user_vote_type}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
          isVoting={isVoting}
        />
      </div>
    </div>
  );
});

// ================================
// COMMENT LIKE BUTTON
// ================================

const CommentLikeButton = memo(({ isLiked, likesCount, onLike, isAnimating }) => {
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
});

// ================================
// COMMENT CARD
// ================================

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

// ================================
// MAIN COMPONENT
// ================================

const AboutPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, onlineUsers } = useOutletContext();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [likingPosts, setLikingPosts] = useState(false);
  const [likingCommentId, setLikingCommentId] = useState(null);
  const [favoritingPosts, setFavoritingPosts] = useState(false);

  const [comments, setComments] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [popularAnswer, setPopularAnswer] = useState(null);
  const [averageData, setAverageData] = useState(null);
  const [votingAnswerId, setVotingAnswerId] = useState(null);
  const [userProfilePic, setUserProfilePic] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIMICmqUJvaXbGlMPkkTZdGfR_y1ptPhg7tg&s");

  const [page, setPage] = useState(1);
  const [answerPage, setAnswerPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreAnswers, setHasMoreAnswers] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingAnswers, setLoadingAnswers] = useState(false);

  const [expandedReplies, setExpandedReplies] = useState({});
  const [highlightedId, setHighlightedId] = useState(null);
  const [highlightedAnswerId, setHighlightedAnswerId] = useState(null);
  const [selectedTab, setSelectedTab] = useState(1);

  const observerRef = useRef(null);
  const answerObserverRef = useRef(null);
  const targetCommentId = useRef(null);
  const targetAnswerId = useRef(null);
  const hasScrolledToHash = useRef(false);
  const commentsFetched = useRef(false);
  const answersFetched = useRef(false);

  // Parse location hash for scrolling
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace("#", "");
      if (hash.startsWith('answer-')) {
        targetAnswerId.current = hash.replace('answer-', '');
        targetCommentId.current = null;
      } else {
        targetCommentId.current = hash;
        targetAnswerId.current = null;
      }
    }
  }, [location]);

  // Auto scroll to answer or comment
  useEffect(() => {
    if (hasScrolledToHash.current) return;

    if (targetAnswerId.current && answers.length > 0) {
      const answerId = targetAnswerId.current;
      const found = answers.some(a => String(a.id) === String(answerId));
      
      if (found) {
        setSelectedTab(1);
        setTimeout(() => {
          const el = document.getElementById(`answer-${answerId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            hasScrolledToHash.current = true;
            setHighlightedAnswerId(answerId);
            setTimeout(() => setHighlightedAnswerId(null), 4000);
          }
        }, 500);
      }
    } else if (targetCommentId.current && comments.length > 0) {
      const commentId = targetCommentId.current;
      let found = false;
      
      comments.forEach(comment => {
        if (String(comment.id) === commentId) {
          found = true;
        }
        comment.replies?.forEach(reply => {
          if (String(reply.id) === commentId) {
            found = true;
            setExpandedReplies(prev => ({ ...prev, [comment.id]: true }));
          }
        });
      });
      
      if (found) {
        setSelectedTab(2);
        setTimeout(() => {
          const el = document.getElementById(commentId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            hasScrolledToHash.current = true;
            setHighlightedId(commentId);
            setTimeout(() => setHighlightedId(null), 4000);
          }
        }, 500);
      }
    }
  }, [answers, comments]);

  // Infinite scroll for comments
  useEffect(() => {
    if (selectedTab !== 2) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingComments) {
          fetchComments(page + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [page, hasMore, loadingComments, selectedTab]);

  // Infinite scroll for answers
  useEffect(() => {
    if (selectedTab !== 1) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMoreAnswers && !loadingAnswers && post?.post_type === 'question') {
          fetchAnswers(answerPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (answerObserverRef.current) observer.observe(answerObserverRef.current);
    return () => observer.disconnect();
  }, [answerPage, hasMoreAnswers, loadingAnswers, selectedTab, post]);

  // Calculate average when answers change
  useEffect(() => {
    if (answers.length > 0 && post?.post_type === 'question') {
      const data = calculateAverageAnswer(answers, post?.data?.question_type);
      setAverageData(data);
    }
  }, [answers, post]);

  // Fetch data when tab changes
  useEffect(() => {
    if (post?.post_type === 'question') {
      if (selectedTab === 1 && !answersFetched.current) {
        fetchAnswers(1);
        answersFetched.current = true;
      } else if (selectedTab === 2 && !commentsFetched.current) {
        fetchComments(1);
        commentsFetched.current = true;
      }
    } else {
      if (!commentsFetched.current) {
        fetchComments(1);
        commentsFetched.current = true;
      }
    }
  }, [selectedTab, post]);

  // Initial load
  useEffect(() => {
    handleFetchPost();
    handleView();
    handleHistory();
  }, [id]);

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
// const handleFetchPost = async () => {
//   try {
//     // USE MOCK DATA - comment out real API
//     setPost(mockQuestionPostSingleChoice);
//     if (mockQuestionPostSingleChoice.is_anonymous !== 1 && mockQuestionPostSingleChoice.avatar_url) {
//       setUserProfilePic(mockQuestionPostSingleChoice.avatar_url);
//     }
    
//     // REAL API - comment this out for testing
//     // const res = await axios.get(...);
//     // setPost(res.data.data);
//   } catch (err) {
//     console.error(err);
//     setPost(null);
//   }
// };
//   const fetchAnswers = async (pageNum = 1) => {
//   if (loadingAnswers || !hasMoreAnswers || post?.post_type !== 'question') return;

//   try {
//     setLoadingAnswers(true);
    
//     // MOCK - Remove this and uncomment real API for production
//     setTimeout(() => {
//       let newAnswers = [];
//       switch (post?.data?.question_type) {
//         case 'closedend':
//           newAnswers = mockClosedEndAnswers;
//           setAverageData(mockClosedEndAverage);
//           break;
//         case 'rating':
//           newAnswers = mockRatingAnswers;
//           setAverageData(mockRatingAverage);
//           break;
//         case 'singlechoice':
//           newAnswers = mockSingleChoiceAnswers;
//           setAverageData(mockSingleChoiceAverage);
//           break;
//         case 'multiplechoice':
//           newAnswers = mockMultipleChoiceAnswers;
//           setAverageData(mockMultipleChoiceAverage);
//           break;
//         case 'rankingorder':
//           newAnswers = mockRankingAnswers;
//           setAverageData(mockRankingAverage);
//           break;
//         case 'range':
//           newAnswers = mockRangeAnswers;
//           setAverageData(mockRangeAverage);
//           break;
//         case 'openend':
//           newAnswers = mockOpenEndAnswers;
//           setAverageData(mockOpenEndAverage);
//           break;
//         default:
//           newAnswers = mockClosedEndAnswers;
//       }
      
//       setAnswers(prev => pageNum === 1 ? newAnswers : [...prev, ...newAnswers]);
//       setHasMoreAnswers(false);
//       setAnswerPage(pageNum);
//       setLoadingAnswers(false);
//     }, 300);
    
//   } catch (err) {
//     console.error(err);
//     setLoadingAnswers(false);
//   }
// };
  const fetchAnswers = async (pageNum = 1) => {
    if (loadingAnswers || !hasMoreAnswers || post?.post_type !== 'question') return;

    try {
      setLoadingAnswers(true);
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/answers/question/${post?.data?.id}?page=${pageNum}&limit=10&sort=top`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newAnswers = res.data.data;
      setAnswers(prev => pageNum === 1 ? newAnswers : [...prev, ...newAnswers]);
      setHasMoreAnswers(res.data.pagination.has_more);
      setAnswerPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnswers(false);
    }
  };


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

  const handleUpvoteAnswer = async (answerId) => {
    if (votingAnswerId === answerId) return;
    setVotingAnswerId(answerId);

    const previousAnswers = [...answers];
    setAnswers(prev => prev.map(a => {
      if (a.id === answerId) {
        const newVoteType = a.user_vote_type === 'upvote' ? null : 'upvote';
        const voteDelta = a.user_vote_type === 'upvote' ? -1 : (a.user_vote_type === 'downvote' ? 2 : 1);
        return {
          ...a,
          user_vote_type: newVoteType,
          vote_score: (a.vote_score || 0) + voteDelta
        };
      }
      return a;
    }));

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/answers/${answerId}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setAnswers(previousAnswers);
      console.error(err);
    } finally {
      setVotingAnswerId(null);
    }
  };

  const handleDownvoteAnswer = async (answerId) => {
    if (votingAnswerId === answerId) return;
    setVotingAnswerId(answerId);

    const previousAnswers = [...answers];
    setAnswers(prev => prev.map(a => {
      if (a.id === answerId) {
        const newVoteType = a.user_vote_type === 'downvote' ? null : 'downvote';
        const voteDelta = a.user_vote_type === 'downvote' ? 1 : (a.user_vote_type === 'upvote' ? -2 : -1);
        return {
          ...a,
          user_vote_type: newVoteType,
          vote_score: (a.vote_score || 0) + voteDelta
        };
      }
      return a;
    }));

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/answers/${answerId}/downvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setAnswers(previousAnswers);
      console.error(err);
    } finally {
      setVotingAnswerId(null);
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
                  <div className="yesno-div render-qa-post">
                            <div className="yes-chip">
                              Yes
                            </div>

                            <div className="no-chip">
                              No
                            </div>
                  </div>
                )}
                {data.question_type === "range" && (
                   <div className='range-preview-option'>
                                  <label id="min-label">{data.range_min}</label>

                <div className="range-wrapper">
                    <input
                    type="range"
                    min={data.range_min}
                    max={data.range_max}
                    step={data.step}
                    value={data.default_range_value}
                    onChange={(e) => setRangeValue(Number(e.target.value))}
                    />
                        <div
                    className="custom-thumb"
                    style={{
                        left: `${((data.default_range_value - data.range_min) / (data.range_max - data.range_min)) * 100}%`
                    }}
                    >
                    {data.default_range_value}
                    </div>
                </div>
                <label id="max-label">{data.range_max}</label>
                          </div>
                )}
                {data.question_type === "singlechoice" && (
                  <ul className='choice-ul'>
                    {
                      data.choices?.map(
                        (c, i) => (
                          <li key={i} className = 'choice-li'>
                            <FontAwesomeIcon icon={faCircle} className='tool-answer-icon'/> {c.choice_text}
                          </li>
                        )
                      )
                    }
                  </ul>
                )}
                {data.question_type === "multiplechoice" && (
                  <ul className ='choice-ul'>
                    {
                      data.choices?.map((c,i) => (
                        <li key={i} className ='choice-li'>
                         <BorderOutlined className='tool-answer-icon'/>  {c.choices_text}
                        </li> 
                      ))
                    }
                  </ul>
                )}
                {data.question_type === "rankingorder" && (  
                  <ul className='choice-ul'>
                    {data.items?.map((item, i) => (
                    <li className = 'choice-li'>
                              {i + 1}. {item.item_text}
                    </li>
                      )
                        
                        )}
                  </ul>
                )}
                {data.question_type === "rating" && (
                  <div className='render-qa-post'>
                    {Array.from({length:5}).map((_,i)=>(
                      <FontAwesomeIcon 
                      key={i}
                      icon={iconOptions.find((opt) => opt.id === data.rating_icon_id)?.icon}
                      style={{ fontSize: "24px", color: "grey" }}
                      />
                    ))}
                  </div>
                )}
                {data.question_type === "openend" && (
                  null
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
              <button type='button' className='back-btn-about-post' onClick={() => navigate(-1)}><LeftOutlined /></button>
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
          <div className="comment-box">
          {post?.post_type === "question" ? (
            <>
              <div className='radio-button-div-aboutpost'>
                {[
                  { id: 1, label: "Answers"},
                  { id: 2, label: "Comments"}
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedTab(opt.id);
                      if (opt.id === 2 && !commentsFetched.current) {
                        fetchComments(1);
                        commentsFetched.current = true;
                      } else if (opt.id === 1 && !answersFetched.current) {
                        fetchAnswers(1);
                        answersFetched.current = true;
                      }
                    }}
                    style={{
        
                      color: selectedTab === opt.id ? "var(--font-color)" : "grey",
                    }}
                    className='radio-button-aboutpost'
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              
              {selectedTab === 1 && (
                <div>
                  <button
                    onClick={() => navigate(`/answer/${post?.id}/${post?.data?.id}`)}
                    className="comment-btn"
                  >
                    <FontAwesomeIcon icon={faPen} style={{fontSize:'12px'}}/> Answer this question
                  </button>
                  {/* Average Answer Display */}
                  {averageData && (
                    <AverageAnswerDisplay 
                      averageData={averageData} 
                      questionType={post?.data?.question_type}
                      ratingIcon = {post?.data?.question_type === "rating" ? post?.data?.rating_icon_id : null}
                    />
                  )}  
                  {/* All Answers */}
                  <div className="all-answers-section">
                    {answers.map(answer => (
                      <AnswerCard
                        key={answer.id}
                        ratingIcon = {post?.data?.question_type === "rating" ? post?.data?.rating_icon_id : null}
                        answer={answer}
                        onUpvote={() => handleUpvoteAnswer(answer.id)}
                        onDownvote={() => handleDownvoteAnswer(answer.id)}
                        isVoting={votingAnswerId === answer.id}
                        onAnswerClick={(answerId) => {
                          navigate(`/aboutpost/${id}#answer-${answerId}`);
                        }}
                        highlightedAnswerId={highlightedAnswerId}
                      />
                    ))}
                    
                    <div ref={answerObserverRef} style={{ height: "20px" }} />
                    {loadingAnswers && <p className="loading-text">Loading answers...</p>}
                    {answers.length === 0 && !loadingAnswers && (
                      <div id='no-com-div'>
                        <FontAwesomeIcon icon={faMartiniGlassEmpty} className='no-com-p'/>
                        <p className='no-com-p'>No answers yet. Be the first to answer!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedTab === 2 && (
                <>
                  <button
                    onClick={() => navigate(`/comment`, { state: { postId: id } })}
                    className="comment-btn"
                  >
                    <FontAwesomeIcon icon={faPen} style={{fontSize:'12px'}}/> Write a comment
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
                
                  {comments.length === 0 && !loadingComments && (
                    <div id='no-com-div'>
                      <FontAwesomeIcon icon={faMartiniGlassEmpty} className='no-com-p'/>
                      <p className='no-com-p'>No comments yet. Start the conversation!</p>
                    </div>
                  )}

                  <div ref={observerRef} style={{ height: "20px" }} />
                  {loadingComments && <p className="loading-text">Loading comments...</p>}
                </>
              )}
            </>
          ) : (
            <>
              <span id='label-com-count'>{post?.comments_count} Comment{post?.comments_count > 1 && "s"}</span>
              <button
                onClick={() => navigate(`/comment`, { state: { postId: id } })}
                className="comment-btn"
              >
                <FontAwesomeIcon icon={faPen} style={{fontSize:'12px'}}/> Write a comment
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
            
              {comments.length === 0 && !loadingComments && (
                <div id='no-com-div'>
                  <FontAwesomeIcon icon={faMartiniGlassEmpty} className='no-com-p'/>
                  <p className='no-com-p'>Be the first to comment or answer</p>
                </div>
              )}

              <div ref={observerRef} style={{ height: "20px" }} />
              {loadingComments && <p className="loading-text">Loading comments...</p>}
            </>
          )}
        </div>
        </div>
      </article>
      <article id='his-article'>
        <Rule setRule={post?.post_type === "question" ? "question-comment" : post?.post_type === "content" ? "content-comment" : "confession-comment"} />
      </article>
    </div>
  );
};


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