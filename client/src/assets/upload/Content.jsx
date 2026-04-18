import React, { useState, useRef, useCallback, useEffect, memo} from "react";
import Select from "react-select";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {MoreFields, MarkdownPreview} from "../util/moreFlieds";

import {MediaPreview} from "../util/mediaUploader";

import { Skeleton } from 'antd';
import { EditOutlined ,TagsOutlined,CloudUploadOutlined,LayoutOutlined,ArrowLeftOutlined  } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot,faEllipsisVertical, faRetweet} from "@fortawesome/free-solid-svg-icons";
import { faBookmark, faCopy, faFlag, faHeart, faMessage, faPenToSquare, faTrashCan} from "@fortawesome/free-regular-svg-icons";
import { useAnonymousTokens, AnonymousTokensCoolDown, AnonymousName, AnonymousProfile } from "../util/anonymousTokens";
const AnonymousPf = memo(AnonymousProfile);
const AnonymousNm = memo(AnonymousName);
import { content_options } from "../data/post_type_data";
import{TagsPreview} from "../util/tagInput";

const token = localStorage.getItem("token");

 import "../style/upload/tag.css";
 import "../style/upload/Content.css";
 import "../style/upload/Postpreview.css";
export default function Content() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [textBody, setTextBody] = useState("");

  const [selectType, setSelectType] = useState(null);
  const [tags, setTags] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { tokens, countdown, consume } = useAnonymousTokens();


  const [openPreview, setOpenPreview] = useState(false);


  const resetAll = () => {
    setLoading(false);
    setTitle("");
    setTextBody("");
    setTags([]);
    setMediaFiles([]);
    setIsAnonymous(false);
    setSelectType(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("post_type", "content");
    formData.append("content_title", title);
    formData.append("text_body", textBody);
    formData.append("content_type", selectType?.value || "general");
    formData.append("isAnonymous", isAnonymous);

    tags.forEach((t) => formData.append("tags[]", t));
    mediaFiles.forEach((f) => formData.append("contentFile", f));

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/create-posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Post created");
        if (isAnonymous) consume();

        // reset
       resetAll();
       
      }
    } catch (err) {
      toast.error("Server error");
      resetAll();
    }
  };

  return (
    <div id="content-container">
       <article id='tool-article'>
           <AnonymousTokensCoolDown tokens={tokens} countdown={countdown} />
             <form onSubmit={handleSubmit} id="content-form">
                <div className="toast-feedback">
                    <ToastContainer position="top-right" autoClose={2000} />
                 </div>
                 <div id='form-header-label'>
                  <p id="content-label">Create Content</p> 
                  <button id='preview-toggle' type="button" onClick={() => setOpenPreview(true)} ><LayoutOutlined /> Preview</button>
                  </div>

        <Select
          options={content_options}
          value={selectType}
          onChange={setSelectType}
           classNamePrefix="custom"
                placeholder="Select Content Type"
        />

        <div className="title-wrapper">
            <p className="title-label" >Title</p>
        
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title*"
              type="text"
              required
              id="title-input"
              
              maxLength={300} // enforce limit
            />
            <div className="char-counter">
              {title.length}/300
            </div>
          </div>

        <MoreFields
          tags={tags}
          setTags={setTags}
          mediaFiles={mediaFiles}
          setMediaFiles={setMediaFiles}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
          tokens={tokens}
          textBodyValue={textBody}
          setTextBodyValue = {setTextBody}
        />

     

      <div id="form-footer">
          <button type="submit" disabled={loading} id="content-post-button">
                {loading ? "Posting..." : "Post"}
        </button>
      </div>
      <div id="form-footer-2">
        <p>Nahidea Rule</p>
        <p>Private Policy</p>
        <p>User Agreement</p>
        <p>Accessibility</p>
        <p>Nahidea. © 2026. All rights reserved </p>
      </div>
        
      </form>
      
       </article>

        <article id='preview-article' style={{display: openPreview ? "block" : "none"}}> 
          <br />
          <button type="button" onClick={() => setOpenPreview(false)} id="preview-closed-arrow"><ArrowLeftOutlined /></button>
          
          <div id="preview-container">
                 <Post textBodyValue={textBody} titleValue={title} filesMediaValues= {mediaFiles} postTagsValue={tags} selectTypeValue={selectType?.value} isAnonymousValue={isAnonymous}/>
            {/* <PreviewRadio /> */}
          </div>
            
        </article>
    </div>
  );
}
const PreviewRadio = () => {
  const [selected, setSelected] = useState("Preivew");

  return (
    <>
      {/* Radio-style buttons */}
      <div id="select-radio">
        <div  className='radio-button-div'>
             {["Preivew", "Document"].map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            style={{
              border: selected === opt ? "2px solid #fd7648" : "2px solid transparent",
              color: selected === opt ? "#fd7648" : "grey",
            }}
            className='radio-button'
          >
            {opt}
          </button>
        ))}
        </div>
      </div>

      {/* Word underneath */}
      <div style={{ marginTop: "10px", color: "#555", fontSize: "14px" }}>
         {selected === "Preivew" ? "A" : "D"}
         <div style={{ marginTop: "10px" }}>

