import React, { useState, useRef, useEffect, use } from "react";
import {data, Link, useNavigate} from "react-router-dom";

import {MenuOutlined,PlusOutlined,UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,SearchOutlined, BellOutlined, QuestionOutlined, FormOutlined, SoundOutlined, LogoutOutlined, MoonFilled, SunFilled, ExceptionOutlined, SettingOutlined, PlusSquareOutlined, SunOutlined, MoonOutlined,
        HomeOutlined,SignatureOutlined,BarChartOutlined,ClockCircleOutlined,HeartOutlined, RiseOutlined, FireOutlined, QuestionCircleOutlined, FlagOutlined, ReadOutlined, FileProtectOutlined,FileDoneOutlined, 
} from '@ant-design/icons';
import { Divider, Dropdown, Space } from 'antd';
import { useNotifications} from "../context/NotificationContext";
import nahideaIcon from '../img/nahideaIcon.png';
// style
import "../style/Header.css";

import api from "../api/axiosInstance";

  // iconcd client
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faBars, faMagnifyingGlass, faChevronDown, faInbox, faArrowRightFromBracket, faFireFlameCurved, faMagnifyingGlassChart, faTimesCircle,faChartSimple, faGauge,faSliders,faMoon, faFlag, faCommentDots, faBug, faUser, faBook, faUsers, faComments, faComment, faFlagCheckered, faDatabase, faChartPie, faTowerBroadcast, faBan, faFeather, faBullhorn, faServer, faClockRotateLeft, faTrashCan, faChevronUp, faPlus, faChildReaching} from "@fortawesome/free-solid-svg-icons";
  import { faBookmark, faCircleQuestion, faCopy, faHeart, faMessage, faPenToSquare, faUserAlt, faSun, faBell, faSquarePlus, faNewspaper, faFaceGrinWink} from "@fortawesome/free-regular-svg-icons";


import { useAuth } from '../context/AuthContext';
import SearchForm from "../page/SearchForm";
import {SearchBar} from "./SearchBar";

const Header = ({onToggleAside, onToggleTheme, currentTheme, avatar_url}) => {
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
     <header>

      <div className="header-left header-children" onClick={()=>{navigate('/')}}>
        <MenuOutlined className="bar-icon aside-action-bar mobile-tool" onClick={(e) => {
          e.stopPropagation();
          onToggleAside();
        }} />
        <p className='logo-font-main not-mobile-tool' style={{cursor:'pointer'}}>Nah<span style={{color:'orange'}}>!</span>dea<sup style={{fontSize:'12px'}} className='beta-span'>beta</sup></p>
        <p className='logo-font-main mobile-tool' style={{cursor:'pointer'}}>Nah<span style={{color:'gold'}}>!</span>dea<sup style={{fontSize:'11px'}} className='beta-span'>beta</sup></p>
      </div>

    
        <SearchBar />
     

      <div className="header-right header-children">
            <>
              <button className='button-bar-icon not-mobile-tool' onClick={onToggleTheme}>{currentTheme ? <MoonOutlined className="not-mobile-tool bar-icon"/> : <SunOutlined className="not-mobile-tool bar-icon"/>}</button>
              <CreateDropDown />
              <SearchOutlined className="mobile-tool bar-icon" onClick={()=>{navigate('/search')}}/>
              <CreateDropDownMin />
              <button className='button-bar-icon button-bar-icon-bell' type="button" onClick={()=>{navigate('/notifications')}}>
                <BellOutlined className='bar-icon'/>
                {unreadCount > 0 && (
                    <span className="badge-noti" style={{ color: "white" }}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
              </button>
              <ProfileDropDown theme={currentTheme} toggleTheme={onToggleTheme} avatar_url={avatar_url}/>
            </>
         
      </div>

    </header>
 
  );
};

const useUploadItems = () => {
  const navigate = useNavigate();
  return [
    { label: <li onClick={() => navigate('/create/content')}><FormOutlined /> <span>Content</span></li>, key: '0' },
    { label: <li onClick={() => navigate('/create/confession')}><SoundOutlined /> <span>Confession</span></li>, key: '1' },
    { label: <li onClick={() => navigate('/create/question')}><QuestionOutlined /> <span>Question</span></li>, key: '3' },
  ];
};

const CreateDropDown = () => {
  const items = useUploadItems();
  return (
    <Dropdown menu={{ items }} trigger={['click']} classNames={{ root: "profile-dropdown create-dropdown" }}>
      <button className='button-bar-icon not-mobile-tool button-create-icon'>
        <Space><PlusOutlined className="bar-icon create-icon" /><span style={{ fontWeight: "bold", opacity: 0.9 }}>Create</span></Space>
      </button>
    </Dropdown>
  );
};

const CreateDropDownMin = () => {
  const items = useUploadItems();
  return (
    <Dropdown menu={{ items }} trigger={['click']} classNames={{ root: "profile-dropdown create-dropdown" }}>
      <button className='button-create-icon-min mobile-tool'>
        <Space><PlusSquareOutlined className='createbar-icon' /></Space>
      </button>
    </Dropdown>
  );
};

const ProfileDropDown = ({ theme, toggleTheme, avatar_url}) => {
   
  const navigate = useNavigate();

 const {user, logout} = useAuth();

  const userId = user?.id;
  const username = user?.username;
  const nickname = user?.nickname;
  const avatar = user?.avatar_url;
  const work_location = user?.work_location;
  const bio = user?.bio;
  const profession = user?.profession;
 

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
        <li onClick={() => navigate("/accounts", {
          state: {
            userId: userId,
          }
        })}>
          <UserOutlined /> View Account
        </li>
      ),
      key: "1",
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
      key: "2",
    },
    {
      label: (
        <li onClick={() => navigate("/feedback")}>
          <ExceptionOutlined /> <span>Feedback</span>
        </li>
      ),
      key: "3",
    },
    {  label: (
     
         <hr />
     
      ),
      key: "4" },
    {
      label: (
       <li
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
          <LogoutOutlined /> <span>Logout</span>
        </li>
      ),
      key: "5",
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]} classNames={{ root: "profile-dropdown"}}>
      <div style={{position: "relative"}} > 
        <Space>
          <img
            src={avatar_url || nahideaIcon}
            className="profile-div-img button-bar-icon button-bar-icon-pf"
            alt="profile"
          />
          <div id="user-status">
            <div
              id="user-status-dot"
              style={{ backgroundColor:"yellowgreen" }}
            ></div>
          </div>
        </Space>
   </div>
    </Dropdown>
  );
};

export default Header;

