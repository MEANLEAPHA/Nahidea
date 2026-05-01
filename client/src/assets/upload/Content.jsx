// React import
import React, { useState, useRef, useCallback, useEffect} from "react";
import { useNavigate, useOutletContext  } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

// util import
import {MoreFields} from "../util/moreFlieds";
import { useAnonymousTokens, AnonymousTokensCoolDown } from "../util/anonymousTokens";
import Rule from "../util/upload/Rule";
import PreviewRadio from "../util/upload/PreviewRadio";
import NahideaInfo from "../util/upload/NahideaInfo";

// data import
import { content_options } from "../data/post_type_data";

// ant import
import { Skeleton, Menu, Switch, Dropdown, Space  } from 'antd';
import {  PlusOutlined,UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
          SearchOutlined, BellOutlined, QuestionOutlined, FormOutlined,
          SoundOutlined, LogoutOutlined, MoonFilled, SunFilled, ExceptionOutlined,
          QuestionCircleOutlined, PlusSquareOutlined, SunOutlined, MoonOutlined,
          EditOutlined ,TagsOutlined,CloudUploadOutlined,LayoutOutlined,ArrowLeftOutlined,
          AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

// fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot,faEllipsisVertical, faRetweet} from "@fortawesome/free-solid-svg-icons";
import { faBookmark, faCopy, faFlag, faHeart, faMessage, faPenToSquare, faTrashCan} from "@fortawesome/free-regular-svg-icons";

// style import
import "../style/upload/tag.css";
import "../style/upload/Content.css";
import "../style/upload/Postpreview.css";

// get token
const token = localStorage.getItem("token");


// Content component start here
export default function Content() {

  const [loading, setLoading] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const [title, setTitle] = useState("");
  const [textBody, setTextBody] = useState("");
  const [selectType, setSelectType] = useState(null);
  const [tags, setTags] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { tokens, countdown, consume } = useAnonymousTokens();

  // reset all function()
  const resetAll = () => {
    setLoading(false);
    setTitle("");
    setTextBody("");
    setTags([]);
    setMediaFiles([]);
    setIsAnonymous(false);
    setSelectType(null);
  }

  // handle submit form
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
      formData.append("isAnonymous", isAnonymous === true ? 1 : 0);
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

       resetAll();
       
      }
      } catch (err) {
        toast.error("Server error");
        resetAll();
      };
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
                maxLength={300} 
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

        </form>
        <div id="article-rule">
          <Rule/>
        </div>
        
      </article>

      <article id='preview-article' style={{display: openPreview ? "block" : "none"}}> 
        <PreviewRadio textBody={textBody} title={title} filesMedia= {mediaFiles} postTag={tags} selectType={selectType?.value} isAnonymous={isAnonymous} setOpenPreview={setOpenPreview}/>
      </article>
      
      <NahideaInfo />
    
    </div>
    
  );
}

