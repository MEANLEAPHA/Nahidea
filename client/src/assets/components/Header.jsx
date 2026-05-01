import React, { useState, useRef, useEffect, use } from "react";
import {Link, useNavigate} from "react-router-dom";

import {MenuOutlined,PlusOutlined,UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,SearchOutlined, BellOutlined, QuestionOutlined, FormOutlined, SoundOutlined, LogoutOutlined, MoonFilled, SunFilled, ExceptionOutlined, SettingOutlined, PlusSquareOutlined, SunOutlined, MoonOutlined,
        HomeOutlined,SignatureOutlined,BarChartOutlined,ClockCircleOutlined,HeartOutlined, RiseOutlined, FireOutlined, QuestionCircleOutlined, FlagOutlined, ReadOutlined, FileProtectOutlined,FileDoneOutlined, 
} from '@ant-design/icons';
import { Divider, Dropdown, Space } from 'antd';

// style
import "../style/Header.css";

  // iconcd client
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faBars, faMagnifyingGlass, faChevronDown, faInbox, faArrowRightFromBracket, faFireFlameCurved, faMagnifyingGlassChart, faTimesCircle,faChartSimple, faGauge,faSliders,faMoon, faFlag, faCommentDots, faBug, faUser, faBook, faUsers, faComments, faComment, faFlagCheckered, faDatabase, faChartPie, faTowerBroadcast, faBan, faFeather, faBullhorn, faServer, faClockRotateLeft, faTrashCan, faChevronUp, faPlus, faChildReaching} from "@fortawesome/free-solid-svg-icons";
  import { faBookmark, faCircleQuestion, faCopy, faHeart, faMessage, faPenToSquare, faUserAlt, faSun, faBell, faSquarePlus, faNewspaper, faFaceGrinWink} from "@fortawesome/free-regular-svg-icons";



const Header = ({onToggleAside, onToggleTheme, currentTheme}) => {
  const navigate = useNavigate();

  const isMaxAside = localStorage.getItem("maxAside");

 
  return (
     <header>

      <div className="header-left header-children">
        {isMaxAside === "true" ? <MenuUnfoldOutlined className="bar-icon aside-action-bar mobile-tool" onClick={onToggleAside} /> : <MenuFoldOutlined  className="bar-icon aside-action-bar mobile-tool" onClick={onToggleAside} />}

        <p className='logo-font-main not-mobile-tool'>Nah<span style={{color:'orange'}}>!</span>dea</p>
        
         
         <p className='logo-font-main mobile-tool' >Nah<span style={{color:'gold'}}>!</span>dea</p>

      </div>

      <div className="header-middle header-children">
        <Search />
      </div>
   

      <div className="header-right header-children">
  
        <button className='button-bar-icon' onClick={onToggleTheme}>{currentTheme ? <MoonOutlined className="not-mobile-tool bar-icon"/> : <SunOutlined className="not-mobile-tool bar-icon"/>}</button>
        <CreateDropDown />
        <SearchOutlined className="mobile-tool bar-icon" onClick={()=>{navigate('/search')}}/>
        <CreateDropDownMin />
        <button className='button-bar-icon button-bar-icon-bell' type="button" onClick={()=>{navigate('/notification')}}><BellOutlined className='bar-icon'/></button>
        
        <ProfileDropDown theme={currentTheme} toggleTheme={onToggleTheme} />
      </div>

    </header>
 
  );
};