</div>
      </div>
    </>
  );
};

const Post = ({textBodyValue, titleValue, filesMediaValues, postTagsValue, selectTypeValue, isAnonymousValue}) =>{
     const navigate = useNavigate();
    const [displayPostOpt, setDisplayPostOpt] = useState("none");
    const [displayBgMoreIcon, setBgMoreIcon] = useState("none");
    const wrapperRef = useRef(null);
    const handlePostOpt = () => {
        const Mode = localStorage.getItem("darkMode");
       if(displayPostOpt === "none"){
            setDisplayPostOpt("block");
            Mode === "true" ? setBgMoreIcon("rgb(40, 40, 40)") : setBgMoreIcon("rgb(245, 245, 245)");
       } 
       else{
            setDisplayPostOpt("none");
            setBgMoreIcon("none") 
       } 
    }
    useEffect(() => {
        function handleClickOutside(event) {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setDisplayPostOpt("none");
            setBgMoreIcon("none") 
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
    return(


                <div className="posts">
                      <div className='post-header'>
                              <div className='post-user-profile'>
                                <AnonymousPf enabled={isAnonymousValue} realPf='https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif'/>
                                  {/* <img src="https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif" className='user-profile'/> */}
                                  <div className='user-post-info'>
                                      <p className='post-username'><AnonymousNm enabled={isAnonymousValue} realName='Ha Meanleap'/> <span className='post-feeling'>{selectTypeValue}</span></p>
                                      <p className='post-at'>Just now</p>
                                  </div>
                              </div>
                          <button className='post-header-right btn-header-right' onClick={handlePostOpt} style={{background: displayBgMoreIcon, borderRadius: "10px"}} ref={wrapperRef}>
                             <ul className='post-more-option' style={{display: displayPostOpt}} onClick={(e) => e.stopPropagation()}>
                                    <li className='li-more-option' onClick={() => navigate("/login")}>
                                        <FontAwesomeIcon icon={faPenToSquare} className='icon-option'/> Edit Post
                                    </li>
                                    <li className='li-more-option'>
                                        <FontAwesomeIcon icon={faTrashCan} className='icon-option'/> Delete Post
                                    </li>
                                    <li className='li-more-option'>
                                        <FontAwesomeIcon icon={faFlag} className='icon-option'/> Report Post
                                    </li>
                                    <li className='li-more-option'>
                                        <FontAwesomeIcon icon={faCopy} className='icon-option'/> Copy Link
                                    </li>
                                </ul>
                                <FontAwesomeIcon icon={faEllipsisVertical} className='icon-formore'/>
                          </button>
                      </div>
                      <div className='post-body'>
                         

                        {
                          titleValue === "" && textBodyValue === "" && postTagsValue.length === 0? <Skeleton active/> : (
                            <div>
                               <div className='post-caption'>
                                 <p>{titleValue}</p>
                              </div>
                              <div className='post-body-text'>
                                  <MarkdownPreview content={textBodyValue}/>
                              </div>
                              <div className='post-tags'>
                                  <TagsPreview tagsValue={postTagsValue}/>
                              </div>
                            </div>
                          )
                        }


                        <div  className='post-thumbnail'>
                           
                           <MediaPreview files={filesMediaValues}/>
                        </div>
                      </div>
                      <div className='post-footer'>
                          <div className='post-footer-left'>
                              <button className='button-action-footer'><FontAwesomeIcon icon={faHeart} /> <p><span>0</span><span className='count-label'> Like</span></p></button>
                              <button className='button-action-footer'><FontAwesomeIcon icon={faMessage} /><p><span>0</span><span className='count-label'> Comment</span></p></button>
                              <button className='button-action-footer'><FontAwesomeIcon icon={faRetweet} /><p><span>0</span><span className='count-label'> Repost</span></p></button>
                          </div>
                          <div className='post-footer-right'>
                              <button className='button-action-footer button-action-footer-last'><FontAwesomeIcon icon={faBookmark} /></button>
                          </div>  
                      </div>
                </div>
    )
}