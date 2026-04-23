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

import { useOutletContext } from "react-router-dom";

import {PlusOutlined,UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,SearchOutlined, BellOutlined, QuestionOutlined, FormOutlined, SoundOutlined, LogoutOutlined, MoonFilled, SunFilled, ExceptionOutlined, QuestionCircleOutlined, PlusSquareOutlined, SunOutlined, MoonOutlined} from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { Skeleton, Menu, Switch  } from 'antd';
import { EditOutlined ,TagsOutlined,CloudUploadOutlined,LayoutOutlined,ArrowLeftOutlined,AppstoreOutlined, MailOutlined, SettingOutlined   } from '@ant-design/icons';
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


        <MoreFieldsConfession
          tags={tags}
          setTags={setTags}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
          tokens={tokens}
          confessionFileValue={confessionFile}
          setConfessionFileValue={setFile}
        />
       
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
        <div id="article-rule">
        <DropDownRule/>
      </div>
      </article>
       <article id='preview-article' style={{display: openPreview ? "block" : "none"}}> 
            <PreviewRadio  title={title} filesMedia= {confessionFile} postTag={tags} selectType={selectType?.value} isAnonymous={isAnonymous} setOpenPreview={setOpenPreview}/>
        </article>

      
    </div>
  );
}
const PreviewRadio = ({ title, filesMedia, postTag, selectType, isAnonymous, setOpenPreview}) => {
  const [selected, setSelected] = useState(1);

  return (
  
    <div id="select-action-dev">
         <div id="select-radio">
          <button type="button" onClick={() => setOpenPreview(false)} id="preview-closed-arrow"><ArrowLeftOutlined /></button>
        <div  className='radio-button-div'>
             {[{id: 1, label: "Preview"}, {id: 2, label: "Document"}, {id: 3, label: "Content Rule"}].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            style={{
              border: selected === opt.id ? "2px solid #fd7648" : "2px solid transparent",
              color: selected === opt.id ? "#fd7648" : "grey",
            }}
            className='radio-button'
          >
            {opt.label}
          </button>
        ))}
        </div>
      </div>

      {/* Word underneath */}
      <div id="result-selected">
         {  <Post  titleValue={title} filesMediaValues= {filesMedia} postTagsValue={postTag} selectTypeValue={selectType} isAnonymousValue={isAnonymous} displaySelected={selected === 1 ? "block" : "none"}/>}
         {selected === "Document" && "D" }
         {selected === "Content Rule" &&"C" }

    </div>
     
    </div>
    

  );
};

const Post = ({ titleValue, filesMediaValues, postTagsValue, selectTypeValue, isAnonymousValue, displaySelected}) =>{
     const {username} = useOutletContext();
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


                <div className="posts" style={{display:displaySelected}}>
                      <div className='post-header'>
                              <div className='post-user-profile'>
                                <AnonymousPf enabled={isAnonymousValue} realPf='https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif'/>
                                  {/* <img src="https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif" className='user-profile'/> */}
                                  <div className='user-post-info'>
                                      <p className='post-username'><AnonymousNm enabled={isAnonymousValue} realName={username}/></p>
                                      <p className='post-at'>Just now</p>
                                  </div>
                              </div>
                              
                            <DotDropDown/>
                      </div>
                      <div className='post-body'>
                         

                        {
                          titleValue === ""  && postTagsValue.length === 0? <div className='post-skeleton-holder'><Skeleton active/></div> : (
                            <div>
                               <div className='post-caption'>
                                 <p>{titleValue}</p>
                              </div>
                              <div className='post-content-type'>
                                  <span className='content-type'>{selectTypeValue}</span>
                              </div>
                              <div className='post-tags'>
                                  <TagsPreview tagsValue={postTagsValue}/>
                              </div>
                            </div>
                          )
                        }


                      <div className="post-thumbnail">
        {filesMediaValues ? (
          <img
            src={URL.createObjectURL(filesMediaValues)}
            alt="Confession"
          />
        ) : <div className="media-preview-empty">
                                  <Skeleton.Image active />
                              </div>}
      </div>

                      </div>
                      <div className='post-footer'>
                          <div className='post-footer-left'>
                              <button className='button-action-footer'><FontAwesomeIcon icon={faHeart} /> <p><span>0</span><span className='count-label'> Like</span></p></button>
                              <button className='button-action-footer'><FontAwesomeIcon icon={faMessage} /><p><span>0</span><span className='count-label'> Comment</span></p></button>
                          </div>
                          <div className='post-footer-right'>
                              <button className='button-action-footer button-action-footer-last'><FontAwesomeIcon icon={faBookmark} /></button>
                          </div>  
                      </div>
                </div>
    )
}
const items = [
  {
    key: 'sub1',
    label: 'Rule 1',
    icon: <MailOutlined />,
    children: [
      { key: '1', label: 'hi' },
      { key: '2', label: 'Option 2' },
      { key: '3', label: 'Option 3' },
      { key: '4', label: 'Option 4' },
    ],
  },
  {
    key: 'sub2',
    label: 'Rule blah blah',
    icon: <AppstoreOutlined />,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
    ],
  },
  {
    key: 'sub4',
    label: 'Rule of Survival',
    icon: <SettingOutlined />,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
];
const DropDownRule = () => {
  
  const [current, setCurrent] = useState('1');
 
  const onClick = e => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <>
      
      <Menu
       
        onClick={onClick}
        style={{ width: 256 }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />
    </>
  );
};
const DotDropDown = ({ theme, toggleTheme  }) => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const menuItems = [
    {
      label: (
        <li onClick={() => navigate("/user")}>
          <UserOutlined /> View Account
        </li>
      ),
      key: "0",
    },
    {
      label: (
        <li
          onClick={(e) => {
            toggleTheme();
            e.stopPropagation();
          }}
        >
          {theme ? <MoonOutlined /> : <SunOutlined />}{" "}
          {theme ? <span>Dark Mode</span> : <span>Light Mode</span>} 
        </li>
      ),
      key: "1",
    },
    {
      label: (
        <li onClick={() => navigate("/help")}>
          <SettingOutlined /> <span>Setting</span>
        </li>
      ),
      key: "2",
    },
    {
      label: (
        <li onClick={() => navigate("/help")}>
          <QuestionCircleOutlined /> <span>Help</span>
        </li>
      ),
      key: "3",
    },
    {
      label: (
        <li onClick={() => navigate("/feedback")}>
          <ExceptionOutlined /> <span>Feedback</span>
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
        <li onClick={() => navigate("/logout")}>
          <LogoutOutlined /> Logout
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

         {/* <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Confess something..."
          type="text"
          required
        /> */}
{/* 
        <TagInput value={tags} onChange={setTags} /> */}