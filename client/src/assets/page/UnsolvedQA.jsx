import React, { useState, useEffect } from "react";
import nahIdeaAuth from "../img/nahIdeaAuth.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconOptions } from "../data/post_type_data";
import {
  faThumbsUp,
  faThumbsDown,
  faHandPointer,
  faHandPeace,
  faHand,
  faStar,
  faLocationCrosshairs,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { SignatureOutlined, HeartFilled, LoadingOutlined } from "@ant-design/icons";
import "../style/page/UnsolvedQA.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UnsolvedQA = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch unsolved questions from API
  const fetchUnsolvedQuestions = async (pageNum = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("token"); // Adjust based on your auth storage
      const response = await axios.get(
        `/api/questions/unsolved?page=${pageNum}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        if (isLoadMore) {
          setQuestions(prev => [...prev, ...response.data.data]);
          setHasMore(response.data.data.length === 20);
        } else {
          setQuestions(response.data.data);
          setHasMore(response.data.data.length === 20);
        }
      }
    } catch (err) {
      console.error("Error fetching unsolved questions:", err);
      setError(err.response?.data?.message || "Failed to load questions");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUnsolvedQuestions(1, false);
  }, []);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUnsolvedQuestions(nextPage, true);
    }
  };

  const renderQuestionPreview = (post) => {
    const { question_type, data: qData } = post;

    switch (question_type) {
      case "openend":
        return (
          <div className="question-preview-card openend">
            <div className="question-preview-header">
              <span className="question-badge openend-badge">
                <SignatureOutlined /> Write Your Answer
              </span>
            </div>
          </div>
        );

      case "closedend":
        return (
          <div className="question-preview-card closedend">
            <div className="question-preview-header">
              <span className="question-badge yesno-badge">
                <FontAwesomeIcon icon={faThumbsUp} /> Yes / No{" "}
                <FontAwesomeIcon icon={faThumbsDown} />
              </span>
            </div>
            <div className="yesno-div">
              <div className="yes-chip">Yes</div>
              <div className="no-chip">No</div>
            </div>
          </div>
        );

      case "range":
        return (
          <div className="question-preview-card range">
            <div className="question-preview-header">
              <span className="question-badge range-badge">
                <FontAwesomeIcon icon={faLocationCrosshairs} /> Range
              </span>
            </div>
            <div className="range-preview-option">
              <label id="min-label">{qData.range_min ?? 0}</label>
              <div className="range-wrapper">
                <input
                  type="range"
                  min={qData.range_min ?? 0}
                  max={qData.range_max ?? 100}
                  step={qData.step ?? 1}
                  value={qData.default_range_value ?? 50}
                  readOnly
                />
                <div
                  className="custom-thumb"
                  style={{
                    left: `${
                      (((qData.default_range_value ?? 50) - (qData.range_min ?? 0)) /
                        ((qData.range_max ?? 100) - (qData.range_min ?? 0))) *
                      100
                    }%`,
                  }}
                >
                  {qData.default_range_value ?? 50}
                </div>
              </div>
              <label id="max-label">{qData.range_max ?? 100}</label>
            </div>
          </div>
        );

      case "singlechoice":
        const choices = qData.choices || [];
        const displayChoices = choices.slice(0, choices.length > 4 ? 3 : 4);
        return (
          <div className="question-preview-card singlechoice">
            <div className="question-preview-header">
              <span className="question-badge single-badge">
                <FontAwesomeIcon icon={faHandPointer} /> Pick One
              </span>
            </div>
            <div className="question-preview-options two-grid">
              {displayChoices.map((c, i) => (
                <div key={i} className="option-chip">
                  {c.choice_text}
                </div>
              ))}
              {choices.length > 4 && (
                <div className="option-chip more-chip">+{choices.length - 3} more</div>
              )}
            </div>
          </div>
        );

      case "multiplechoice":
        const multiChoices = qData.choices || [];
        const displayMulti = multiChoices.slice(0, multiChoices.length > 4 ? 3 : 4);
        return (
          <div className="question-preview-card multiplechoice">
            <div className="question-preview-header">
              <span className="question-badge multiple-badge">
                <FontAwesomeIcon icon={faHandPeace} /> Pick Multiple
              </span>
            </div>
            <div className="question-preview-options two-grid">
              {displayMulti.map((c, i) => (
                <div key={i} className="option-chip">
                  {c.choice_text}
                </div>
              ))}
              {multiChoices.length > 4 && (
                <div className="option-chip more-chip">+{multiChoices.length - 3} more</div>
              )}
            </div>
          </div>
        );

      case "rankingorder":
        const items = qData.items || [];
        const displayItems = items.slice(0, items.length > 4 ? 3 : 4);
        return (
          <div className="question-preview-card rankingorder">
            <div className="question-preview-header">
              <span className="question-badge rank-badge">
                <FontAwesomeIcon icon={faHand} /> Move the Rankings
              </span>
            </div>
            <div className="question-preview-options two-grid">
              {displayItems.map((item, idx) => (
                <div key={idx} className="option-chip rank-chip">
                  <span className="rank-number">#{idx + 1}</span>
                  <span className="rank-text">{item.item_text}</span>
                </div>
              ))}
              {items.length > 4 && (
                <div className="option-chip more-chip">+{items.length - 3} more</div>
              )}
            </div>
          </div>
        );

      case "rating":
        const ratingIcon = iconOptions.find((opt) => opt.id === qData.rating_icon_id)?.icon || faStar;
        return (
          <div className="question-preview-card rating">
            <div className="question-preview-header">
              <span className="question-badge rating-badge">
                <FontAwesomeIcon icon={faStar} /> Rate
              </span>
            </div>
            <div className="rating-preview-icons">
              {Array.from({ length: 5 }).map((_, i) => (
                <FontAwesomeIcon 
                  key={i}
                  icon={ratingIcon}
                  style={{ fontSize: "24px", color: "#ffc107" }}
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleCardClick = (post) => {
    const QaData = {
      question_id: post.data?.id || post.question_id,
      title: post.title,
      question_type: post.question_type,
    };
    
    if (post.question_type === "range") {
      QaData.range_min = post.data?.range_min;
      QaData.range_max = post.data?.range_max;
      QaData.step = post.data?.step;
      QaData.default_range_value = post.data?.default_range_value;
    }
    
    if (post.question_type === "singlechoice") {
      QaData.choice = post.data?.choices || [];
    }
    
    if (post.question_type === "multiplechoice") {
      QaData.choices = post.data?.choices || [];
      QaData.include_all_above = post.data?.include_all_above;
    }
    
    if (post.question_type === "rankingorder") {
      QaData.items = post.data?.items || [];
    }
    
    if (post.question_type === "rating") {
      QaData.rating_icon_id = post.data?.rating_icon_id;
    }
    
    sessionStorage.setItem("QaStore", JSON.stringify(QaData));
    navigate(`/answer/${post.id}/${post.data?.id || post.question_id}/${post.question_type}`);
  };

  if (loading) {
    return (
      <div className="unsolved-loading">
        <LoadingOutlined style={{ fontSize: 48 }} />
        <p>Loading unsolved questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="unsolved-error">
        <p>{error}</p>
        <button onClick={() => fetchUnsolvedQuestions(1, false)}>Retry</button>
      </div>
    );
  }

  return (
    <div className="unsolved-questions-container">
      <div id='qa-header'>
        <div id="qa-header-left">
          <h3 className="section-title">Unsolved Questions</h3>
          <p className="section-subtitle">Help others like you want to be helped</p>
        </div>
        <button type='button' onClick={() => navigate('/create/question')} id='go-to-create-qa'>
          Post Question
        </button>
      </div>

      <div className="questions-grid">
        {questions.length === 0 ? (
          <div className="no-questions">
            <p>No unsolved questions found.</p>
            <button onClick={() => navigate('/create/question')}>Be the first to ask!</button>
          </div>
        ) : (
          questions.map((post) => (
            <div
              key={post.id}
              className="question-card"
              onClick={() => handleCardClick(post)}
            >
              {renderQuestionPreview(post)}
              
              <div className="question-title">
                <p>{post.title || post.data?.question_text}</p>
              </div>
              
              <div className="tags">
                <div className="user-info">
                  <div
                    id="author-pf-div"
                    style={{
                      backgroundColor: post.is_anonymous === 1 ? post.anonymous_bg_color : "",
                    }}
                  >
                    <img
                      src={post.is_anonymous === 1 ? nahIdeaAuth : post.avatar_url || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"}
                      alt="user-profile"
                      id="author-pf"
                    />
                  </div>
                  <div id='user-info-p'>
                    <span className="username">
                      {post.is_anonymous ? "Anonymous" : post.username}
                    </span>
                    <span className="created-at">{post.created_at}</span>
                  </div>
                </div>
                <div className="stats">
                  <span><HeartFilled /> {post.likes_count || 0}</span>
                  <span><FontAwesomeIcon icon={faMessage} /> {post.comments_count || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {hasMore && questions.length > 0 && (
        <div className="load-more-container">
          <button 
            onClick={loadMore} 
            disabled={loadingMore}
            className="load-more-btn"
          >
            {loadingMore ? <LoadingOutlined /> : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UnsolvedQA;