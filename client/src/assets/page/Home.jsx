import { useEffect, useState } from "react";
import axios from "axios";
import nahideaTran from "../img/nahidea-tran.png";
import { useNavigate } from "react-router-dom";
import {MediaPreview} from "../util/mediaUploader";
import{TagsPreview} from "../util/tagInput";
import {MoreFields, MarkdownPreview} from "../util/moreFlieds";
import "./Home.css";
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
  const [loading, setLoading] = useState(false); // UI loader
  const [fetching, setFetching] = useState(false); // request lock
  const [source, setSource] = useState("");
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
                  navigate(`/login?id=${post.id}`)
                }}>
                    <p>{data.title}</p>
                </div>
                {/* <div className='post-content-type'>
                    <span className='content-type'>{data.type}</span>
                </div>
                <div className='post-body-text'>
                    <MarkdownPreview content={data.text_body}/>
                </div> */}
                {/* <div className='post-tags'>
                    <TagsPreview tagsValue={postTagsValue}/>
                </div> */}
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
                      navigate(`/login?id=${post.id}`)
                    }}>
                    <p>{data.title}</p>
                </div>
                {/* <div className='post-content-type'>
                    <span className='content-type'>{selectTypeValue}</span>
                </div>
                <div className='post-tags'>
                    <TagsPreview tagsValue={postTagsValue}/>
                </div> */}
              </div>
                  
              <div className="post-thumbnail">
                <img
                  src={data.media_url}
                  alt="Confession"
                  className="post-image"
                />
              </div>

          </>
        );

      case "question":
        return (
          <>
                            <div>
                               <div className='post-caption' onClick={()=>{
                                  navigate(`/login?id=${post.id}`)
                                }}>
                                    <p>{data.title}</p>
                                </div>
                              {/* <div className='post-content-type'>
                                  <span className='content-type'>{selectTypeValue}</span>
                              </div> */}
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
         
                          <img
                            src={data.media_url}
                            alt="Confession"
                            className="post-image"
                          />
                       
                      </div>
          </>
        );

      default:
        return <Text>Unknown post type</Text>;
    }
  };



  // =====================
  // UI
  // =====================
  return (
    <div className='home-container'>
       <article id="feed-article">
   
            {/* CONTENT */}
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
                                  <img src='https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif' className="user-profile" alt="profile" />
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

                {/* BOTTOM LOADER */}
                {loading && (
                  <div className="nextPost-load-div">
                    <Loader />
                  </div>
                )}
              </>
            )}
       </article>
       <article id='his-article'>
                        
            <div className='rule-absolute'>   
              <p>Nahidea Rule</p>     
              <p>Private Policy</p>
              <p>User Agreement</p>
               <p>Accessibility</p>
                <p>Nahidea. © 2026. All rights reserved </p>
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
  
}

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

