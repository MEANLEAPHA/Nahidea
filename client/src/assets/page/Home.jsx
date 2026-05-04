import React,{ useState, useEffect, useRef, memo } from 'react';
import axios from "axios";
import nahideaTran from "../img/nahidea-tran.png";
import { useNavigate } from "react-router-dom";
import {MediaPreview} from "../util/mediaUploader";
import{TagsPreview} from "../util/tagInput";
import {MoreFields, MarkdownPreview} from "../util/moreFlieds";
import "../style/page/Home.css";
 import "../style/upload/Postpreview.css";
 import "../style/upload/MultipleMedia.css";
import {
  List,
  Card,
  Avatar,
  Typography,
  Tag,
  Space,
  Spin,
  Empty,
  Button,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import nahIdeaAuth from "../img/nahIdeaAuth.png";

import { EditOutlined ,TagsOutlined,CloudUploadOutlined,LayoutOutlined,ArrowLeftOutlined,AppstoreOutlined, MailOutlined, SettingOutlined  } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot,faEllipsisVertical, faRetweet} from "@fortawesome/free-solid-svg-icons";
import { faBookmark, faCopy, faFlag, faHeart, faMessage, faPenToSquare, faTrashCan} from "@fortawesome/free-regular-svg-icons";

import {PlusOutlined,UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,SearchOutlined, BellOutlined, QuestionOutlined, FormOutlined, SoundOutlined, LogoutOutlined, MoonFilled, SunFilled, ExceptionOutlined, QuestionCircleOutlined, PlusSquareOutlined, SunOutlined, MoonOutlined} from '@ant-design/icons';
import { Dropdown } from 'antd';
const { Title, Text } = Typography;
const parseJSON = (val) => {
  try {
    return typeof val === "string" ? JSON.parse(val) : val;
  } catch {
    return [];
  }
};

export default function Home() {

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false); 
  const [fetching, setFetching] = useState(false); 
  const [source, setSource] = useState("");
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);



  // ex
  const [isAnonymous, setIsAnonymous] = useState(1);
  const [anonymousName, setAnonymousName] = useState("Anony972mous");
  const [anonymousBg, setAnonymousBg] = useState("yellowgreen");
  const [username, setUsername] = useState("Meanleap");
  const [userProfilePic, setUserProfilePic] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIMICmqUJvaXbGlMPkkTZdGfR_y1ptPhg7tg&s");

  // =====================
  // INITIAL LOAD
  // =====================

  useEffect(() => {
    fetchPosts(1);
    setPage(1);
  }, []);

  // =====================
  // SCROLL LISTENER
  // =====================

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        !fetching &&
        hasMore
      ) {
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

  // =====================
  // FETCH POSTS
  // =====================
  const fetchPosts = async (nextPage = 1) => {
    if (fetching) return;

    try {
      setFetching(true);
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/all-posts?page=${nextPage}`
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

  // =====================
  // REFRESH
  // =====================
  const handleRefresh = () => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchPosts(1);
  };


  
  // Content style
  const renderPostContent = (post) => {
    const data = post.data;

    if (!data) return <Text type="secondary">No content</Text>;

    switch (post.post_type) {
      case "content":
        return (
          <>
              <div>
                <div className='post-caption' onClick={()=>{
                  const newPost = 
                    { id: post.id,
                      post_type:post.post_type,
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
                  navigate(`/aboutpost/${post.id}`)
                }}>
                    <p>{data.title}</p>
                </div>
              </div>

              <div  className='post-thumbnail'>         
                <MediaPreview files={parseJSON(data.media_url)}/>
              </div>
          </>
        );

      case "confession":
        return (
          <>
              <div>
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
                      navigate(`/aboutpost?postId=${post.id}&author=${post.username}&title=${data.title}&postTags=${data.post_tags}&type=${data.type}&isAnonymous=${data.is_anonymous}`)
                    }}>
                    <p>{data.title}</p>
                </div>

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
            <div>
                <div className='post-caption' onClick={()=>{
                  const newPost = 
                    { id: post.id,
                      post_type: post.post_type,
                      is_anonymous: post.is_anonymous || 0, anonymous_bg_color: post.anonymous_bg_color,
                      likes_count: post.likes_count || 0, comments_count: post.comments_count || 0, views_count: post.views_count || 0,
                      created_at: post.created_at,
                      username: post.is_anonymous === 1 ? post.anonymous_name : post.username,
                      tags: post.tags,
                      data:{
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
                        choices: [
                          data.choices?.map((c, i) => ({
                            choice_text: c.choice_text,
                            multiplechoice_id: c.multiplechoice_id,
                            id: c.id,
                            question_id: c.question_id
                          }))
                        ] || [],

                        // ranking
                        items: [
                          data.items?.map((c, i) => ({
                            item_text: c.item_text,
                            position: c.position,
                            id: c.id,
                            ranking_id: c.ranking_id,
                            question_id: c.question_id
                          }))
                        ] || [],

                        // single choice
                        choices: [
                          data.choices?.map((c, i) => ({
                            choice_text: c.choice_text,
                            singlechoice_id: c.singlechoice_id,
                            id: c.id,
                            question_id: c.question_id
                          }))
                        ] || [],
                      }
                    };
                    sessionStorage.setItem("post", JSON.stringify(newPost));
                    navigate(`/aboutpost?postId=${post.id}&author=${post.username}&title=${data.title}&mediaUrl=${data.media_url}&postTags=${data.post_tags}&type=${data.type}&isAnonymous=${data.is_anonymous}`)
                  }}>
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
              {/* <div className='post-tags'>
                  <TagsPreview tagsValue={postTagsValue}/>
              </div> */}
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

      default:
        return null;
    }
  };

  return (
    <div className='home-container'>
       <article id="feed-article">
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
                                  {/* <img src='https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif' className="user-profile" alt="profile" /> */}
                                  <div id="author-pf-div" style={{backgroundColor : post.is_anonymous === 1 ? post.anonymous_bg_color : ""}}>
                                    <img src={post.is_anonymous === 1 ? nahIdeaAuth : userProfilePic} id="author-pf"/>
                                  </div>
                                  <div className='user-post-info'>
                                      <p className='post-username'>{post.username} <span className='post-type-label'>post a {post.post_type}</span></p>
                                      <p className='post-at'>{post.created_at}</p>
                                  </div>
                              </div>
                          <DotDropDown/>
                        </div>

                        <div className='post-body'>
                          {renderPostContent(post)}
                        </div>

                        <div className='post-footer'>
                            <div className='post-footer-left'>
                              <button className='button-action-footer'><FontAwesomeIcon icon={faHeart}  className='button-action-footer-icon'/> <p><span>{post.likes_count}</span><span className='count-label'> Like</span></p></button>
                              <button className='button-action-footer'><FontAwesomeIcon icon={faMessage} className='button-action-footer-icon'/><p><span>{post.comments_count}</span><span className='count-label'> Comment</span></p></button>
                            </div>
                            <div className='post-footer-right'>
                              <button className='button-action-footer button-action-footer-last'><FontAwesomeIcon icon={faBookmark} /></button>
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
            <div className="history-container">
                <div className='history-container-header'>
                  <label>History</label>
                  <span>See All</span>
                </div>
                <div className='history-list-ul'>          
                        <div className="post-history-card">
                          <div className='post-history-card-info'>
                              <div id="author-info">
                                <div id="author-pf-div" style={{backgroundColor : isAnonymous === 1 ? anonymousBg : ""}}>
                                     <img src={isAnonymous === 1 ? nahIdeaAuth : userProfilePic} alt="" id="author-pf"/>
                                </div>
                                <p id="author-name">{isAnonymous === 1 ? anonymousName : username}</p>
                              </div>
                              <div id="title-div">
                                <p id="title">
                                  "Should superheroes kill" is a fundamentally uninteresting theme because it is a solved problem (Mostly Invincible, some others)
                                </p>
                              </div>
                              
                            </div>
                            
                        </div>
                        <div className="post-history-card">
                          <div className='post-history-card-info'>
                               <div id="author-info">
                                <div id="author-pf-div" style={{backgroundColor : isAnonymous === 1 ? anonymousBg : ""}}>
                                     <img src={isAnonymous === 1 ? nahIdeaAuth : userProfilePic} alt="" id="author-pf"/>
                                </div>
                                <p id="author-name">{isAnonymous === 1 ? anonymousName : username}</p>
                              </div>
                              <div id="title-div">
                                <p id="title">
                                  "Should superheroes kill" is a fundamentally uninteresting theme because it is a solved problem (Mostly Invincible, some others)
                                </p>
                              </div>
                              
                            </div>
                            <div className="media-holder" style={{ "--preview-url-history-post": `url(https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg)` }}>
                              <img src="https://study.com/cimages/multimages/16/line5062014251101771877.jpg"/>
                            </div>
                            
                        </div>
                        
                </div>
            </div>
                        
            <div className='rule-absolute'>   
                <p>Nahidea Rule</p>     
                <p>Private Policy</p>
                <p>User Agreement</p>
               <p>Accessibility</p>
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

const DotDropDown = () => {

  const menuItems = [
    {
      label: (
        <li >
       View Account
        </li>
      ),
      key: "0",
    },
    {
      label: (
        <li
        >
          hi
        </li>
      ),
      key: "1",
    },
    {
      label: (
        <li >
         <span>Setting</span>
        </li>
      ),
      key: "2",
    },
    {
      label: (
        <li >
       <span>Help</span>
        </li>
      ),
      key: "3",
    },
    {
      label: (
        <li >
      <span>Feedback</span>
        </li>
      ),
      key: "4",
    },
    {  label: (
     
         <hr />
     
      ),
      key: "5" },
    {
      label: (
        <li >
     Logout
        </li>
      ),
      key: "6",
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]} classNames={{ root: "profile-dropdown"}}>
      <div className='post-header-right'>
      <FontAwesomeIcon icon={faEllipsisVertical} className='icon-formore'/>
      </div>
    </Dropdown>
  );
};



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
  //                         meanleapha <span className="post-type-label">post a content</span>
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