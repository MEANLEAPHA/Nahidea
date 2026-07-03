import React, { useState, useEffect } from "react";
import {useLocation, Outlet, useNavigate, useOutletContext} from 'react-router-dom';
import axios from "axios";
const token = localStorage.getItem("token");
import "../style/page/Accounts.css";
import gossiperlogo from "../img/gossiperlogo.png";
// antd
import { List, Card, Avatar, Typography, Tag, Space, Spin, Empty, Button, Dropdown, message} from "antd";
const { Title, Text } = Typography;
import {  PlusOutlined,UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,SearchOutlined, BellOutlined, QuestionOutlined,
          FormOutlined, MenuOutlined, SoundOutlined, LogoutOutlined, MoonFilled, SunFilled, ExceptionOutlined, QuestionCircleOutlined, 
          SettingOutlined, PlusSquareOutlined, SunOutlined, MoonOutlined, ReloadOutlined,FlagOutlined,LinkOutlined,DeleteOutlined,
          EditOutlined ,TagsOutlined,CloudUploadOutlined,LayoutOutlined,ArrowLeftOutlined,AppstoreOutlined, MailOutlined,
          ToolOutlined,
          CalendarOutlined,
      } from '@ant-design/icons';
import{SignatureOutlined, FolderOpenOutlined} from '@ant-design/icons';

// fontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
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
// import {DisplayAnimatedIcon} from "../util/upload/AnimatedIcon";

import MutualFriend from "../util/mutualFriend";
import RecentHistory from "../util/recentHistory";
import parseJSON from './util/parseJson';
import DotDropDown from "./util/dotDropDown";
import Loader from "./util/loader";

// img
import nahIdeaAuth from "../img/nahIdeaAuth.png";
// import nahideaTran from "../img/nahidea-tran.png";


// data
import { iconOptions } from "../data/post_type_data";

