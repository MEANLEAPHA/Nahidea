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
import { SignatureOutlined, HeartFilled, LoadingOutlined, BorderOutlined } from "@ant-design/icons";
import "../style/page/UnsolvedQA.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

const UnsolvedQA = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchUnsolvedQuestions = async (pageNum = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const response = await api.get(`/api/questions/unsolved?page=${pageNum}&limit=20`);

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
          null
        );

      case "closedend":
        return (
          <div className="question-preview-card ">
            <div className="yesno-div">
              <div className="yes-chip">Yes</div>
              <div className="no-chip">No</div>
            </div>
          </div>
        );

      case "range":
        return (
          <div className="question-preview-card">
             <div className='range-preview-option'>
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
        return (
          <div className="question-preview-card ">
              <ul className='choice-ul'>
                  {
                    qData.choices?.slice(0, qData.choices?.length > 4 ? 3 : 4).map(
                      (c, i) => (
                        <li key={i} className = 'choice-li'>
                          <FontAwesomeIcon icon={faCircle} className='tool-answer-icon'/> {c.choice_text}
                        </li>
                      )
                    )
                  }
                  {qData.choices?.length > 4 && (
                    <li className = 'choice-li'>
                         +{qData.choices?.length - 3} more
                    </li>
                  )}
              </ul>
          </div>
        );

      case "multiplechoice":

        return (
          <div className="question-preview-card">

            <ul className ='choice-ul'>
              {
                qData.choices?.slice(0, qData.choices?.length > 4 ? 3 : 4).map((c,i) => (
                  <li key={i} className ='choice-li'>
                    <BorderOutlined className='tool-answer-icon'/>  {c.choice_text}
                  </li> 
                ))
              }
              {qData.choices?.length > 4 && (
                <div className ='choice-li'>
                    +{qData.choices?.length - 3} more
                </div>
                )}
            </ul>
          </div>
        );

      case "rankingorder":

        return (
          <div className="question-preview-card ">
         
               <ul className='choice-ul'>
                    {qData.items?.slice(0, qData.items?.length > 4 ? 3 : 4).map((item, i) => (
                      <li className = 'choice-li'>
                          {i + 1}. {item.item_text}
                      </li>
                    ))}
                    {qData.items?.length > 4 && (
                      <li className = 'choice-li' style={{color:'grey', fontSize:'smaller'}}>
                        +{qData.items?.length - 3} more
                      </li>
                    )}
                </ul>
          </div>
        );

      case "rating":

        return (
          <div className="question-preview-card">
            <div className="rating-preview-icons">
              {Array.from({length:5}).map((_,i)=>(
                  <FontAwesomeIcon 
                  key={i}
                  icon={iconOptions.find((opt) => opt.id === qData.rating_icon_id)?.icon}
                  style={{ fontSize: "24px", color: "grey" }}
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
              <div className="question-title">
                <p>{post.title || post.data?.question_text}</p>
              </div>
              
              {renderQuestionPreview(post)}
              
           
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
                      {post.is_anonymous ? (post?.anonymous_name || "Anonymous") : post.username}
                    </span>
                    <span className="created-at">{post.created_at}</span>
                  </div>
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

// import nahIdeaAuth from "../img/nahIdeaAuth.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { iconOptions } from "../data/post_type_data";
// import {
//   faThumbsUp,
//   faThumbsDown,
//   faHandPointer,
//   faHandPeace,
//   faHand,
//   faStar,
//   faLocationCrosshairs,
//   faMessage,
// } from "@fortawesome/free-solid-svg-icons";
// import { SignatureOutlined, HeartFilled, LoadingOutlined } from "@ant-design/icons";
// import "../style/page/UnsolvedQA.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// // Mock data for testing
// const MOCK_QUESTIONS = [
//   {
//     id: 1,
//     title: "What's the best way to learn React in 2026?",
//     question_type: "openend",
//     data: {
//       id: 101,
//       question_text: "What's the best way to learn React in 2026?"
//     },
//     username: "John Doe",
//     avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=John",
//     created_at: "2026-06-28T10:30:00Z",
//     is_anonymous: 0,
//     likes_count: 15,
//     comments_count: 7,
//     anonymous_bg_color: "#6c5ce7"
//   },
//   {
//     id: 2,
//     title: "Is JavaScript a good first programming language?",
//     question_type: "closedend",
//     data: {
//       id: 102,
//       question_text: "Is JavaScript a good first programming language?"
//     },
//     username: "Jane Smith",
//     avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Jane",
//     created_at: "2026-06-28T09:15:00Z",
//     is_anonymous: 0,
//     likes_count: 23,
//     comments_count: 12,
//     anonymous_bg_color: "#fd79a8"
//   },
//   {
//     id: 3,
//     title: "How satisfied are you with current AI tools?",
//     question_type: "range",
//     data: {
//       id: 103,
//       question_text: "How satisfied are you with current AI tools?",
//       range_min: 0,
//       range_max: 100,
//       step: 1,
//       default_range_value: 75
//     },
//     username: "Anonymous",
//     avatar_url: "",
//     created_at: "2026-06-27T14:20:00Z",
//     is_anonymous: 1,
//     likes_count: 8,
//     comments_count: 3,
//     anonymous_bg_color: "#00b894"
//   },
//   {
//     id: 4,
//     title: "Which programming language should I learn first?",
//     question_type: "singlechoice",
//     data: {
//       id: 104,
//       question_text: "Which programming language should I learn first?",
//       choices: [
//         { choice_text: "Python" },
//         { choice_text: "JavaScript" },
//         { choice_text: "Java" },
//         { choice_text: "C++" },
//         { choice_text: "Ruby" },
//         { choice_text: "Go" }
//       ]
//     },
//     username: "Alex Johnson",
//     avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Alex",
//     created_at: "2026-06-27T11:45:00Z",
//     is_anonymous: 0,
//     likes_count: 31,
//     comments_count: 18,
//     anonymous_bg_color: "#e17055"
//   },
//   {
//     id: 5,
//     title: "What features would you like to see in a new social media app?",
//     question_type: "multiplechoice",
//     data: {
//       id: 105,
//       question_text: "What features would you like to see in a new social media app?",
//       choices: [
//         { choice_text: "Dark mode" },
//         { choice_text: "End-to-end encryption" },
//         { choice_text: "Content moderation" },
//         { choice_text: "Customizable feed" },
//         { choice_text: "Voice messaging" },
//         { choice_text: "Video calls" }
//       ],
//       include_all_above: true
//     },
//     username: "Maria Garcia",
//     avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Maria",
//     created_at: "2026-06-26T16:00:00Z",
//     is_anonymous: 0,
//     likes_count: 42,
//     comments_count: 25,
//     anonymous_bg_color: "#0984e3"
//   },
//   {
//     id: 6,
//     title: "Rank these programming concepts by importance",
//     question_type: "rankingorder",
//     data: {
//       id: 106,
//       question_text: "Rank these programming concepts by importance",
//       items: [
//         { item_text: "Data structures" },
//         { item_text: "Algorithms" },
//         { item_text: "Design patterns" },
//         { item_text: "Database design" },
//         { item_text: "System architecture" }
//       ]
//     },
//     username: "David Chen",
//     avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=David",
//     created_at: "2026-06-26T13:30:00Z",
//     is_anonymous: 0,
//     likes_count: 19,
//     comments_count: 9,
//     anonymous_bg_color: "#fdcb6e"
//   },
//   {
//     id: 7,
//     title: "Rate your experience with online learning platforms",
//     question_type: "rating",
//     data: {
//       id: 107,
//       question_text: "Rate your experience with online learning platforms",
//       rating_icon_id: 1
//     },
//     username: "Anonymous",
//     avatar_url: "",
//     created_at: "2026-06-25T08:45:00Z",
//     is_anonymous: 1,
//     likes_count: 27,
//     comments_count: 14,
//     anonymous_bg_color: "#6c5ce7"
//   },
//   {
//     id: 8,
//     title: "What's your preferred method of learning new skills?",
//     question_type: "openend",
//     data: {
//       id: 108,
//       question_text: "What's your preferred method of learning new skills?"
//     },
//     username: "Sarah Wilson",
//     avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sarah",
//     created_at: "2026-06-25T12:10:00Z",
//     is_anonymous: 0,
//     likes_count: 34,
//     comments_count: 21,
//     anonymous_bg_color: "#00cec9"
//   },
//   {
//     id: 9,
//     title: "Do you think remote work is here to stay?",
//     question_type: "closedend",
//     data: {
//       id: 109,
//       question_text: "Do you think remote work is here to stay?"
//     },
//     username: "Michael Brown",
//     avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Michael",
//     created_at: "2026-06-24T15:55:00Z",
//     is_anonymous: 0,
//     likes_count: 56,
//     comments_count: 33,
//     anonymous_bg_color: "#e17055"
//   },
//   {
//     id: 10,
//     title: "How would you rate your work-life balance?",
//     question_type: "range",
//     data: {
//       id: 110,
//       question_text: "How would you rate your work-life balance?",
//       range_min: 0,
//       range_max: 10,
//       step: 0.5,
//       default_range_value: 7
//     },
//     username: "Emily Davis",
//     avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Emily",
//     created_at: "2026-06-24T10:00:00Z",
//     is_anonymous: 0,
//     likes_count: 12,
//     comments_count: 5,
//     anonymous_bg_color: "#fd79a8"
//   }
// ];

// const UnsolvedQA = () => {
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [useMockData, setUseMockData] = useState(true); // Toggle for mock data

//   // Fetch unsolved questions from API
//   const fetchUnsolvedQuestions = async (pageNum = 1, isLoadMore = false) => {
//     try {
//       if (isLoadMore) {
//         setLoadingMore(true);
//       } else {
//         setLoading(true);
//       }

//       // Use mock data for design/testing
//       if (useMockData) {
//         setTimeout(() => {
//           if (isLoadMore) {
//             setQuestions(prev => [...prev, ...MOCK_QUESTIONS]);
//             setHasMore(false);
//           } else {
//             setQuestions(MOCK_QUESTIONS);
//             setHasMore(false);
//           }
//           setLoading(false);
//           setLoadingMore(false);
//         }, 800);
//         return;
//       }

//       // Real API call (commented out for mock)
//       /*
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${import.meta.env.VITE_SERVER_URL}/api/questions/unsolved?page=${pageNum}&limit=20`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data && response.data.data) {
//         if (isLoadMore) {
//           setQuestions(prev => [...prev, ...response.data.data]);
//           setHasMore(response.data.data.length === 20);
//         } else {
//           setQuestions(response.data.data);
//           setHasMore(response.data.data.length === 20);
//         }
//       }
//       */
//     } catch (err) {
//       console.error("Error fetching unsolved questions:", err);
//       setError(err.response?.data?.message || "Failed to load questions");
//       // Fallback to mock data on error
//       setQuestions(MOCK_QUESTIONS);
//       setHasMore(false);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     fetchUnsolvedQuestions(1, false);
//   }, []);

//   const loadMore = () => {
//     if (!loadingMore && hasMore) {
//       const nextPage = page + 1;
//       setPage(nextPage);
//       fetchUnsolvedQuestions(nextPage, true);
//     }
//   };

//   const renderQuestionPreview = (post) => {
//     const { question_type, data: qData } = post;

//     switch (question_type) {
//       case "openend":
//         return (
//           null
//         );

//       case "closedend":
//         return (
//           <div className="question-preview-card closedend">
//             <div className="yesno-div">
//               <div className="yes-chip">Yes</div>
//               <div className="no-chip">No</div>
//             </div>
//           </div>
//         );

//       case "range":
//         return (
//           <div className="question-preview-card range">
//             <div className="range-preview-option">
//               <label id="min-label">{qData.range_min ?? 0}</label>
//               <div className="range-wrapper">
//                 <input
//                   type="range"
//                   min={qData.range_min ?? 0}
//                   max={qData.range_max ?? 100}
//                   step={qData.step ?? 1}
//                   value={qData.default_range_value ?? 50}
//                   readOnly
//                 />
//                 <div
//                   className="custom-thumb"
//                   style={{
//                     left: `${
//                       (((qData.default_range_value ?? 50) - (qData.range_min ?? 0)) /
//                         ((qData.range_max ?? 100) - (qData.range_min ?? 0))) *
//                       100
//                     }%`,
//                   }}
//                 >
//                   {qData.default_range_value ?? 50}
//                 </div>
//               </div>
//               <label id="max-label">{qData.range_max ?? 100}</label>
//             </div>

//             <div className='range-preview-option'>
//                 <label id="min-label">{data.range_min}</label>
//                 <div className="range-wrapper">
//                     <input
//                     type="range"
//                     min={data.range_min}
//                     max={data.range_max}
//                     step={data.step}
//                     value={data.default_range_value}
//                     onChange={(e) => setRangeValue(Number(e.target.value))}
//                     />
//                         <div
//                     className="custom-thumb"
//                     style={{
//                         left: `${((data.default_range_value - data.range_min) / (data.range_max - data.range_min)) * 100}%`
//                     }}
//                     >
//                     {data.default_range_value}
//                     </div>
//                 </div>
//                 <label id="max-label">{data.range_max}</label>
//               </div>
//           </div>
//         );

//       case "singlechoice":
//         const choices = qData.choices || [];
//         const displayChoices = choices.slice(0, choices.length > 4 ? 3 : 4);
//         return (
//           <div className="question-preview-card singlechoice">
//             <div className="question-preview-options two-grid">
//               {displayChoices.map((c, i) => (
//                 <div key={i} className="option-chip">
//                   {c.choice_text}
//                 </div>
//               ))}
//               {choices.length > 4 && (
//                 <div className="option-chip more-chip">+{choices.length - 3} more</div>
//               )}
//             </div>
//           </div>
//         );

//       case "multiplechoice":
//         const multiChoices = qData.choices || [];
//         const displayMulti = multiChoices.slice(0, multiChoices.length > 4 ? 3 : 4);
//         return (
//           <div className="question-preview-card multiplechoice">
//             <div className="question-preview-options two-grid">
//               {displayMulti.map((c, i) => (
//                 <div key={i} className="option-chip">
//                   {c.choice_text}
//                 </div>
//               ))}
//               {multiChoices.length > 4 && (
//                 <div className="option-chip more-chip">+{multiChoices.length - 3} more</div>
//               )}
//             </div>
//           </div>
//         );

//       case "rankingorder":
//         const items = qData.items || [];
//         const displayItems = items.slice(0, items.length > 4 ? 3 : 4);
//         return (
//           <div className="question-preview-card rankingorder">
//             <div className="question-preview-options two-grid">
//               {displayItems.map((item, idx) => (
//                 <div key={idx} className="option-chip rank-chip">
//                   <span className="rank-number">#{idx + 1}</span>
//                   <span className="rank-text">{item.item_text}</span>
//                 </div>
//               ))}
//               {items.length > 4 && (
//                 <div className="option-chip more-chip">+{items.length - 3} more</div>
//               )}
//             </div>
//           </div>
//         );

//       case "rating":
//         const ratingIcon = iconOptions.find((opt) => opt.id === qData.rating_icon_id)?.icon || faStar;
//         return (
//           <div className="question-preview-card rating">
//             <div className="rating-preview-icons">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <FontAwesomeIcon 
//                   key={i}
//                   icon={ratingIcon}
//                   style={{ fontSize: "24px", color: "#ffc107" }}
//                 />
//               ))}
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   const handleCardClick = (post) => {
//     const QaData = {
//       question_id: post.data?.id || post.question_id,
//       title: post.title,
//       question_type: post.question_type,
//     };
    
//     if (post.question_type === "range") {
//       QaData.range_min = post.data?.range_min;
//       QaData.range_max = post.data?.range_max;
//       QaData.step = post.data?.step;
//       QaData.default_range_value = post.data?.default_range_value;
//     }
    
//     if (post.question_type === "singlechoice") {
//       QaData.choice = post.data?.choices || [];
//     }
    
//     if (post.question_type === "multiplechoice") {
//       QaData.choices = post.data?.choices || [];
//       QaData.include_all_above = post.data?.include_all_above;
//     }
    
//     if (post.question_type === "rankingorder") {
//       QaData.items = post.data?.items || [];
//     }
    
//     if (post.question_type === "rating") {
//       QaData.rating_icon_id = post.data?.rating_icon_id;
//     }
    
//     sessionStorage.setItem("QaStore", JSON.stringify(QaData));
//     navigate(`/answer/${post.id}/${post.data?.id || post.question_id}/${post.question_type}`);
//   };

//   if (loading) {
//     return (
//       <div className="unsolved-loading">
//         <LoadingOutlined style={{ fontSize: 48 }} />
//         <p>Loading unsolved questions...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="unsolved-error">
//         <p>{error}</p>
//         <button onClick={() => fetchUnsolvedQuestions(1, false)}>Retry</button>
//       </div>
//     );
//   }

//   return (
//     <div className="unsolved-questions-container">
//       <div id='qa-header'>
//         <div id="qa-header-left">
//           <h3 className="section-title">Unsolved Questions</h3>
//           <p className="section-subtitle">Help others like you want to be helped</p>
//         </div>
//         <button type='button' onClick={() => navigate('/create/question')} id='go-to-create-qa'>
//           Post Question
//         </button>
//       </div>

//       <div className="questions-grid">
//         {questions.length === 0 ? (
//           <div className="no-questions">
//             <p>No unsolved questions found.</p>
//             <button onClick={() => navigate('/create/question')}>Be the first to ask!</button>
//           </div>
//         ) : (
//           questions.map((post) => (
//             <div
//               key={post.id}
//               className="question-card"
//               onClick={() => handleCardClick(post)}
//             >
              
              
//               <div className="question-title">
//                 <p>{post.title || post.data?.question_text}</p>
//               </div>
//               {renderQuestionPreview(post)}
//               <div className="tags">
//                 <div className="user-info">
//                   <div
//                     id="author-pf-div"
//                     style={{
//                       backgroundColor: post.is_anonymous === 1 ? post.anonymous_bg_color : "",
//                     }}
//                   >
//                     <img
//                       src={post.is_anonymous === 1 ? nahIdeaAuth : post.avatar_url || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"}
//                       alt="user-profile"
//                       id="author-pf"
//                     />
//                   </div>
//                   <div id='user-info-p'>
//                     <span className="username">
//                       {post.is_anonymous ? "Anonymous" : post.username}
//                     </span>
//                     <span className="created-at">
//                       {new Date(post.created_at).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
            
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {hasMore && questions.length > 0 && (
//         <div className="load-more-container">
//           <button 
//             onClick={loadMore} 
//             disabled={loadingMore}
//             className="load-more-btn"
//           >
//             {loadingMore ? <LoadingOutlined /> : "Load More"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UnsolvedQA;