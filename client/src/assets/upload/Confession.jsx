// import React, { useState, useRef } from "react";
// import Select from "react-select";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";

// import { useAnonymousTokens, AnonymousToggle, AnonymousTokensCoolDown } from "../util/anonymousTokens";
// import { confession_options } from "../data/post_type_data";
// import {TagInput }from "../util/tagInput";


//  import "../style/upload/tag.css";
//  import "../style/upload/Content.css";
//  import "../style/upload/Postpreview.css";

// const token = localStorage.getItem("token");
import { confession_options } from "../data/post_type_data";
import React, { useState, useRef, useCallback, useEffect, memo} from "react";
import Select from "react-select";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {MoreFieldsConfession, MarkdownPreview} from "../util/moreFlieds";

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
export default function Confession() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [selectType, setSelectType] = useState(null);
  const [confessionFile, setFile] = useState(null);
  const refFile = useRef(null);
  const [tags, setTags] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { tokens, countdown, consume } = useAnonymousTokens();
  const [openPreview, setOpenPreview] = useState(false);
  const resetAll = () => {
    setTitle("");
    setTags([]);
    setFile(null);
    setIsAnonymous(false);
    setSelectType(null);
    setLoading(false);
    if(refFile.current){
      refFile.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!title.trim()) {
      toast.error("Confession title is required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    tags.forEach((t) => formData.append("tags[]", t));
    formData.append("post_type", "confession");
    formData.append("confession_title", title);
    formData.append("confession_type", selectType?.value ?? "general");
    formData.append("isAnonymous", isAnonymous);
    if (confessionFile) {
      formData.append("confessionFile", confessionFile);
    }

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

      if (res.status === 201 || res.status === 200) {
        toast.success(res.data.message || "Confession posted successfully");
        if (isAnonymous) consume();
        resetAll();
      } else {
        toast.error(res.data.message || "Failed to post confession");
        resetAll();
      }
    } catch (err) {
      console.error(err);
      toast.error(
        "Server error, please try again later"
      );
      resetAll();
    }
     resetAll();
  };

  return (
    <div id="content-container">
      <article id='tool-article'>
          <AnonymousTokensCoolDown tokens={tokens} countdown={countdown} />
          <form onSubmit={handleSubmit}>
        <div className="toast-feedback">
          <ToastContainer position="top-right" autoClose={2000} />
        </div>
         <div id='form-header-label'>
                  <p id="content-label">Create Confession</p> 
                  <button id='preview-toggle' type="button" onClick={() => setOpenPreview(true)} ><LayoutOutlined /> Preview</button>
                  </div>

       

        <Select
          options={confession_options}
          value={selectType}
          onChange={setSelectType}
          classNamePrefix="custom"
                placeholder="Select Content Type"
        />
         <div className="title-wrapper">
            <p className="title-label" >Confession Text</p>
        
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write your confession here..."
              type="text"
              required
              id="title-input"
              
              maxLength={300} // enforce limit
            />
            <div className="char-counter">
              {title.length}/300
            </div>
          </div>

         {/* <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Confess something..."
          type="text"
          required
        /> */}
{/* 
        <TagInput value={tags} onChange={setTags} /> */}

        <MoreFieldsConfession
          tags={tags}
          setTags={setTags}
          // mediaFiles={mediaFiles}
          // setMediaFiles={setMediaFiles}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
          tokens={tokens}

          confessionFileValue={confessionFile}
          setConfessionFileValue={setFile}
          // textBodyValue={textBody}
          // setTextBodyValue = {setTextBody}
        />
        {/* <input
          type="file"
          accept="image/*"
          ref={refFile}
          onChange={(e) => setFile(e.target.files[0])}
        /> */}
{/* 
        <AnonymousToggle
          enabled={isAnonymous}
          setEnabled={setIsAnonymous}
          tokens={tokens}
        /> */}

        
      <div id="form-footer">
          <button type="submit" disabled={loading} id="content-post-button">
                {loading ? "Confessing..." : "Confess"}
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
          
          {/* <div id="preview-container">
                 <Post textBodyValue={textBody} titleValue={title} filesMediaValues= {mediaFiles} postTagsValue={tags} selectTypeValue={selectType?.value} isAnonymousValue={isAnonymous}/>
    
          </div> */}
            
        </article>

      
    </div>
  );
}