export default function Accounts() {
    const { state } = useLocation(); 
    const navigate = useNavigate();

    const { user, onlineUsers } = useOutletContext();

    // follow
    const [followState, setFollowState] =useState("follow");

    // loading
    const [loading, setLoading] = useState(false); 
    const [fetching, setFetching] = useState(false); 
    const [source, setSource] = useState("");
    const [error, setError] = useState(null);

    // pagination
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    // posts
    const [posts, setPosts] = useState([]);
    const [likingPosts, setLikingPosts] = useState(new Set());
    const [favoritingPosts, setFavoritingPosts] = useState(new Set());


    // data render
    const [usernames, setUsernames] = useState("");
    const [userId, setUserId] = useState("");
    const [nicknames, setNicknames] = useState("");
    const [avatar, setAvatar] = useState("");
    const [banner, setBanner] = useState("");
    const [workplace, setWorkplace] = useState("");
    const [bios, setBios] = useState("");
    const [professions, setProfessions] = useState("");
    const [followings, setFollowings] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [postCount, setPostCount] = useState(0);
    const [joinAt, setJoinAt] = useState("");

    const [isOwnProfile, setIsOwnProfile] = useState(false);

    useEffect(() => {
      // if state.userId exists, store it
      if (state?.userId) {
        sessionStorage.setItem("profileUserId", state.userId);
      }

      // fallback: use session value if state is missing
      const targetId = state?.userId || sessionStorage.getItem("profileUserId") || user?.id;

      // if (!targetId) {
        
      //   navigate(-1);
      //   return;
      // }

      setIsOwnProfile(String(targetId) === String(user?.id));

      fetchPosts(1, Number(targetId));
      setPage(1);
      fetchFollowStatus();
      handleFetchProfile(targetId);
    }, [state?.userId, user?.id]);


    const handleFetchProfile = async () => {
      try{
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/get-user-info/${state?.userId}`
        )
        const data = res.data.userData;
        setUsernames(data.username);
        setUserId(data.id);
        setNicknames(data.nickname);
        setAvatar(data.avatar_url);
        setBanner(data.banner_url);
        setWorkplace(data.work_location);
        setBios(data.bio);
        setProfessions(data.profession);
        setFollowings(data.following_count);
        setFollowers(data.followers_count);
        setPostCount(data.post_count || 0); 
        setJoinAt(data.created_at);
      }
      catch (err) {
        console.error(err);
      }
    };

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

    const fetchPosts = async (nextPage = 1, userId) => {
        if (fetching) return;
        try {
            setFetching(true);
            setLoading(true);

            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/user/${userId}/posts?page=${nextPage}`,
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

    const renderPostContent = (post) => {

    const data = post.data;

    if (!data) return <Text type="secondary">No Post yet</Text>;

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
    };

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

    const handleFollow = async () => {
      if ( followState === "loading" ) {
        return;
      }
      try {
        setFollowState("loading");

        if (
          followState === "follow" ||
          followState === "follows_you"
        ) {

          const res = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/add-follow/${state?.userId}`,
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          /*
          MUTUAL FOLLOW
          */

          if (res.data.mutual) {

            setFollowState("mutual");

          } else {

            setFollowState("following");

          }

          return;
        }


        if (
          followState === "following" ||
          followState === "mutual"
        ) {

          await axios.delete(
            `${import.meta.env.VITE_SERVER_URL}/api/unfollow/${state?.userId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          const res = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/follow-status/${state?.userId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          setFollowState(
            res.data.state
          );

        }

      } catch (err) {
        console.log(err);
        setFollowState("follow");
      }
    };

    const fetchFollowStatus = async () => {

        try {

          const res = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/follow-status/${state?.userId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          setFollowState(
            res.data.state
          );

        } catch (err) {

          console.log(err);

        }
    };

    const Unfollow = () => {
      const handleUnfollow = async () => {
        try{
          const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/unfollow/${state?.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = response.data;
          if(data.mutual === false){
            setFollowState("follow");
          }

        }
        catch(err){
          console.error('Full error:', err.response?.data); 
          console.error('Status:', err.response?.status);
        }
      }
      return(
        <button className="pf-act-btns" onClick={()=>{handleUnfollow()}}>
          Unfollow
        </button>
      )
    };

    const [hoveredPostId, setHoveredPostId] = useState(null);
  
  return (
    <div className="accounts-page">
      <div className="accounts-header">  
        <div id='acc-banner' style={{ "--preview-url-banner": `url(${banner || user?.banner_url || "https://nahidea.picocolor.site/img/content/1781684161514-Nahidea-Auth-bg.webp"})` }}>
            <img src={banner|| user?.banner_url || "https://nahidea.picocolor.site/img/content/1781684161514-Nahidea-Auth-bg.webp"} id="img-banner"/>
        </div>
        <div id='acc-pf-info'>
            <div className='acc-pf-info-child acc-pf-info-child-left'>
                <div id='acc-pf-div'>
                     <div className="status-pf-online"></div>
                    <img src={avatar || user?.avatar_url || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"} id='acc-pf'/>
                   
                </div>
                <div id="user-pf-iden">
                    <p id='username-pf'>
                        {usernames || user?.username || "N/A"}
                    </p>
                    <p id='user-profession-pf'>{professions || user?.profession || "N/A"} at {workplace || user?.work_location || "N/A"}</p>
                </div>
            </div>
            <div className='acc-pf-info-child acc-pf-info-child-right'>
                <div style={{display:'flex', gap:'8px'}}>

                  {
                    !isOwnProfile && (
                      <button className="pf-act-btn" type="button" onClick={()=> handleFollow()}>
                      { followState === "loading" && "Following..." }
                      { followState === "follow" && "Follow" }
                      { followState === "following" && ( <div style={{margin: 0, padding:0, height:'auto', display:'flex', gap:'10px'}}> <span style={{margin: 0}}>Following</span> <Unfollow/> </div> )}
                      { followState === "follows_you" && "Follow Back" }
                      { followState === "mutual" && ( <div style={{margin: 0, padding:0, height:'auto', display:'flex', gap:'10px'}}> <span style={{margin: 0}}>Friends</span><Unfollow/> </div>)}
                    </button>
                    ) 
                 } 
                {
                    !isOwnProfile && ( 
                      <button className='pf-act-btn' type="button" 
                       onClick={() => navigate('/chat', {state:{selected: followState === "mutual" ? 1 : 2, activeChat: {avatar_url: avatar, username: usernames, id: userId || state?.userId}}})}
                       >
                      <img src={gossiperlogo} className='sub-icon sub-icon-logo'/> Gossip</button>
                    )
                  }
                   {
                    !isOwnProfile && ( 
                      <button className='pf-act-btn' type="button" onClick={() => navigate('/spammy' , {
                        state: {
                          username: usernames,
                          id: userId || state?.userId,
                          avatar: avatar
                        }
                      })}><FontAwesomeIcon icon={faTriangleExclamation} fade style={{color: "rgb(255, 212, 59)",}} className='sub-icon'/> Send Spammy</button>
                      )
                   } 
                  {
                      isOwnProfile && (
                         <button className='pf-act-btn' type="button" onClick={()=>navigate('/editaccount', 
                          {state:
                             { username: user?.username, 
                               profession: user?.profession,
                               workplace: user?.work_location, 
                               bio: user?.bio, 
                               avatar: user?.avatar_url, 
                               avatarType: 
                                typeof user?.avatar_url === 'string' && user?.avatar_url.startsWith('https://api.dicebear.com') ? 'url' : 'file',
                               banner: user?.banner_url,
                               email: user?.email,
                               userId: user?.id,
                               nickname: user?.nickname
                              }}
                         )}><ToolOutlined /> Edit Profile</button>
                      )
                   }
                   
                </div>
                <MenuDropDown />
            </div>
            
        </div>
      </div>
      <div className="accounts-body">  
        <div id="data-outlet">
         {error ?
                    (  
                        <div className='error-container'>
                            <Loader />
                            <p>Opps! Failed to load</p>
                        </div>
                    ) 
                    :
                    posts.length === 0 && !loading ? 
                    (
                        <div className='error-container'>
                            <Loader />
                            <p>No posts found</p>
                        </div>
                    ) 
                    : 
                    (
                        <>
                            <List dataSource={posts} renderItem={(post) => (
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

                                            <DotDropDown 
                                                ownerId={post.user_id} post_type={post.post_type} post_id={post.id}
                                                text_body={post?.data?.text_body || ""} contentId={post?.data?.id || 1}
                                            />
                                        </div>

                                        <div className='post-body'>
                                            {renderPostContent(post)}
                                        </div>

                                        <div className='post-footer'>
                                            <div className='post-footer-left'>
                                                <button className={`button-action-footer like-button ${ post.is_liked ? "liked" : "" }`}
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
                                                <button className={`button-action-footer button-action-footer-last favorite-button ${ post.is_favorited ? "favorited" : "" }`}
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
                                    
                                            </div> 
                                        </div>
                                    </div>
                                </List.Item>
                            )}/>

                            {loading && (
                                <div className="nextPost-load-div">
                                    <Loader />
                                </div>
                            )}
                        </>
                    )
                }

        </div>

        
        <div id='data-full-info'>

          
          <h3 className='fri-list-label'>About {usernames || user?.username || "N/A"}</h3>
          <div id='user-bio'>
           
             <div id='stats-data'>
            <div className='stats-data-items'>
              <span className='data-render-stats'>{followers}</span>
                <span className='label-render-stats'>Followers</span>
                
            </div>
            <div className='stats-data-items'>
              <span className='data-render-stats'>{followings}</span>
                <span className='label-render-stats'>Following</span>
              
            </div>
            <div className='stats-data-items'>
              <span className='data-render-stats'>{postCount}</span>
                <span className='label-render-stats'>Posts</span>
                
            </div>
          </div>
             
            <p id='bio'><FontAwesomeIcon icon={faQuoteLeft} className='q-bio'/> {bios || user?.bio || "N/A"} <FontAwesomeIcon icon={faQuoteRight} className='q-bio'/> - @{nicknames || user?.nickname || "N/A"}</p>
            <p id='join-at'>  <CalendarOutlined /> Join at: {formatJoinDate(joinAt) || "N/A"}</p>
          </div>
          <FriendList targetUsername={usernames} tagetUserId={state?.userId || user?.id}/>

        </div>
      </div>
    </div>
  );
}
const formatJoinDate = (dateString) => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};


  const MenuDropDown = () =>{
    const navigate = useNavigate();
    const upload_items = [
      {
        label: (
          <li onClick={()=>navigate('/create/content')}>
            <FlagOutlined /> <span>Report User</span>
          </li>
        ),
        key: '0',
      },
      {
        label: (
          <li onClick={()=>navigate('/create/confession')}>
            <LinkOutlined /> <span>Copy Link</span>
          </li>
        ),
        key: '1',
      }
      ];
    return(
      <Dropdown menu={{ items: upload_items }} trigger={['click']} classNames={{ root: "profile-dropdown create-dropdown"}}>
        <button className='pf-act-btn menu-btn' type="button"><MenuOutlined /></button>
    </Dropdown>
    )
  }


const FriendList = ({targetUsername, tagetUserId}) => {
  const [friendList, setFriendList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useOutletContext();

  const fetchFriendList = async () => {
    try {
      setLoading(true);
      const targetUserId = state?.userId || user?.id;
      
      if (!targetUserId) {
        console.error("No user ID available");
        return;
      }

      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/get-friends-by-id/${targetUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (res.data.success) {
        setFriendList(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching friends:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendList();
  }, [state?.userId, user?.id]); // Fixed dependencies

  if (loading) {
    return (
      <div className='friend-list'>
        <div className='friend-list-header'>
          <h3 className='fri-list-label'>Friend List</h3>
        </div>
        <div className='friend-list-body'>
          <div className="loading-friends">Loading friends...</div>
        </div>
      </div>
    );
  }

  if (!friendList.length) {
    return null;
  }

  return (
    <div className='friend-list'>
      <div className='friend-list-header'>
        <h3 className='fri-list-label'>Friend List</h3>
        <button onClick={() => navigate('/friends', {state: {userId: tagetUserId || user?.id, username: targetUsername || user?.username}})} id='view-allfri-btn'>
          <span>View All</span>
        </button>
      </div>
      <div className='friend-list-body'>
        {friendList.map((friend, index) => (
          <div 
            className='friend-list-items' 
            key={friend.id || index}
            onClick={() => navigate(`/accounts`, { state: { userId: friend.id } })}
            style={{ cursor: 'pointer' }}
          >
            <img 
              src={friend.avatar_url || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"} 
              alt={friend.username}  
              className="fri-img" 
            />
            <div className='fri-name'>
              {friend.username}
            </div>              
          </div>
        ))}
      </div>
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