const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
 
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const searchQuery = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredResults([]);
      return;
    }

    const results = ResultsDisplay.filter(
      (item) =>
        item.title.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value)
    );
    setFilteredResults(results);
  };

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fireQuery = () => {
      if(filteredResults.length > 0){
          navigate(filteredResults[0].link);
          const dataVisit = {title: filteredResults[0].title, link: filteredResults[0].link, icon: filteredResults[0].icon, description: filteredResults[0].description};
          const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
          const recentVisit = JSON.parse(localStorage.getItem('recentVisit')) || [];
          const updateHistory = [searchTerm, ...history].slice(0,5);
          localStorage.setItem("searchHistory", JSON.stringify(updateHistory));
          if(recentVisit.some((item) => item.link === filteredResults[0].link)){
            const remainData = recentVisit.filter((item) => item.link !== filteredResults[0].link);
            const moveToTop = [dataVisit, ...remainData].slice(0,5);
            localStorage.setItem("recentVisit", JSON.stringify(moveToTop));
             return;
          };
          const updateRecentVisit = [dataVisit, ...recentVisit].slice(0,5);
          localStorage.setItem("recentVisit", JSON.stringify(updateRecentVisit));
      } 
      else{
        if(searchTerm === '') return;
        navigate(`/${searchTerm}`);
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        const updateHistory = [searchTerm, ...history].slice(0,5);
        localStorage.setItem("searchHistory", JSON.stringify(updateHistory));
      }
  }

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredResults([]);

    
    // setShowResults(false);
  };
  return (
     <>
        <div className="search-box not-mobile-tool" ref={wrapperRef}>
          <input
            type="text"
            id="search-input"
            value={searchTerm}  
            placeholder="Search Nah!dea..."
            onChange={searchQuery}
            onFocus={() => setShowResults(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // prevent form submission if inside a form
                fireQuery();
              }
            }}
          />
          {searchTerm && (
          <button
            type="button"
            className="btn-clear-value"
            onClick={clearSearch}
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
        )}
          {showResults && (
            <div className="results-search">
              <TopResults results={filteredResults} />
              <HistorySearch />
              <RecentSearch />
              <PoplularSearch />
            </div>
          )}
        </div>
        <button className='search-button not-mobile-tool' onClick={fireQuery} >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
        </button>
      </>
  );
}

const RecentSearch = () => {
  const [recentData, setRecentData] = useState([]);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recentVisit")) || [];
    setRecentData(data);
  }, []);
  
   const handleDelete = (title) => {
      const updateData = recentData.filter((item) => item.title !== title);
       localStorage.setItem("recentVisit", JSON.stringify(updateData));
      setRecentData(updateData);
     
   }
   const handelClearAll = () => {
      const update = recentData.slice( recentData.length);
      localStorage.setItem("recentVisit", JSON.stringify(update));
      setRecentData(update);
   }

  if(recentData.length === 0){
    return null;
  }

  return(
    <div className="search-result-visit dev-res">
                <div className='label-flex'>
                  <label><FontAwesomeIcon icon={faMagnifyingGlassChart} /> Recent Searches</label>
                  <button onClick={handelClearAll}>Clear All</button>
                </div>
                <ul className='history-ul'>
                  {recentData.map((item, index) => (
                    <RecentCard key={index} icon={item.icon} link={item.link} description={item.description} title={item.title} onDelete={handleDelete}/>
                  ))}
                </ul>
      </div>
  )
}
const RecentCard = ({description,link,icon,title, onDelete}) => {
  const navigate = useNavigate();
   const handleClick = () => {
        navigate(link);
        const currentData = { title, link, icon, description };
         const recentVisit = JSON.parse(localStorage.getItem('recentVisit')) || [];
           if(recentVisit.some((item) => item.link === link)){
            const remainData = recentVisit.filter((item) => item.link !== link);
            const moveToTop = [currentData, ...remainData].slice(0,5);
            localStorage.setItem("recentVisit", JSON.stringify(moveToTop));
             return;
          };
          const updateRecentVisit = [currentData, ...recentVisit].slice(0,5);
          localStorage.setItem("recentVisit", JSON.stringify(updateRecentVisit));
    }
  return(
      <li className = 'history-card'  onClick={handleClick}>
        <div className='history-card-info'> 
              <div><FontAwesomeIcon icon={icon}  className='search-icon-query'/> </div>
            <div className = 'dev-info'>
                  <p className='query-title'>{title}</p>
                  <p className='query-description'>{description}</p>
           </div>
        </div>
           <FontAwesomeIcon icon={faTrashCan}  className='history-icon-trash' onClick={(e)=>{onDelete(title); e.stopPropagation()}}/> 
      </li>
  )
}
const HistorySearch = () => {
   const [historyData, setHistoryData] = useState([]);
   useEffect(() => {
      const data = JSON.parse(localStorage.getItem("searchHistory")) || [];
      setHistoryData(data);
   }, []);
 
   const handleDelete = (title) => {
      const updateData = historyData.filter((item) => item !== title);
       localStorage.setItem("searchHistory", JSON.stringify(updateData));
      setHistoryData(updateData);
     
   }
   const handelClearAll = () => {
      const update = historyData.slice( historyData.length);
      localStorage.setItem("searchHistory", JSON.stringify(update));
      setHistoryData(update);
   }

  if(historyData.length === 0){
    return null;
  }
  return(
      <div className="recent-search dev-res">
          <div className='label-flex'><label>Searches History</label> <button onClick={handelClearAll}>Clear All</button></div>
          <ul class='history-ul'>
            {historyData.map((item,index) => (
              <HistoryCard key={index} title={item} onDelete={handleDelete}/>
            ))}
          </ul>
      </div>
  )
  
}
const HistoryCard = ({title, onDelete}) => {
  const navigate = useNavigate();
   const handleClick = () => {
        navigate(`/${title}`);
        
         const recentVisit = JSON.parse(localStorage.getItem('searchHistory')) || [];
           if(recentVisit.some((item) => item === title)){
            const remainData = recentVisit.filter((item) => item !== title);
            const moveToTop = [title, ...remainData].slice(0,5);
            localStorage.setItem("searchHistory", JSON.stringify(moveToTop));
             return;
          };
          const updateRecentVisit = [title, ...recentVisit].slice(0,5);
          localStorage.setItem("searchHistory", JSON.stringify(updateRecentVisit));
    }
    return (
      <li className = 'history-card' onClick={handleClick}>
        <div className='history-card-info'>
            <FontAwesomeIcon icon={faClockRotateLeft} className='search-icon-query' style={{opacity:"0.7"}}/> 
           
               <p className='query-title'>{title}</p>
           
             
           
        </div>
           <FontAwesomeIcon icon={faTrashCan}  className='history-icon-trash' onClick={(e)=>{onDelete(title); e.stopPropagation()}}/> 
      </li>
    )
 };
 const TopResults = ({results}) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className='search-result dev-res'>
      <label><FontAwesomeIcon icon={faChartSimple} /> Top Result for you</label>
      <ul className='query-result-ul'>
        {results.map(item => (
          <QueryCard 
            key={item.id} 
            icon={item.icon} 
            link={item.link} 
            description={item.description} 
            title={item.title} 
          />
        ))}
      </ul>
    </div>
  );
};
const QueryCard = ({id, icon, link, description, title}) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(link);
        const currentData = { id, title, link, icon, description };
         const recentVisit = JSON.parse(localStorage.getItem('recentVisit')) || [];
           if(recentVisit.some((item) => item.link === link)){
            const remainData = recentVisit.filter((item) => item.link !== link);
            const moveToTop = [currentData, ...remainData].slice(0,5);
            localStorage.setItem("recentVisit", JSON.stringify(moveToTop));
             return;
          };
          const updateRecentVisit = [currentData, ...recentVisit].slice(0,5);
          localStorage.setItem("recentVisit", JSON.stringify(updateRecentVisit));
    }
    return (
      <li className = 'query-card' onClick={handleClick}>
           <FontAwesomeIcon icon={icon}  className='search-icon-query'/> 
           <div className = 'dev-info'>
              <p className='query-title'>{title}</p>
              <p className='query-description'>{description}</p>
           </div>
      </li>
    )
 }
 const ResultsDisplay = [
  {id:1, icon:faChartPie, link:'/Dashboard', description: "Central hub with panels, widgets, charts, and key metrics.", title: "Dashboard" },
  {id:2, icon:faSliders, link:'/Maintenance', description: "System maintenance tools and configuration management.", title: "Maintenance" },
  {id:3, icon:faBug, link:'/Error', description: "Monitor and review issues, errors, and troubleshooting logs.", title: "Error" },
  {id:4, icon:faDatabase, link:'/Database', description: "Access and manage database records, pending updates, and edits.", title: "Database" },
  {id:5, icon:faUser, link:'/User', description: "View and manage user profiles, pending approvals, and edits.", title: "User" },
  {id:6, icon:faBook, link:'/Book', description: "Browse and update book records, pending entries, and edits.", title: "Book" },
  {id:7, icon:faComment, link:'/Comment', description: "Manage comments including pending submissions and edits.", title: "Comment" },
  {id:8, icon:faComments, link:'/Reply', description: "Review and edit replies, including pending and updated entries.", title: "Reply" },
  {id:9, icon:faUsers, link:'/Community', description: "Community management with pending requests and editable records.", title: "Community" },
  {id:10, icon:faCommentDots, link:'/Feedback', description: "Feedback dashboard with panels, widgets, and analytics charts.", title: "Feedback" },
  {id:11, icon:faFlag, link:'/Report', description: "Reporting tools with structured panels, widgets, and charts.", title: "Report" },
  {id:12, icon:faNewspaper, link:'/Article', description: "Article management with dashboards, widgets, and analytics.", title: "Article" },
  {id:14, icon:faBell, link:'/Notification', description: "Notification center with panels, widgets, and activity charts.", title: "Notification" }
];
 const PoplularSearch = () => {
    return(
        <div className='popular-search dev-res'>
               <label>  <FontAwesomeIcon icon={faFireFlameCurved} /> Popular Searches</label>
          
               <ul className='popular-ul'>
                    {PopularResult.map(item => (
                      <PopularCard key={item.id} icon={item.icon} description={item.description} title={item.title} link={item.link}/>
                    ))}
               </ul>
        </div>
    )
 }
 const PopularCard = ({icon, link, description, title}) => {
    const navigate = useNavigate();
    return (
      <li className = 'pop-card' onClick={()=>navigate(link)}>
           <FontAwesomeIcon icon={icon}  className='search-icon-query'/> 
           <div className = 'dev-info'>
              <p className='query-title'>{title}</p>
              <p className='query-description'>{description}</p>
           </div>
      </li>
    )
 }
 const PopularResult = [
  {id:1, icon:faBan, link:'/Dashboard', description: "Central hub with panels, widgets, charts, and key metrics.", title: "Pending User" },
  {id:2, icon:faFeather, link:'/Maintenance', description: "System maintenance tools and configuration management.", title: "Upload Article" },
  {id:3, icon:faBullhorn, link:'/Error', description: "Monitor and review issues, errors, and troubleshooting logs.", title: "Alert System Notification" },
  {id:4, icon:faServer, link:'/Database', description: "Access and manage database records, pending updates, and edits.", title: "Cloud Storage" }
];




const CreateDropDown = () =>{
  const navigate = useNavigate();
  const upload_items = [
    {
      label: (
        <li onClick={()=>navigate('/create/content')}>
          <FormOutlined /> <span>Content</span>
        </li>
      ),
      key: '0',
    },
    {
      label: (
        <li onClick={()=>navigate('/create/confession')}>
          <SoundOutlined /> <span>Confession</span>
        </li>
      ),
      key: '1',
    },
    {
      label: (
        <li onClick={()=>navigate('/create/question')}>
            <QuestionOutlined /> <span>Question</span>
        </li>
      ),
      key: '3',
    },
    ];
  return(
    <Dropdown menu={{ items: upload_items }} trigger={['click']} classNames={{ root: "profile-dropdown create-dropdown"}}>
      <button className='button-bar-icon not-mobile-tool button-create-icon'>
        <Space>
          <PlusOutlined className="bar-icon create-icon"/><span style={{fontWeight:"bold", opacity:"0.9"}}>Create</span>
        </Space>
      </button>
  </Dropdown>
  )
}

const CreateDropDownMin = () =>{
  const navigate = useNavigate();
  const upload_items = [
    {
      label: (
        <li onClick={()=>navigate('/create/content')}>
          <FormOutlined /> <span>Content</span>
        </li>
      ),
      key: '0',
    },
    {
      label: (
        <li onClick={()=>navigate('/create/confession')}>
          <SoundOutlined /> <span>Confession</span>
        </li>
      ),
      key: '1',
    },
    {
      label: (
        <li onClick={()=>navigate('/create/question')}>
            <QuestionOutlined /> <span>Question</span>
        </li>
      ),
      key: '3',
    },
    ];
  return(
    <Dropdown menu={{ items: upload_items }} trigger={['click']} classNames={{ root: "profile-dropdown create-dropdown"}}>
          <button className='button-create-icon-min mobile-tool'>
        <Space>
          <PlusOutlined className='createbar-icon' /><span style={{fontWeight:"bold", opacity:"0.9"}}>Create</span>
        </Space>
        </button>
  </Dropdown>
  )
}
const ProfileDropDown = ({ theme, toggleTheme  }) => {
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
      <div style={{position: "relative"}} > 
        <Space>
          <img
            src="https://ih1.redbubble.net/image.2515682869.7692/raf,360x360,075,t,fafafa:ca443f4786.jpg"
            className="profile-div-img button-bar-icon button-bar-icon-pf"
            alt="profile"
          />
          <div id="user-status">
            <div
              id="user-status-dot"
              style={{ backgroundColor: isOnline ? "yellowgreen" : "grey" }}
            ></div>
          </div>
        </Space>
   </div>
    </Dropdown>
  );
};

export default Header;
