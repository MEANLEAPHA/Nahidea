// react state
import React,{ useState, useEffect, useRef, memo, useCallback, useLayoutEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from "axios";

// antd
import { List, Card, Avatar, Typography, Tag, Space, Spin, Empty, Button, Dropdown, message} from "antd";
const { Title, Text } = Typography;
import {  PlusOutlined,UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,SearchOutlined, BellOutlined, QuestionOutlined,
          FormOutlined, SoundOutlined, LogoutOutlined, MoonFilled, SunFilled, ExceptionOutlined, QuestionCircleOutlined, 
          SettingOutlined, PlusSquareOutlined, SunOutlined, MoonOutlined, ReloadOutlined,FlagOutlined,LinkOutlined,DeleteOutlined,
          EditOutlined ,TagsOutlined,CloudUploadOutlined,LayoutOutlined,ArrowLeftOutlined,AppstoreOutlined, MailOutlined,
          BorderOutlined,
      } from '@ant-design/icons';
import{SignatureOutlined, FolderOpenOutlined} from '@ant-design/icons';

// fontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleDot,faEllipsisVertical, faRetweet} from "@fortawesome/free-solid-svg-icons";
import { faBookmark, faCopy, faFlag, faHeart, faMessage, faPenToSquare, faTrashCan} from "@fortawesome/free-regular-svg-icons";
import { faThumbsDown, faThumbsUp,  faHandPointer, faHandPeace, faHand, faLocationCrosshairs, faStar} from "@fortawesome/free-solid-svg-icons";

// lucide
import {
  Heart,
  HeartOff,
  Bookmark,
  LoaderCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


// util
import {MediaPreview} from "../util/mediaUploader";
import { saveScroll, getScroll } from "./util/scrollStore";
import ReportPostModal from './ReportPostModal';
import MutualFriend from "../util/mutualFriend";
import RecentHistory from "../util/recentHistory";
import parseJSON from './util/parseJson';
import DotDropDown from "./util/dotDropDown";
import Loader from "./util/loader";

// style
import "../style/page/Home.css";
import "../style/upload/Postpreview.css";
import "../style/upload/MultipleMedia.css";

// img
import nahIdeaAuth from "../img/nahIdeaAuth.png";
import nahideaTran from "../img/nahidea-tran.png";
import DailyNews from './DailyNews';

// data
import { iconOptions } from "../data/post_type_data";
import Rule from './util/rule';

// token 
const token = localStorage.getItem("token");

export default function Home() {

  const navigate = useNavigate();
  const { onlineUsers } = useOutletContext();

  // posts
  const [posts, setPosts] = useState([]);
  const [likingPosts, setLikingPosts] = useState(new Set());
  const [favoritingPosts, setFavoritingPosts] = useState(new Set());

  // loading
  const [loading, setLoading] = useState(false); 
  const [fetching, setFetching] = useState(false); 
  const [source, setSource] = useState("");
  const [error, setError] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // INITIAL LOAD

const [initialLoadDone, setInitialLoadDone] = useState(false);

useEffect(() => {
  const saved = getScroll("home");

  const loadInitial = async () => {
    if (saved.page <= 1) {
      await fetchPosts(1);
      setPage(1);
    } else {
      for (let p = 1; p <= saved.page; p++) {
        await fetchPosts(p);
      }
      setPage(saved.page);
    }
    setInitialLoadDone(true);
  };

  loadInitial();
}, []);
  // useEffect(() => {
  //   fetchPosts(1);
  //   setPage(1);
  // }, []);


// RESTORE SCROLL once ALL initial pages are back
const hasRestoredScroll = useRef(false);

useLayoutEffect(() => {
  if (initialLoadDone && posts.length > 0 && !hasRestoredScroll.current) {
    const saved = getScroll("home");
    window.scrollTo(0, saved.y);
    hasRestoredScroll.current = true;
  }
}, [initialLoadDone, posts.length]);
useEffect(() => {
  return () => {
    saveScroll("home", { y: window.scrollY, page });
  };
}, [page]);


  // SCROLL LISTENER
useEffect(() => {
  const handleScroll = () => {
    if (
      initialLoadDone &&
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200 &&
      !loading &&
      !fetching &&
      hasMore
    ){
      setPage((prev) => {
        const next = prev + 1;
        fetchPosts(next);
        return next;
      });
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [loading, fetching, hasMore, initialLoadDone]);

  // FETCH POSTS
  const fetchPosts = async (nextPage = 1) => {
    if (fetching) return;

    try {
      setFetching(true);
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/all-posts?page=${nextPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  // Render post style
  const renderPostContent = (post) => {

    const data = post.data;

    if (!data) return <Text type="secondary">No content</Text>;

    switch (post.post_type) {
      case "content":
        return (
          <>
                <div className='post-caption' onClick={ () => {

                    const HisData = {
                      id: post.id,
                      title: data.title,
                      mediaSrc : data.media_url,
                      author: post.is_anonymous === 1 ? post.anonymous_name : post.username,
                      authurPf: post.is_anonymous === 1 ? nahIdeaAuth : post.authorPf,
                      isAnonymous: post.is_anonymous,
                      anonymousBg: post.anonymous_bg_color,
                    }
                    const recentDataHis = JSON.parse(localStorage.getItem("recentPostHis")) || [];

                    let newList;
                    if (recentDataHis.some(item => item.id === post.id)) {
                      const raminData = recentDataHis.filter(item => item.id !== post.id);
                      newList = [HisData, ...raminData].slice(0, 50);
                    } else {
                      newList = [HisData, ...recentDataHis].slice(0, 50);
                    }

                    localStorage.setItem("recentPostHis", JSON.stringify(newList));

                    navigate(`/aboutpost/${post.id}`);
                  }}>
                    <p>{data.title}</p>
                </div>
              <div  className='post-thumbnail'>         
                <MediaPreview files={parseJSON(data.media_url)}/>
              </div>
          </>
        );

      case "confession":
        return (
          <>
                   <div className='post-caption' onClick={()=>{
                        const HisData = {
                          id: post.id,
                          title: data.title,
                          mediaSrc : data.media_url,
                          author: post.is_anonymous === 1 ? post.anonymous_name : post.username,
                          authurPf: post.is_anonymous === 1 ? nahIdeaAuth : post.authorPf,
                          isAnonymous: post.is_anonymous,
                          anonymousBg: post.anonymous_bg_color,
                        }
                        const recentDataHis = JSON.parse(localStorage.getItem("recentPostHis")) || [];

                        let newList;
                        if (recentDataHis.some(item => item.id === post.id)) {
                          const raminData = recentDataHis.filter(item => item.id !== post.id);
                          newList = [HisData, ...raminData].slice(0, 50);
                        } else {
                          newList = [HisData, ...recentDataHis].slice(0, 50);
                        }

                        localStorage.setItem("recentPostHis", JSON.stringify(newList));

                      navigate(`/aboutpost/${post.id}`)
                    }}>
                    <p>{data.title}</p>
                </div>
             
                  
              <div className="post-thumbnail">
                <div className="preview-wrapper"  style={{ "--preview-url": `url(${data.media_url})` }}>
                  <img
                    src={data.media_url}
                    className="preview-image"
                  />
                </div>
              </div>

          </>
        );

      case "question":
        return (
          <>
                 <div className="post-question-answer-preview">

                      {data.question_type === "closedend" && (

                        <div className="closed-preview-card question-preview-card" onClick={
                              ()=>{
                                const QaData = {
                                    question_id : data.id,
                                  title: data.title
                                }
                                sessionStorage.setItem("QaStore", JSON.stringify(QaData));
                                navigate(`/answer/${post.id}/${data.id}/closedend`);
                              }
                            }>
                        <div className="question-preview-header">
                            <span className="question-badge yesno-badge">
                             <FontAwesomeIcon icon={faThumbsUp}/> Yes / No <FontAwesomeIcon icon={faThumbsDown}/>
                            </span>
                            <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                          </div>

                          <div className="yesno-div">
                            <div className="yes-chip">
                              Yes
                            </div>

                            <div className="no-chip">
                              No
                            </div>
                        </div>
                    </div>
                      )}

                      {data.question_type === "range" && (
                         <div className= "question-preview-card" onClick={
                          ()=>{
                            const QaData = {
                              
                                  question_id : data.id,
                                  title : data.title,
                                  range_min : data.range_min,
                                  range_max : data.range_max,
                                  step : data.step,
                                  default_range_value : data.default_range_value
                            }
                            sessionStorage.setItem("QaStore", JSON.stringify(QaData));
                            navigate(`/answer/${post.id}/${data.id}/range`);
                          }
                        }>

                <div className="question-preview-header">
                            <span className="question-badge range-badge">
                            <FontAwesomeIcon icon={faLocationCrosshairs} /> Range
                            </span>
                              <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                          </div>
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
              

                </div>
                      )}

                      {data.question_type === "singlechoice" && (
            
                        <div className="question-preview-card" onClick={
                          ()=>{        
                            const QaData = {
                                  question_id : data.id,
                                  title : data.title,
                                  choice: 
                                    data.choices?.map(c => ({
                                      choice_text: c.choice_text,
                                      singlechoice_id: c.singlechoice_id,
                                      id: c.id,
                                      question_id: c.question_id
                                    }))
                                   || []
                                  
                                }
                            sessionStorage.setItem("QaStore", JSON.stringify(QaData));
                            navigate(`/answer/${post.id}/${data.id}/singlechoice`);
                          }
                        }>
        
                        <div className="question-preview-header">
                        <span className="question-badge single-badge"><FontAwesomeIcon icon={faHandPointer} /> Pick One</span>
                        <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                        </div>
                        <ul className='choice-ul'>
                            {
                              data.choices?.slice(0, data.choices?.length > 4 ? 3 : 4).map(
                                (c, i) => (
                                  <li key={i} className = 'choice-li'>
                                    <FontAwesomeIcon icon={faCircle} className='tool-answer-icon'/> {c.choice_text}
                                  </li>
                                )
                              )
                            }
                            {data.choices?.length > 4 && (
                              <li className = 'choice-li'>
                                 <FontAwesomeIcon icon={faCircle} className='tool-answer-icon'/>  +{data.choiced?.length - 3} more
                              </li>
                            )}
                        </ul>

                        {/* <div className="question-preview-options two-grid">
                        {data.choices?.slice(0, data.choices?.length > 4 ? 3 : 4)
                        .map((c, i) => (
                            <div key={i} className="option-chip">
                            {c.choice_text}
                            </div>
                        ))}

                        {data.choices?.length > 4 && (
                        <div className="option-chip more-chip">
                            +{data.choiced?.length - 3} more
                        </div>
                        )}
                        </div> */}
                    </div>
                      )}

                      {data.question_type === "multiplechoice" && (
        
                        <div className="question-preview-card" onClick={
                          ()=>{
                            const QaData = {
                                     question_id : data.id,
                                    title : data.title,
                                    include_all_above : data.include_all_above,
                                    choices: 
                                      data.choices?.map(c => ({
                                        choice_text: c.choice_text,
                                        multiplechoice_id: c.multiplechoice_id,
                                        id: c.id,
                                        question_id: c.question_id
                                      }))
                                     || []
                                  }
                            sessionStorage.setItem("QaStore", JSON.stringify(QaData));
                            navigate(`/answer/${post.id}/${data.id}/multiplechoice`);
                          }
                        }>
        
                        <div className="question-preview-header">
                            <span className="question-badge multiple-badge">
                             <FontAwesomeIcon icon={faHandPeace} /> Pick Multiple
                            </span>
                              <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                          </div>

                         {/* <div className="question-preview-options two-grid">
                            {data.choices?.slice(0, data.choices?.length > 4 ? 3 : 4)
                            .map((c, i) => (
                                <div key={i} className="option-chip">
                                {c.choice_text}
                                </div>
                            ))}

                            {data.choices?.length > 4 && (
                            <div className="option-chip more-chip">
                                +{data.choices?.length - 3} more
                            </div>
                            )}
                        </div> */}

                        <ul className ='choice-ul'>
                          {
                            data.choices?.slice(0, data.choices?.length > 4 ? 3 : 4).map((c,i) => (
                              <li key={i} className ='choice-li'>
                                <BorderOutlined className='tool-answer-icon'/>  {c.choices_text}
                              </li> 
                            ))
                          }
                          {data.choices?.length > 4 && (
                            <div className ='choice-li'>
                                <BorderOutlined className='tool-answer-icon'/> +{data.choices?.length - 3} more
                            </div>
                            )}
                        </ul>

                    </div>
                      )}

                      {data.question_type === "rankingorder" && (
                        <div className="question-preview-card" onClick={
                          ()=>{
                            const QaData = {
                                    question_id : data.id,
                                    title : data.title,
                                    items: 
                                      data.items?.map(c => ({
                                        item_text: c.item_text,
                                        position: c.position,
                                        id: c.id,
                                        ranking_id: c.ranking_id,
                                        question_id: c.question_id
                                      }))
                                     || []
                                  }
                            sessionStorage.setItem("QaStore", JSON.stringify(QaData));
                            navigate(`/answer/${post.id}/${data.id}/rankingorder`);
                          }
                        }>
                    <div className="question-preview-header">
                            <span className="question-badge rank-badge">
                              <FontAwesomeIcon icon={faHand} /> Move the Rankings
                            </span>
                              <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                          </div>

                          <div className="question-preview-options two-grid">
                                {data.items?.slice(0, data.items?.length > 4 ? 3 : 4)
                                    .map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="option-chip rank-chip"
                                    >
                                        <span className="rank-number">
                                        #{idx + 1}
                                        </span>

                                        <span className="rank-text">
                                        {item.item_text}
                                        </span>
                                    </div>
                                    ))}

                                {data.items?.length > 4 && (
                                    <div className="option-chip more-chip">
                                    +{data.items?.length - 3} more
                                    </div>
                                )}
                            </div>
                            <ul className='choice-ul'>
                              {data.items?.slice(0, data.items?.length > 4 ? 3 : 4).map((item, i) => (
                                <li className = 'choice-li'>
                                    {i + 1}. {item.item_text}
                                </li>
                              ))}
                              {data.items?.length > 4 && (
                                <li className = 'choice-li'>
                                  4. +{data.items?.length - 3} more
                                </li>
                              )}
                            </ul>
                    </div>
                      )}

                      {data.question_type === "rating" && (

                        <div className="question-preview-card" onClick={
                          ()=>{
                            const QaData = {
                                    // id: data.id,
                                     question_id : data.id,
                                    title : data.title,
                                    rating_icon_id: data.rating_icon_id
                                  }
                            sessionStorage.setItem("QaStore", JSON.stringify(QaData));
                            navigate(`/answer/${post.id}/${data.id}/rating`);
                          }
                        }>
                 <div className="question-preview-header">
                            <span className="question-badge rating-badge">
                              <FontAwesomeIcon icon={faStar} /> Rate
                            </span>
                              <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                          </div>
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
                        <div className="question-preview-card" onClick={
                          ()=>{
                            const QaData = {
                                    question_id : data.id,
                                    title : data.title
                                  }
                            sessionStorage.setItem("QaStore", JSON.stringify(QaData));
                            navigate(`/answer/${post.id}/${data.id}/openend`);
                          }
                        }>
                        <div className="question-preview-header question-preview-header-open-end">
                            <span className="question-badge openend-badge">
                               <SignatureOutlined /> Write Your Answer
                            </span>
                            <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                          </div>
                    </div>
                      )}
                  
              </div>
                <div className='post-caption' onClick={ () => {
                  // const newPost = 
                  //   { id: post.id,
                  //     post_type: post.post_type,
                  //     is_anonymous: post.is_anonymous || 0, anonymous_bg_color: post.anonymous_bg_color,
                  //     likes_count: post.likes_count || 0, comments_count: post.comments_count || 0, views_count: post.views_count || 0,
                  //     created_at: post.created_at,
                  //     username: post.is_anonymous === 1 ? post.anonymous_name : post.username,
                  //     tags: post.tags,
                  //     data:{
                  //       question_id:data.id,
                  //       question_type:data.question_type,
                  //       question_related_to:data.question_related_to,
                  //       title:data.title,
                  //       media_url:data.media_url,

                  //       // rating
                  //       rating_icon_id:data.rating_icon_id || null,

                  //       // range
                  //       range_min:data.range_min || null,
                  //       range_max:data.range_max || null,
                  //       default_range_value: data.default_range_value || null,
                  //       step: data.step || null,

                  //       // munltiple choice
                  //       choices: 
                  //         data.choices?.map(c => ({
                  //           choice_text: c.choice_text,
                  //           multiplechoice_id: c.multiplechoice_id,
                  //           id: c.id,
                  //           question_id: c.question_id
                  //         }))
                  //       || [],

                  //       // ranking
                  //       items: 
                  //         data.items?.map(c => ({
                  //           item_text: c.item_text,
                  //           position: c.position,
                  //           id: c.id,
                  //           ranking_id: c.ranking_id,
                  //           question_id: c.question_id
                  //         }))
                  //        || [],

                  //       // single choice
                  //       choice: 
                  //         data.choice?.map(c => ({
                  //           choice_text: c.choice_text,
                  //           singlechoice_id: c.singlechoice_id,
                  //           id: c.id,
                  //           question_id: c.question_id
                  //         }))
                  //       || [],
                  //     }
                  //   };
                  //   sessionStorage.setItem("post", JSON.stringify(newPost));

                    const HisData = {
                      id: post.id,
                      title: data.title,
                      mediaSrc : data.media_url,
                      author: post.is_anonymous === 1 ? post.anonymous_name : post.username,
                      authurPf: post.is_anonymous === 1 ? nahIdeaAuth : post.authorPf,
                      isAnonymous: post.is_anonymous,
                      anonymousBg: post.anonymous_bg_color,
                    }
                    const recentDataHis = JSON.parse(localStorage.getItem("recentPostHis")) || [];

                    let newList;
                    if (recentDataHis.some(item => item.id === post.id)) {
                      const raminData = recentDataHis.filter(item => item.id !== post.id);
                      newList = [HisData, ...raminData].slice(0, 50);
                    } else {
                      newList = [HisData, ...recentDataHis].slice(0, 50);
                    }

                    localStorage.setItem("recentPostHis", JSON.stringify(newList));
                    navigate(`/aboutpost/${post.id}`)
                  }}>
                  <p>{data.title}</p>
                </div>
            <div className="post-thumbnail">
              <div className="preview-wrapper"  style={{ "--preview-url": `url(${data.media_url})` }}>
                <img src={data.media_url} className="preview-image"/>
              </div>
              {/* <MediaPreview files={parseJSON(data.media_url)}/> */}
            </div>
          </>
        );

      default:
        return null;
    }
  };

const handleLike = async (postId, ownerId) => {
if (likingPosts.has(postId)) return;
setLikingPosts(prev => new Set(prev).add(postId));
  // optimistic update
  setPosts(prev =>
    prev.map(post => {

      if (post.id !== postId) return post;

      return {
        ...post,
        is_liked: !post.is_liked,
        likes_count: post.is_liked
          ? post.likes_count - 1
          : post.likes_count + 1
      };
    })
  );

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
    setPosts(prev =>
      prev.map(post => {

        if (post.id !== postId) return post;

        return {
          ...post,
          is_liked: !post.is_liked,
          likes_count: post.is_liked
            ? post.likes_count - 1
            : post.likes_count + 1
        };
      })
    );

    console.log(err);
  }
  finally {
  setLikingPosts(prev => {
    const next = new Set(prev);
    next.delete(postId);
    return next;
  });
}
}
const handleFavorite = async (postId) => {

  if (favoritingPosts.has(postId)) return;

  setFavoritingPosts(prev => new Set(prev).add(postId));

  // optimistic update
  setPosts(prev =>
    prev.map(post => {

      if (post.id !== postId) return post;

      return {
        ...post,
        is_favorited: !post.is_favorited
      };
    })
  );

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
    setPosts(prev =>
      prev.map(post => {

        if (post.id !== postId) return post;

        return {
          ...post,
          is_favorited: !post.is_favorited
        };
      })
    );

    console.log(err);

  } finally {

    setFavoritingPosts(prev => {

      const next = new Set(prev);

      next.delete(postId);

      return next;

    });
  }
};
const [hoveredPostId, setHoveredPostId] = useState(null);
  return (
    <div className='home-container'>
      <article id="feed-article">
        <DailyNews/>
  
            {error ? (
              <div className='error-container'>
                <Loader />
                <p>Opps! Failed to load</p>
              </div>
            ) : posts.length === 0 && !loading ? (
               <div className='error-container'>
                <Loader />
                <p>No posts found</p>
              </div>
            ) : (
              <>
                <List
                  dataSource={posts}
                  renderItem={(post) => (
                    <List.Item key={post.id}>
                      <div className="posts" onMouseEnter={() => setHoveredPostId(post.id)} onMouseLeave={() => setHoveredPostId(null)}>

                        <div className='post-header'>

                          <div className='post-user-profile'>

                            <div id="author-pf-div" style={{backgroundColor : post.is_anonymous === 1 ? post.anonymous_bg_color : ""}}>
                              <img src={post.is_anonymous === 1 ? nahIdeaAuth : post.avatar_url} id="author-pf"/>
                            </div>

                            <div className='user-post-info'>
                              <p className='post-username'>
                                {post.username} 
                                <div className='dot'></div>
                                <div className='category-post-div'>
                                  <span className="post-type-label">{post?.data?.type}</span> 
                                   {post?.data?.cate_icon && (
                                      <DisplayAnimatedIcon 
                                        src={post?.data?.cate_icon}
                                        isHovered={hoveredPostId === post.id}
                                      />
                                    )}
                                </div>
                              </p>
                              <p className='post-at'>{post.created_at}</p>
                            </div> 
                          </div>

                          <DotDropDown ownerId={post.user_id} post_type={post.post_type} post_id={post.id}
                                        page={page || 1} text_body={post?.data?.text_body || ""} contentId={post?.data?.id || 1}
                          />

                        </div>

                        <div className='post-body'>
                          {renderPostContent(post)}
                        </div>

                        <div className='post-footer'>
                            <div className='post-footer-left'>
                            <button
                                      className={`button-action-footer like-button ${
                                        post.is_liked ? "liked" : ""
                                      }`}
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleLike(post.id, post.user_id);
                                      }}
                                    >
                                      <motion.div
                                        className="action-icon-wrapper"
                                        whileTap={{ scale: 0.75 }}
                                        animate={
                                          likingPosts.has(post.id)
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

                                          {post.is_liked ? (

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
                                        <span>{post.likes_count}</span>
                                        <span className="count-label"> Like</span>
                                      </p>
                            </button>
                            
                       
                              <button className='button-action-footer'><FontAwesomeIcon icon={faMessage} className='button-action-footer-icon'/><p><span>{post.comments_count}</span><span className='count-label'> Comment</span></p></button>
                            </div>
                            <div className='post-footer-right'>
                              <button
  className={`button-action-footer button-action-footer-last favorite-button ${
    post.is_favorited ? "favorited" : ""
  }`}
  onClick={(e) => {
    e.preventDefault();
    handleFavorite(post.id);
  }}
>
  <motion.div
    className="action-icon-wrapper"
    whileTap={{ scale: 0.75 }}
    animate={
      favoritingPosts.has(post.id)
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

      {post.is_favorited ? (

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
                                {/* <button
                                    className={`button-action-footer button-action-footer-last favorite-button ${
                                      post.is_favorited ? "favorited" : ""
                                    }`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleFavorite(post.id);
                                    }}
                                    disabled={favoritingPosts.has(post.id)}
                                  >
                                    <div className="action-icon-wrapper">

                                      {favoritingPosts.has(post.id) ? (

                                        <LoaderCircle
                                          size={18}
                                          className="button-action-footer-icon loading-spin"
                                        />

                                      ) : (

                                        <Bookmark
                                          size={18}
                                          className={`button-action-footer-icon bookmark-icon ${
                                            post.is_favorited ? "bookmark-active" : ""
                                          }`}
                                          fill={post.is_favorited ? "currentColor" : "none"}
                                        />

                                      )}

                                    </div>
                                  </button> */}
                           
                            </div> 
                        </div>

                      </div>
                    </List.Item>
                  )}
                />

           
                {loading && (
                  <div className="nextPost-load-div">
                    <Loader />
                  </div>
                )}
              </>
            )}

      </article>

      <article id='his-article'>
        <RecentHistory />
        <MutualFriend onlineUsers={onlineUsers} />
        <Rule />    
      </article>

    </div>
   
  );
};

let scriptLoaded = false;

function DisplayAnimatedIcon({ src, isHovered }) {
  const [isValid, setIsValid] = useState(false);
  const [iconLoaded, setIconLoaded] = useState(false);

  // Load Lordicon script once globally
  useEffect(() => {
    if (!scriptLoaded && typeof window !== 'undefined') {
      const script = document.createElement("script");
      script.src = "https://cdn.lordicon.com/lordicon.js";
      script.async = true;
      document.body.appendChild(script);
      scriptLoaded = true;
    }
  }, []);

  // Load and validate icon JSON only when needed (on hover)
  useEffect(() => {
    if (!src || !isHovered || iconLoaded) return;

    let isMounted = true;
    
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid JSON");
        return res.json();
      })
      .then(() => {
        if (isMounted) {
          setIsValid(true);
          setIconLoaded(true);
        }
      })
      .catch(() => {
        if (isMounted) setIsValid(false);
      });

    return () => { isMounted = false; };
  }, [src, isHovered, iconLoaded]);

  // Don't render anything until hovered AND validated
  if (!isHovered || !isValid) return null;

  return (
    <lord-icon
      src={src}
      trigger="loop"
      delay="3000"
      style={{ width: "20px", height: "20px" }}
    />
  );
}