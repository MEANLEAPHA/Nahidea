// React State
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";

// style
import "../style/page/Aboutpost.css";
import "../style/page/Home.css";
import "../style/upload/Postpreview.css";
import "../style/upload/MultipleMedia.css";
import {MediaPreview} from "../util/mediaUploader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot,faEllipsisVertical, faRetweet} from "@fortawesome/free-solid-svg-icons";
import { faBookmark, faCopy, faFlag, faHeart, faMessage, faPenToSquare, faTrashCan} from "@fortawesome/free-regular-svg-icons";

import nahIdeaAuth from "../img/nahIdeaAuth.png";
const [userProfilePic, setUserProfilePic] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIMICmqUJvaXbGlMPkkTZdGfR_y1ptPhg7tg&s");

const token = localStorage.getItem("token");

const parseJSON = (val) => {
  try {
    return typeof val === "string" ? JSON.parse(val) : val;
  } catch {
    return [];
  }
};


const AboutPost = () => {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("post") || "{}");

    handleView();
   
    if (String(stored.postId) === String(id)) {
      setPost(stored);
    } else {
     handleFetchPost();
    }
  }, [id]);

  const handleFetchPost = async () => {
     try{
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/get-post/${id}`
        )
        const data = res.data;
        setPost(data);
      }
      catch (err) {
      console.error(err);
      setPost([]);
    } 
  }
  const handleView = async () =>{
    if(!token) return;
    try{
    await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/history-post/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    }catch(err){
      console.error(err);
    }
  }

  if (!post) {
    return (
      <div className="aboutPost">
        <h1>Post {id}</h1>
        <p>No data found in sessionStorage. (Cold start case)</p>
      </div>
    );
  };

const renderPostContent = (post) => {
  const data = post.data;

  if (!data) return <Text type="secondary">No content</Text>;

  switch (post.post_type) {
    case "content":
      return (
      <>
        <div>
          <div className='post-caption'>
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
          <div className='post-caption'>
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
    <div clasName='home-container'>
      <article id="feed-article">
        <div className="posts about-posts">

          <div className='post-header'>
            <div className='post-user-profile'>
              <div id="author-pf-div" style={{backgroundColor : post.is_anonymous === 1 ? post.anonymous_bg_color : ""}}>
                <img src={post.is_anonymous === 1 ? nahIdeaAuth : userProfilePic} alt="" id="author-pf"/>
              </div>
              <p id="author-name">{post.username}</p>
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
      </article>

      <articel id='his-article'>

        <div className='rule-absolute'>   
          <p>Nahidea Rule</p>     
          <p>Private Policy</p>
          <p>User Agreement</p>
          <p>Accessibility</p>
          <div>
            <p>Nahidea. © 2026. All rights reserved </p>
          </div>      
        </div>

      </articel>
    </div>
  );
};


export default AboutPost;
