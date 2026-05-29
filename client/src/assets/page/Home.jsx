// react state
import React,{ useState, useEffect, useRef, memo, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from "axios";

// antd
import { List, Card, Avatar, Typography, Tag, Space, Spin, Empty, Button, Dropdown, message} from "antd";
const { Title, Text } = Typography;
import {  PlusOutlined,UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,SearchOutlined, BellOutlined, QuestionOutlined,
          FormOutlined, SoundOutlined, LogoutOutlined, MoonFilled, SunFilled, ExceptionOutlined, QuestionCircleOutlined, 
          SettingOutlined, PlusSquareOutlined, SunOutlined, MoonOutlined, ReloadOutlined,FlagOutlined,LinkOutlined,DeleteOutlined,
          EditOutlined ,TagsOutlined,CloudUploadOutlined,LayoutOutlined,ArrowLeftOutlined,AppstoreOutlined, MailOutlined,
      } from '@ant-design/icons';
import{SignatureOutlined, FolderOpenOutlined} from '@ant-design/icons';

// fontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot,faEllipsisVertical, faRetweet} from "@fortawesome/free-solid-svg-icons";
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
import{TagsPreview} from "../util/tagInput";
import {MoreFields, MarkdownPreview} from "../util/moreFlieds";
import {DisplayAnimatedIcon} from "../util/upload/AnimatedIcon";
import ReportPostModal from './ReportPostModal';


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

  // ex
  const [isAnonymous, setIsAnonymous] = useState(1);
  const [anonymousName, setAnonymousName] = useState("Anony972mous");
  const [anonymousBg, setAnonymousBg] = useState("yellowgreen");
  const [username, setUsername] = useState("Meanleap");


  // INITIAL LOAD
  useEffect(() => {
    fetchPosts(1);
    setPage(1);
  }, []);

  // SCROLL LISTENER
  useEffect(() => {
    const handleScroll = () => {
      if (
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
  }, [loading, fetching, hasMore]);

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

  // REFRESH
  const handleRefresh = () => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchPosts(1);
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
                  const newPost = 
                    { id: post.id,
                      post_type: post.post_type,
                      is_anonymous: post.is_anonymous || 0, anonymous_name: post.anonymous_name, anonymous_bg_color: post.anonymous_bg_color,
                      likes_count: post.likes_count || 0,comments_count: post.comments_count || 0, views_count: post.views_count || 0,
                      created_at:post.created_at,
                      username: post.is_anonymous === 1 ? post.anonymous_name : post.username,
                      tags:post.tags,
                      data:{
                        type:data.type,
                        title:data.title,
                        text_body:data.text_body,
                        media_url:data.media_url
                      }
                    };

                    sessionStorage.setItem("post", JSON.stringify(newPost));

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
                      const newPost = 
                        { id: post.id,
                          post_type: post.post_type,
                          anonymous_name: post.anonymous_name, is_anonymous: post.is_anonymous || 0,anonymous_bg_color: post.anonymous_bg_color,
                          likes_count: post.likes_count || 0, comments_count: post.comments_count || 0, views_count: post.views_count || 0,
                          created_at: post.created_at,
                          username: post.is_anonymous === 1 ? post.anonymous_name : post.username,
                          tags: post.tags,
                          data:{
                            type:data.type,
                            title:data.title,
                            media_url:data.media_url,
                          }
                        };
                      sessionStorage.setItem("post", JSON.stringify(newPost));

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
                {/* <MediaPreview files={parseJSON(data.media_url)}/> */}
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
                                    data.choice?.map(c => ({
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

                        <div className="question-preview-options two-grid">
                        {data.choice?.slice(0, data.choice?.length > 4 ? 3 : 4)
                        .map((c, i) => (
                            <div key={i} className="option-chip">
                            {c.choice_text}
                            </div>
                        ))}

                        {data.choice?.length > 4 && (
                        <div className="option-chip more-chip">
                            +{data.choice?.length - 3} more
                        </div>
                        )}

                        </div>
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

                         <div className="question-preview-options two-grid">
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

                        </div>
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
                  const newPost = 
                    { id: post.id,
                      post_type: post.post_type,
                      is_anonymous: post.is_anonymous || 0, anonymous_bg_color: post.anonymous_bg_color,
                      likes_count: post.likes_count || 0, comments_count: post.comments_count || 0, views_count: post.views_count || 0,
                      created_at: post.created_at,
                      username: post.is_anonymous === 1 ? post.anonymous_name : post.username,
                      tags: post.tags,
                      data:{
                        question_id:data.id,
                        question_type:data.question_type,
                        question_related_to:data.question_related_to,
                        title:data.title,
                        media_url:data.media_url,

                        // rating
                        rating_icon_id:data.rating_icon_id || null,

                        // range
                        range_min:data.range_min || null,
                        range_max:data.range_max || null,
                        default_range_value: data.default_range_value || null,
                        step: data.step || null,

                        // munltiple choice
                        choices: 
                          data.choices?.map(c => ({
                            choice_text: c.choice_text,
                            multiplechoice_id: c.multiplechoice_id,
                            id: c.id,
                            question_id: c.question_id
                          }))
                        || [],

                        // ranking
                        items: 
                          data.items?.map(c => ({
                            item_text: c.item_text,
                            position: c.position,
                            id: c.id,
                            ranking_id: c.ranking_id,
                            question_id: c.question_id
                          }))
                         || [],

                        // single choice
                        choice: 
                          data.choice?.map(c => ({
                            choice_text: c.choice_text,
                            singlechoice_id: c.singlechoice_id,
                            id: c.id,
                            question_id: c.question_id
                          }))
                        || [],
                      }
                    };
                    sessionStorage.setItem("post", JSON.stringify(newPost));

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
  return (
    <div className='home-container'>
      <article id="feed-article">
        <DailyNews/>
  
            {error ? (
              <div class='error-container'>
                <Loader />
                <p>Opps! Failed to load</p>
              </div>
            ) : posts.length === 0 && !loading ? (
               <div class='error-container'>
                <Loader />
                <p>No posts found</p>
              </div>
            ) : (
              <>
                <List
                  dataSource={posts}
                  renderItem={(post) => (
                    <List.Item key={post.id}>
                      <div className="posts">

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
                                    <DisplayAnimatedIcon src={post?.data?.cate_icon || 'https://cdn.lordicon.com/ulnswmkk.json'} />
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
        <div className='rule-absolute'>   
          <p onClick={()=>{navigate('/nahidearule')}}>Nahidea Rule</p>     
          <p onClick={()=>{navigate('/privacypolicy')}}>Private Policy</p>
          <p onClick={()=>{navigate('/useragreement')}}>User Agreement</p>
          <p onClick={()=>{navigate('/accessibility')}}>Accessibility</p>
          <div>
          <p>Nahidea. © 2026. All rights reserved </p>
          </div>
        </div>
             
      </article>

    </div>
   
  );
}

const Loader = () => {
  return(
     <div className="loader-container">
          <img src={nahideaTran} alt="Loading..." className="loader-img"/>
    </div>
  )
};

const DotDropDown = ({ ownerId, post_type, post_id, page, text_body, contentId }) => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [openReport, setOpenReport] = useState(false);

  const isOwner = Number(ownerId) === Number(user.id);

  const menuItemsForAll = [
    {
      label: (
        <li onClick={() => handleCopyLink(post_id)}>
          <LinkOutlined /> Copy link
        </li>
      ),
      key: "0",
    },
    {
      label: (
        <li onClick={() => setOpenReport(true)}>
          <FlagOutlined /> Report Post
          <ReportPostModal
            open={openReport}
            setOpen={setOpenReport}
            postId={post_id}
          />
        </li>
      ),
      key: "1",
    },
  ];

  const menuItemsForOwner = [
    post_type === "content" && {
      label: (
        <li
          onClick={(e) => {
            e.stopPropagation();
            navigate("/edit/content", {
              state: { postId: post_id, contentId, bodyText: text_body, page, mode: "edit" },
            });
          }}
        >
          <EditOutlined /> Edit Body
        </li>
      ),
      key: "0",
    },
    {
      label: (
        <li onClick={() => handleDeletePost(post_id)}>
          <DeleteOutlined /> Delete
        </li>
      ),
      key: "1",
    },
    {
      label: (
        <li onClick={() => handleCopyLink(post_id)}>
          <LinkOutlined /> Copy link
        </li>
      ),
      key: "2",
    },
    {
      label: (
        <li onClick={() => setOpenReport(true)}>
          <FlagOutlined /> Report Post
          <ReportPostModal
            open={openReport}
            setOpen={setOpenReport}
            postId={post_id}
          />
        </li>
      ),
      key: "3",
    },
  ].filter(Boolean);

  return (
    <Dropdown
      menu={{ items: isOwner ? menuItemsForOwner : menuItemsForAll }}
      trigger={["click"]}
      classNames={{ root: "profile-dropdown" }}
    >
      <div className="post-header-right">
        <FontAwesomeIcon icon={faEllipsisVertical} className="icon-formore" />
      </div>
    </Dropdown>
  );
};


const handleDeletePost = async (postId) => {
  try {
    await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/delete-post/${postId}`,
       { headers: { Authorization: `Bearer ${token}` } });
    message.success("Post deleted successfully");
  } catch (err) {
    console.error(err);
    message.error("Failed to delete post");
  }
};
// copy fun
const handleCopyLink = async (postId) => {
  try {

    const postUrl = `https://nahidea.onrender.com/aboutpost/${postId}`;

    await navigator.clipboard.writeText(postUrl);

    message.success("Link copied successfully");

  } catch (err) {

    console.error(err);

    message.error("Failed to copy link");
  }
};

// Function covert string to array
const parseJSON = (val) => {
  try {
    if (typeof val === "string") {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
    // if it's already an array, keep it; if it's a single value, wrap it
    return Array.isArray(val) ? val : [val];
  } catch {
    // if JSON.parse fails, just wrap the raw string
    return [val];
  }
};



const RecentHistory = () => {
  const [recentDataHis, setRecentDataHis] = useState([]);

  useEffect(() => {
    const postData = JSON.parse(localStorage.getItem("recentPostHis")) || [];
    setRecentDataHis(postData);
  }, []);

  if (recentDataHis.length === 0) {
    return null;
  }

  const handleClearPostHistory = () => {
    localStorage.setItem("recentPostHis", JSON.stringify([]));
    setRecentDataHis([]);
  };

  const deletePostHistory = (postId) => {
    const postData = JSON.parse(localStorage.getItem("recentPostHis")) || [];
    const update = postData.filter((item) => item.id !== postId);
    localStorage.setItem("recentPostHis", JSON.stringify(update));
    setRecentDataHis(update);
  };

  return (
    <div className="history-container">
      <div className="history-container-header">
        <label>Recent History</label>
        <span onClick={handleClearPostHistory}>Clear All</span>
      </div>

      <div className="history-list-ul">
        {recentDataHis.map((item) => (
          <PostHistoryCard
            key={item.id}
            item={item}
            deletePostHistory={deletePostHistory}
          />
        ))}
      </div>
    </div>
  );
};

const PostHistoryCard = ({ item, deletePostHistory }) => {
  // Safe image renderer
  let safeImg = null;
  try {
    if (typeof item.mediaSrc === "string") {
      if (item.mediaSrc.trim().startsWith("[")) {
        const arr = JSON.parse(item.mediaSrc);
        if (Array.isArray(arr) && arr.length > 0) {
          safeImg = arr[0];
        }
      } else {
        safeImg = item.mediaSrc;
      }
    }
  } catch (err) {
    console.warn("Invalid mediaSrc format", err);
  }

  return (
    <div className="post-history-card">
      <div className="post-history-card-info">
        <div id="author-info">
          <div
            id="author-pf-div"
            style={{
              backgroundColor: item.isAnonymous === 1 ? item.anonymousBg : "",
            }}
          >
            <img
              src={item.isAnonymous === 1 ? nahIdeaAuth : item.authurPf || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"}
              alt="user-profile"
              id="author-pf"
            />
          </div>
          <p id="author-name">{item.author}</p>
        </div>
        <div id="title-div">
          <p id="title">{item.title}</p>
        </div>
        {/* <button
          id="history-card-delete"
          onClick={() => deletePostHistory(item.id)}
        >
          Delete
        </button> */}
      </div>

      {safeImg && (
        <div
          className="media-holder"
          style={{ "--preview-url-history-post": `url(${safeImg})` }}
        >
          <img src={safeImg} alt="post-media" />
        </div>
      )}
    </div>
  );
};


const MutualFriend = ({ onlineUsers }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchMutualFriends = async () => {
      try {
        console.log("Fetching mutual friends…"); // 👀 start log
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/get-mutuals`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API response:", res); // 👀 full response
        console.log("Mutual friends data:", res.data.data); // 👀 extracted data
        setFriends(res.data.data);
      } catch (err) {
        console.error("Failed to fetch mutual friends:", err); // 👀 error log
      }
    };

    fetchMutualFriends();
  }, []);

  if (friends.length === 0) {
    console.log("No mutual friends found."); // 👀 log empty state
    return null;
  }

  return (
    <div className="friend-container">
      <div className="friend-header-card">
        <label>Friend</label>
        <span>see all</span>
      </div>
      <div className="friend-list-ul">
        {friends?.map((friend) => (
          <FriendCard
            key={friend.id}
            username={friend.username}
            avatar_url={friend.avatar_url}
            isOnline={onlineUsers.includes(String(friend.id))}
          />
        ))}
      </div>
    </div>
  );
};


// FriendCard.jsx
const FriendCard = ({ username, avatar_url, isOnline }) => {
  console.log("Rendering FriendCard:", { username, avatar_url, isOnline });
  return (
    <div className="friend-card">
      <div className="friend-pf-div">
        <img src={avatar_url || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"} alt={username} className="friend-pf" />
        {isOnline ? (
          <div className="online-dot status-fri-dot"></div>
        ) : (
          <div className="offline-dot status-fri-dot"></div>
        )}
      </div>
      <div className="friend-info">
        <span>{username}</span>
      </div>
    </div>
  );
};



 

// const MutualFriend = () => {
//   return(
//     <div className='friend-container'> 
//       <div className='friend-header-card'>
//         <label>Friend</label>
//         <span>see all</span>
//       </div>
//       <div className='friend-list-ul'>
//         <div className='friend-card'>
//            <div className='friend-pf-div'>
//               <img src="https://api.dicebear.com/9.x/adventurer/svg?seed=Felix" alt="" className='friend-pf'/>
//               <div className='online-dot status-fri-dot'></div>
//               {/* <div className='offline-dot status-fri-dot'></div> */}
//            </div>
//            <div className='friend-info'>
//               <span>Kathya</span>
//            </div>
//         </div>
//          <div className='friend-card'>
//            <div className='friend-pf-div'>
//               <img src="https://api.dicebear.com/9.x/adventurer/svg?seed=Felix" alt="" className='friend-pf'/>
//               <div className='online-dot status-fri-dot'></div>
//               {/* <div className='offline-dot status-fri-dot'></div> */}
//            </div>
//            <div className='friend-info'>
//               <span>Kathya</span>
//            </div>
//         </div>
//          <div className='friend-card'>
//            <div className='friend-pf-div'>
//               <img src="https://api.dicebear.com/9.x/adventurer/svg?seed=Felix" alt="" className='friend-pf'/>
//               <div className='online-dot status-fri-dot'></div>
//               {/* <div className='offline-dot status-fri-dot'></div> */}
//            </div>
//            <div className='friend-info'>
//               <span>Kathya</span>
//            </div>
//         </div>
//          <div className='friend-card'>
//            <div className='friend-pf-div'>
//               <img src="https://api.dicebear.com/9.x/adventurer/svg?seed=Felix" alt="" className='friend-pf'/>
//               <div className='online-dot status-fri-dot'></div>
//               {/* <div className='offline-dot status-fri-dot'></div> */}
//            </div>
//            <div className='friend-info'>
//               <span>Kathya</span>
//            </div>
//         </div>

        
         
//       </div>
//     </div>
//   )
// }

// const postHistoryCard = (item) => {
//   const deletePostHistory = (postId) => {
//     const postData = JSON.parse(localStorage.getItem("recentPostHis")) || [];
//     const update = postData.filter((item) => item.postId !== postId);
//     localStorage.setItem("recentPostHis", JSON.stringify(update));
//     setRecentDataHis(update);
//   }
//   return (
//       <div className="post-history-card" key={item.postId}>
//         <div className='post-history-card-info'>
//             <div id="author-info">
//               <div id="author-pf-div" style={{backgroundColor : item.isAnonymous === 1 ? item.anonymousBg : ""}}>
//                     <img src={item.isAnonymous === 1 ? nahIdeaAuth : item.authorPf} alt="user-profile" id="author-pf"/>
//               </div>
//               <p id="author-name">{item.author}</p>
//             </div>
//             <div id="title-div">
//               <p id="title">
//                 {item.title}
//               </p>
//             </div>
//             <button id="history-card-delete" onClick={() => {deletePostHistory(item.postId)}}>Delete</button>
//           </div>
//           {item.imgSrc && (
//             <div className="media-holder" style={{ "--preview-url-history-post": `url(${item.imgSrc})` }}>
//               <img src={item.imgSrc}/> 
//             </div>
//           )}
//       </div>
//   )
// }






// const parseJSON = (val) => {
//   try {
//     return typeof val === "string" ? JSON.parse(val) : val;
//   } catch {
//     return [];
//   }
// };


  // <div class="ant-list ant-list-split css-ch9ese css-var-root">
  //         <div class="ant-spin css-ch9ese css-var-root" aria-live="polite" aria-busy="false">
  //           <div class="ant-spin-container">
  //             <ul class="ant-list-items ant-list-container css-var-root">
  //               <li className="ant-list-item">
  //               <div className="posts">
  //                 <div className="post-header">
  //                   <div className="post-user-profile">
  //                     <img
  //                       className="user-profile"
  //                       alt="profile"
  //                       src="https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif"
  //                     />
  //                     <div className="user-post-info">
  //                       <p className="post-username">
  //                         meanleapha <div className='dot'></div> <div className='category-post-div'><span className="post-type-label">post a content</span> <AnimatedIcon src="https://cdn.lordicon.com/hbvgknxo.json" /></div>
  //                       </p>
  //                       <p className="post-at">2 days ago</p>
  //                     </div>
  //                   </div>
  //                   <div className="ant-dropdown-trigger post-header-right">
  //                     <svg
  //                       data-prefix="fas"
  //                       data-icon="ellipsis-vertical"
  //                       className="svg-inline--fa fa-ellipsis-vertical icon-formore"
  //                       role="img"
  //                       viewBox="0 0 128 512"
  //                       aria-hidden="true"
  //                     >
  //                       <path
  //                         fill="currentColor"
  //                         d="M64 144a56 56 0 1 1 0-112 56 56 0 1 1 0 112zm0 224c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56zm56-112c0 30.9-25.1 56-56 56s-56-25.1-56-56 25.1-56 56-56 56 25.1 56 56z"
  //                       ></path>
  //                     </svg>
  //                   </div>
  //                 </div>
  //                 <div className="post-body">
  //                   <div>
  //                     <div className="post-caption">
  //                       <p>
  //                         Roommate MIA(LITERALLY NO WHERE TO BE SEEN) for almost 3 years, pays rent 95% of
  //                         the time, cant get a hold of them, what are my options?
  //                       </p>
  //                     </div>
  //                   </div>
  //                   <div className="post-thumbnail">
  //                     <div className="ant-carousel css-ch9ese css-var-root">
  //                       <div className="slick-slider media-preview-carousel slick-initialized">
  //                         <div className="slick-list">
  //                           <div
  //                             className="slick-track"
  //                             style={{
  //                               opacity: 1,
  //                               transform: "translate3d(0px, 0px, 0px)",
  //                               width: "375px",
  //                             }}
  //                           >
  //                             <div
  //                               data-index="0"
  //                               className="slick-slide slick-active slick-current"
  //                               tabIndex="-1"
  //                               aria-hidden="false"
  //                               style={{ outline: "none", width: "375px" }}
  //                             >
  //                               <div>
  //                                 <div
  //                                   className="carousel-slide"
  //                                   tabIndex="-1"
  //                                   style={{ width: "100%", display: "inline-block" }}
  //                                 >
  //                                   <div
  //                                     className="preview-wrapper"
  //                                     style={{
  //                                       "--preview-url":
  //                                         "url(https://nahidea.picocolor.site/img/content/1777366039374-Screenshot-2026-03-17-142905.webp)",
  //                                     }}
  //                                   >
  //                                     <img
  //                                       alt="preview-0"
  //                                       className="preview-image"
  //                                       src="https://nahidea.picocolor.site/img/content/1777366039374-Screenshot-2026-03-17-142905.webp"
  //                                     />
  //                                   </div>
  //                                 </div>
  //                               </div>
  //                             </div>
  //                           </div>
  //                         </div>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //                 <div className="post-footer">
  //                   <div className="post-footer-left">
  //                     <button className="button-action-footer">
  //                       <svg
  //                         data-prefix="far"
  //                         data-icon="heart"
  //                         className="svg-inline--fa fa-heart button-action-footer-icon"
  //                         role="img"
  //                         viewBox="0 0 512 512"
  //                         aria-hidden="true"
  //                       >
  //                         <path
  //                           fill="currentColor"
  //                           d="M378.9 80c-27.3 0-53 13.1-69 35.2l-34.4 47.6c-4.5 6.2-11.7 9.9-19.4 9.9s-14.9-3.7-19.4-9.9l-34.4-47.6c-16-22.1-41.7-35.2-69-35.2-47 0-85.1 38.1-85.1 85.1 0 49.9 32 98.4 68.1 142.3 41.1 50 91.4 94 125.9 120.3 3.2 2.4 7.9 4.2 14 4.2s10.8-1.8 14-4.2c34.5-26.3 84.8-70.4 125.9-120.3 36.2-43.9 68.1-92.4 68.1-142.3 0-47-38.1-85.1-85.1-85.1zM271 87.1c25-34.6 65.2-55.1 107.9-55.1 73.5 0 133.1 59.6 133.1 133.1 0 68.6-42.9 128.9-79.1 172.8-44.1 53.6-97.3 100.1-133.8 127.9-12.3 9.4-27.5 14.1-43.1 14.1s-30.8-4.7-43.1-14.1C176.4 438 123.2 391.5 79.1 338 42.9 294.1 0 233.7 0 165.1 0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1l15 20.7 15-20.7z"
  //                         ></path>
  //                       </svg>
  //                       <p>
  //                         <span>0</span>
  //                         <span className="count-label"> Like</span>
  //                       </p>
  //                     </button>
  //                     <button className="button-action-footer">
  //                       <svg
  //                         data-prefix="far"
  //                         data-icon="message"
  //                         className="svg-inline--fa fa-message button-action-footer-icon"
  //                         role="img"
  //                         viewBox="0 0 512 512"
  //                         aria-hidden="true"
  //                       >
  //                         <path
  //                           fill="currentColor"
  //                           d="M203.7 512.9s0 0 0 0l-37.8 26.7c-7.3 5.2-16.9 5.8-24.9 1.7S128 529 128 520l0-72-32 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l320 0c53 0 96 43 96 96l0 224c0 53-43 96-96 96l-120.4 0-91.9 64.9zm64.3-104.1c8.1-5.7 17.8-8.8 27.7-8.8L416 400c26.5 0 48-21.5 48-48l0-224c0-26.5-21.5-48-48-48L96 80c-26.5 0-48 21.5-48 48l0 224c0 26.5 21.5 48 48 48l56 0c10.4 0 19.3 6.6 22.6 15.9 .9 2.5 1.4 5.2 1.4 8.1l0 49.7c32.7-23.1 63.3-44.7 91.9-64.9z"
  //                         ></path>
  //                       </svg>
  //                       <p>
  //                         <span>0</span>
  //                         <span className="count-label"> Comment</span>
  //                       </p>
  //                     </button>
  //                   </div>
  //                   <div className="post-footer-right">
  //                     <div className='button-action-footer button-action-footer-last post-type' style={{background: 'violet'}}>Confession</div>
  //                     <button className="button-action-footer button-action-footer-last">
  //                       <svg
  //                         data-prefix="far"
  //                         data-icon="bookmark"
  //                         className="svg-inline--fa fa-bookmark" role="img" viewBox="0 0 384 512" aria-hidden="true"><path fill="currentColor" d="M0 64C0 28.7 28.7 0 64 0L320 0c35.3 0 64 28.7 64 64l0 417.1c0 25.6-28.5 40.8-49.8 26.6L192 412.8 49.8 507.7C28.5 521.9 0 506.6 0 481.1L0 64zM64 48c-8.8 0-16 7.2-16 16l0 387.2 117.4-78.2c16.1-10.7 37.1-10.7 53.2 0L336 451.2 336 64c0-8.8-7.2-16-16-16L64 48z">
  //                         </path>
  //                         </svg>
  //                         </button>
  //                         </div>
  //                         </div>
  //                         </div>
  //                 </li>
  //               <li class="ant-list-item">
  //                 <div class="posts">
  //                   <div class="post-header">
  //                     <div class="post-user-profile">
  //                       <img class="user-profile" alt="profile"
  //                           src="https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif"/>
  //                       <div class="user-post-info">
  //                         <p class="post-username">
  //                           meanleapha <span class="post-type-label">post a question</span>
  //                         </p>
  //                         <p class="post-at">17 hours ago</p>
  //                       </div>
  //                     </div>
  //                     <div class="ant-dropdown-trigger post-header-right">
                      
  //                     </div>
  //                   </div>
  //                   <div class="post-body">
  //                     <div class="post-caption">
  //                       <p>saca</p>
  //                     </div>
  //                     <div class="post-thumbnail">
  //                       <img alt="Confession" class="post-image"
  //                           src="https://nahidea.picocolor.site/img/question/1777019798059-Screenshot 2025-12-02 140744.webp"/>
  //                     </div>
  //                   </div>
  //                   <div class="post-footer">
  //                     <div class="post-footer-left">
                        
  //                     </div>
  //                     <div class="post-footer-right">
                      
  //                     </div>
  //                   </div>
  //                 </div>
  //               </li>
  //               <li class="ant-list-item">
  //       <div class="posts">
  //         <div class="post-header">
  //           <div class="post-user-profile">
  //             <img class="user-profile" alt="profile"
  //                 src="https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif" />
  //             <div class="user-post-info">
  //               <p class="post-username">
  //                 meanleapha <span class="post-type-label">post a question</span>
  //               </p>
  //               <p class="post-at">17 hours ago</p>
  //             </div>
  //           </div>
  //           <div class="ant-dropdown-trigger post-header-right">
  //             <svg data-prefix="fas" data-icon="ellipsis-vertical"
  //                 class="svg-inline--fa fa-ellipsis-vertical icon-formore"
  //                 role="img" viewBox="0 0 128 512" aria-hidden="true">
  //               <path fill="currentColor"
  //                     d="M64 144a56 56 0 1 1 0-112 56 56 0 1 1 0 112zm0 224c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56zm56-112c0 30.9-25.1 56-56 56s-56-25.1-56-56 25.1-56 56-56 56 25.1 56 56z">
  //               </path>
  //             </svg>
  //           </div>
  //         </div>

  //         <div class="post-body">
  //           <div>
  //             <div class="post-caption">
  //               <p>saca</p>
  //             </div>
  //             <div class="post-question-answer-preview"></div>
  //           </div>
  //           <div class="post-thumbnail">
  //             <div class='preview-wrapper' >
  //                   <img alt="Confession" class="preview-image"
  //                 src="https://nahidea.picocolor.site/img/question/1777019798059-Screenshot 2025-12-02 140744.webp" />
  //             </div>
            
  //           </div>
  //         </div>

  //         <div class="post-footer">
  //           <div class="post-footer-left">
  //             <button class="button-action-footer">
  //               <svg data-prefix="far" data-icon="heart"
  //                   class="svg-inline--fa fa-heart button-action-footer-icon"
  //                   role="img" viewBox="0 0 512 512" aria-hidden="true">
  //                 <path fill="currentColor"
  //                       d="M378.9 80c-27.3 0-53 13.1-69 35.2l-34.4 47.6c-4.5 6.2-11.7 9.9-19.4 9.9s-14.9-3.7-19.4-9.9l-34.4-47.6c-16-22.1-41.7-35.2-69-35.2-47 0-85.1 38.1-85.1 85.1 0 49.9 32 98.4 68.1 142.3 41.1 50 91.4 94 125.9 120.3 3.2 2.4 7.9 4.2 14 4.2s10.8-1.8 14-4.2c34.5-26.3 84.8-70.4 125.9-120.3 36.2-43.9 68.1-92.4 68.1-142.3 0-47-38.1-85.1-85.1-85.1zM271 87.1c25-34.6 65.2-55.1 107.9-55.1 73.5 0 133.1 59.6 133.1 133.1 0 68.6-42.9 128.9-79.1 172.8-44.1 53.6-97.3 100.1-133.8 127.9-12.3 9.4-27.5 14.1-43.1 14.1s-30.8-4.7-43.1-14.1C176.4 438 123.2 391.5 79.1 338 42.9 294.1 0 233.7 0 165.1 0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1l15 20.7 15-20.7z">
  //                 </path>
  //               </svg>
  //               <p><span>0</span><span class="count-label"> Like</span></p>
  //             </button>

  //             <button class="button-action-footer">
  //               <svg data-prefix="far" data-icon="message"
  //                   class="svg-inline--fa fa-message button-action-footer-icon"
  //                   role="img" viewBox="0 0 512 512" aria-hidden="true">
  //                 <path fill="currentColor"
  //                       d="M203.7 512.9s0 0 0 0l-37.8 26.7c-7.3 5.2-16.9 5.8-24.9 1.7S128 529 128 520l0-72-32 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l320 0c53 0 96 43 96 96l0 224c0 53-43 96-96 96l-120.4 0-91.9 64.9zm64.3-104.1c8.1-5.7 17.8-8.8 27.7-8.8L416 400c26.5 0 48-21.5 48-48l0-224c0-26.5-21.5-48-48-48L96 80c-26.5 0-48 21.5-48 48l0 224c0 26.5 21.5 48 48 48l56 0c10.4 0 19.3 6.6 22.6 15.9 .9 2.5 1.4 5.2 1.4 8.1l0 49.7c32.7-23.1 63.3-44.7 91.9-64.9z">
  //                 </path>
  //               </svg>
  //               <p><span>0</span><span class="count-label"> Comment</span></p>
  //             </button>
  //           </div>

  //           <div class="post-footer-right">
  //             <button class="button-action-footer button-action-footer-last">
  //               <svg data-prefix="far" data-icon="bookmark"
  //                   class="svg-inline--fa fa-bookmark"
  //                   role="img" viewBox="0 0 384 512" aria-hidden="true">
  //                 <path fill="currentColor"
  //                       d="M0 64C0 28.7 28.7 0 64 0L320 0c35.3 0 64 28.7 64 64l0 417.1c0 25.6-28.5 40.8-49.8 26.6L192 412.8 49.8 507.7C28.5 521.9 0 506.6 0 481.1L0 64zM64 48c-8.8 0-16 7.2-16 16l0 387.2 117.4-78.2c16.1-10.7 37.1-10.7 53.2 0L336 451.2 336 64c0-8.8-7.2-16-16-16L64 48z">
  //                 </path>
  //               </svg>
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //               </li>
  //               <li class="ant-list-item">
  //                 <div class="posts">
  //                   <div class="post-header">
  //                     <div class="post-user-profile">
  //                       <img class="user-profile" alt="profile"
  //                           src="https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif" />
  //                       <div class="user-post-info">
  //                         <p class="post-username">
  //                           meanleapha <span class="post-type-label">post a question</span>
  //                         </p>
  //                         <p class="post-at">1 day ago</p>
  //                       </div>
  //                     </div>
  //                     <div class="ant-dropdown-trigger post-header-right">
  //                       <svg data-prefix="fas" data-icon="ellipsis-vertical"
  //                           class="svg-inline--fa fa-ellipsis-vertical icon-formore"
  //                           role="img" viewBox="0 0 128 512" aria-hidden="true">
  //                         <path fill="currentColor"
  //                               d="M64 144a56 56 0 1 1 0-112 56 56 0 1 1 0 112zm0 224c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56zm56-112c0 30.9-25.1 56-56 56s-56-25.1-56-56 25.1-56 56-56 56 25.1 56 56z">
  //                         </path>
  //                       </svg>
  //                     </div>
  //                   </div>

  //                   <div class="post-body">
  //                     <div>
  //                       <div class="post-caption">
  //                         <p>openend</p>
  //                       </div>
  //                       <div class="post-question-answer-preview"></div>
  //                     </div>
  //                     <div class="post-thumbnail">
  //                       <div class='preview-wrapper'>
  //                               <img alt="Confession" class="preview-image "
  //                           src="https://nahidea.picocolor.site/img/question/1776954811499-Screenshot 2025-12-11 105456.webp" />
  //                       </div>
                  
  //                     </div>
  //                   </div>

  //                   <div class="post-footer">
  //                     <div class="post-footer-left">
  //                       <button class="button-action-footer">
  //                         <svg data-prefix="far" data-icon="heart"
  //                             class="svg-inline--fa fa-heart button-action-footer-icon"
  //                             role="img" viewBox="0 0 512 512" aria-hidden="true">
  //                           <path fill="currentColor"
  //                                 d="M378.9 80c-27.3 0-53 13.1-69 35.2l-34.4 47.6c-4.5 6.2-11.7 9.9-19.4 9.9s-14.9-3.7-19.4-9.9l-34.4-47.6c-16-22.1-41.7-35.2-69-35.2-47 0-85.1 38.1-85.1 85.1 0 49.9 32 98.4 68.1 142.3 41.1 50 91.4 94 125.9 120.3 3.2 2.4 7.9 4.2 14 4.2s10.8-1.8 14-4.2c34.5-26.3 84.8-70.4 125.9-120.3 36.2-43.9 68.1-92.4 68.1-142.3 0-47-38.1-85.1-85.1-85.1zM271 87.1c25-34.6 65.2-55.1 107.9-55.1 73.5 0 133.1 59.6 133.1 133.1 0 68.6-42.9 128.9-79.1 172.8-44.1 53.6-97.3 100.1-133.8 127.9-12.3 9.4-27.5 14.1-43.1 14.1s-30.8-4.7-43.1-14.1C176.4 438 123.2 391.5 79.1 338 42.9 294.1 0 233.7 0 165.1 0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1l15 20.7 15-20.7z">
  //                           </path>
  //                         </svg>
  //                         <p><span>0</span><span class="count-label"> Like</span></p>
  //                       </button>

  //                       <button class="button-action-footer">
  //                         <svg data-prefix="far" data-icon="message"
  //                             class="svg-inline--fa fa-message button-action-footer-icon"
  //                             role="img" viewBox="0 0 512 512" aria-hidden="true">
  //                           <path fill="currentColor"
  //                                 d="M203.7 512.9s0 0 0 0l-37.8 26.7c-7.3 5.2-16.9 5.8-24.9 1.7S128 529 128 520l0-72-32 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l320 0c53 0 96 43 96 96l0 224c0 53-43 96-96 96l-120.4 0-91.9 64.9zm64.3-104.1c8.1-5.7 17.8-8.8 27.7-8.8L416 400c26.5 0 48-21.5 48-48l0-224c0-26.5-21.5-48-48-48L96 80c-26.5 0-48 21.5-48 48l0 224c0 26.5 21.5 48 48 48l56 0c10.4 0 19.3 6.6 22.6 15.9 .9 2.5 1.4 5.2 1.4 8.1l0 49.7c32.7-23.1 63.3-44.7 91.9-64.9z">
  //                           </path>
  //                         </svg>
  //                         <p><span>0</span><span class="count-label"> Comment</span></p>
  //                       </button>
  //                     </div>

  //                     <div class="post-footer-right">
  //                       <button class="button-action-footer button-action-footer-last">
  //                         <svg data-prefix="far" data-icon="bookmark"
  //                             class="svg-inline--fa fa-bookmark"
  //                             role="img" viewBox="0 0 384 512" aria-hidden="true">
  //                           <path fill="currentColor"
  //                                 d="M0 64C0 28.7 28.7 0 64 0L320 0c35.3 0 64 28.7 64 64l0 417.1c0 25.6-28.5 40.8-49.8 26.6L192 412.8 49.8 507.7C28.5 521.9 0 506.6 0 481.1L0 64zM64 48c-8.8 0-16 7.2-16 16l0 387.2 117.4-78.2c16.1-10.7 37.1-10.7 53.2 0L336 451.2 336 64c0-8.8-7.2-16-16-16L64 48z">
  //                           </path>
  //                         </svg>
  //                       </button>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </li>
  //             </ul>
  //           </div>
  //         </div>
  //       </div>










//   const DotDropDown = ({ownerId, post_type, post_id, page, text_body, contentId}) => {

  
//   const { userId } = useOutletContext();
//   const navigate = useNavigate();

//   const [openReport, setOpenReport] = useState(false);

//   const isOwner = Number(ownerId) === Number(userId);

//   const menuItemsForAll = [
//     {
//       label: (
//         <li onClick={() => handleCopyLink(post_id)}>
//           <LinkOutlined /> Copy link
//         </li>
//       ),
//       key: "0",
//     },
//     {
//       label: (
//          <li onClick={() => setOpenReport(true)}>
//           <FlagOutlined /> Report Post
//           <ReportPostModal
//             open={openReport}
//             setOpen={setOpenReport}
//             postId={post_id}
//           />
//         </li>
//       ),
//       key: "1",
//     }
//   ];
  
//   const menuItemsForOwner = [
//     {
//       label : (
//        post_type === "content" ? (
//         <li onClick={(e)=>
//                       {
//                         e.stopPropagation();
//                         navigate(`/edit/content`, 
//                           {
//                           state: {
//                             postId: post_id,
//                             contentId: contentId,
//                             bodyText: text_body,
//                             page: page,
//                             mode: "edit"
//                           }
//                         }
//                         );
//                       }
//                       }>
//          <EditOutlined />  Edit Content Body
//         </li>
//        ) : (
//         null
//        )
//       ),
//       key: "0"
//     },
//     {
//       label: (
//         <li onClick={() => handleDeletePost(post_id)}>
//           <DeleteOutlined /> Delete
//         </li>
//       ),
//       key: "1",
//     },
//     {
//       label: (
//         <li onClick={() => handleCopyLink(post_id)}>
//           <LinkOutlined /> Copy link
//         </li>
//       ),
//       key: "2",
//     },
//     {
//       label: (
//         <li onClick={() => setOpenReport(true)}>
//          <FlagOutlined /> Report Post
//          <ReportPostModal
//           open={openReport}
//           setOpen={setOpenReport}
//           postId={post_id}
//         />
//         </li>
//       ),
//       key: "3",
//     },
//   ];

//   return (
//     <Dropdown menu={{ items: isOwner ? menuItemsForOwner : menuItemsForAll }} trigger={["click"]} classNames={{ root: "profile-dropdown"}}>
//       <div className='post-header-right'>
//       <FontAwesomeIcon icon={faEllipsisVertical} className='icon-formore'/>
//       </div>
//     </Dropdown>
//   );
// };


// just add for testing