// React import
import React, { useState, useRef, useCallback, useEffect} from "react";
import { useNavigate, useOutletContext  } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

// data import
import { confession_options } from "../data/post_type_data";

// util import
import {MoreFieldsConAndQues} from "../util/moreFlieds";
import Rule from "../util/upload/Rule";
import PreviewRadio from "../util/upload/PreviewRadio";
import { useAnonymousTokens, AnonymousTokensCoolDown} from "../util/anonymousTokens";
import NahideaInfo from "../util/upload/NahideaInfo";

// ant import
import {  PlusOutlined,UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,SearchOutlined, BellOutlined, QuestionOutlined, 
          FormOutlined, SoundOutlined, LogoutOutlined, MoonFilled,
          SunFilled, ExceptionOutlined, QuestionCircleOutlined, PlusSquareOutlined, SunOutlined, MoonOutlined,
          EditOutlined ,TagsOutlined,CloudUploadOutlined,LayoutOutlined,ArrowLeftOutlined,AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Space, Skeleton, Menu, Switch  } from 'antd';

// fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot,faEllipsisVertical, faRetweet} from "@fortawesome/free-solid-svg-icons";
import { faBookmark, faCopy, faFlag, faHeart, faMessage, faPenToSquare, faTrashCan} from "@fortawesome/free-regular-svg-icons";

// style
import "../style/upload/tag.css";
import "../style/upload/Content.css";
import "../style/upload/Postpreview.css";

 // get token
 const token = localStorage.getItem("token");


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
    formData.append("isAnonymous", isAnonymous === true ? 1 : 0);
    if (confessionFile) {
      formData.append("confessionFile", confessionFile);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/create-posts`,
        formData,
         
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
        <form onSubmit={handleSubmit} id="content-form">

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
                maxLength={300}
              />
              <div className="char-counter">
                {title.length}/300
              </div>
            </div>

            <MoreFieldsConAndQues
              tags={tags}
              setTags={setTags}
              isAnonymous={isAnonymous}
              setIsAnonymous={setIsAnonymous}
              tokens={tokens}
              conAndQuesFileValue={confessionFile}
              setConAndQuesFileValue={setFile}
            />
       
            <div id="form-footer">
              <button type="submit" disabled={loading} id="content-post-button">
                {loading ? "Confessing..." : "Confess"}
              </button>
            </div>
        
        </form>
        <div id="article-rule">
          <Rule/>
        </div>
      </article>

      <article id='preview-article' style={{display: openPreview ? "block" : "none"}}> 
        <PreviewRadio  title={title} filesMedia= {confessionFile} postTag={tags} selectType={selectType?.value} isAnonymous={isAnonymous} setOpenPreview={setOpenPreview}/>
      </article>

      <NahideaInfo />
      
    </div>
  );
}
