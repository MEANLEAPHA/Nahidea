
import React, { useEffect, useState } from "react";

import { VerticalLeftOutlined, VerticalRightOutlined, HomeOutlined,GifOutlined,SignatureOutlined, FireOutlined, TeamOutlined,UserAddOutlined,RiseOutlined , QuestionCircleOutlined, FlagOutlined, ExceptionOutlined, ReadOutlined, FileProtectOutlined, FileDoneOutlined, HeartOutlined, ClockCircleOutlined,BarChartOutlined, UserOutlined  } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faFlagCheckered, faDatabase, faChartPie, faTowerBroadcast, faChildReaching, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import {faBookmark, faNewspaper,faFaceGrinWink, faComments} from "@fortawesome/free-regular-svg-icons";
import { faGlobaleaks } from "@fortawesome/free-brands-svg-icons";

import gossiperlogo from "../img/gossiperlogo.png";
import axios from "axios";
import "../style/Aside.css";
import {useNavigate} from "react-router-dom";

const Aside = (props) => {
   
   
    const [chatUnreadCount, setChatUnreadCount] = useState(0);
     const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
            `${process.env.VITE_SERVER_URL}/api/chat/unread-count`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            setChatUnreadCount(
            res.data.unreadCount || 0
            );
        } catch (err) {
            console.log(err);
        }
        };
        useEffect(() => {
        fetchUnreadCount();

        const interval = setInterval(
            fetchUnreadCount,
            100000
        );

        return () => clearInterval(interval);
        }, []);
    // Mobile responsive on Aside
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

        useEffect(() => {
            const handleResize = () => {
                setIsMobile(window.innerWidth <= 768);
            };

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

    // Aside Collapse
    const [showMaxAside, setMaxAside] = useState(() => {
                return localStorage.getItem("maxAside") === "true";
            })
        
            useEffect(()=>{
                localStorage.setItem("maxAside", showMaxAside)
            },
            [showMaxAside]
            );
        
            const toggleAside = () =>{
                    setMaxAside(prev => !prev)
            }
  

    const MaxAsideUl = () => {
        return(
            <ul className="max-ul">
                <AppendMain
                    chatUnreadCount={chatUnreadCount}
                />
                <AppendUserTool />
                <AppendExplore />
                <AppendMore />
                <AppendRule />
            </ul>
        )
    }

    const SmallAsideUl = () => {
    return (
        <ul className="min-ul">
        <AppendMinAside
            chatUnreadCount={chatUnreadCount}
        />
        </ul>
    );
    };
    // ✅ MOBILE: only MaxAside (display block/none)
    if (isMobile) {
        return (
            <aside style={{ display: props.append ? "block" : "none" }} className='max-aside'>
               
                        <MaxAsideUl />
            
            </aside>
        );
    }


    
    return (
       <aside className={showMaxAside ? "max-aside" : "min-aside"}>
                {showMaxAside ? <MaxAsideUl /> : <SmallAsideUl />}
            <button className="btn-col" onClick={toggleAside}>{showMaxAside ? <VerticalRightOutlined style={{color:"grey", fontSize:"large"}}/> : <VerticalLeftOutlined style={{color:"grey", fontSize:"large"}}/>} </button>
        </aside>
    );
};



const MinInfo = [
    {
        id:0, a: '/', icon: <HomeOutlined className='sub-icon'/>
    },
    {
        id:1, a: '/unslovedqa', icon: <SignatureOutlined className='sub-icon'/>
    },  
    {
        id:2, a: '/chat', icon: <img src={gossiperlogo} className='sub-icon sub-icon-logo'/>, 
    },
    {
        id:3, a: '/spammy', icon: <FontAwesomeIcon icon={faTriangleExclamation} fade style={{color: "rgb(255, 212, 59)",}} className='sub-icon'/>, 
    },
    {
        id:4, a: '/gif', icon: <FontAwesomeIcon icon={faFaceGrinWink} bounce  className='sub-icon'/>
    },
    {
        id:5, a: '/following', icon: <UserAddOutlined className='sub-icon'/>
    },
    {
        id:6, a: '/you', icon: <UserOutlined className='sub-icon'/>
    },
    {
        id:7, a: '/trending', icon:  <RiseOutlined  className='sub-icon'/>
    },
    {
        id:8, a: '/halloffame', icon: <FireOutlined className='sub-icon'/>
    },
]

const MinCard = ({a, icon, unreadCount}) => {
    const navigate = useNavigate();
    return(
        <li className="nav-item">
            <button onClick={() => navigate(a)}>
                {unreadCount > 0 && (
                    <span className="chat-aside-badge">
                        {unreadCount}
                    </span>
                )}
                {icon}
            </button>
        </li>
    )
}

    const AppendMinAside = ({
    chatUnreadCount
    }) => {
    return MinInfo.map(item => (
        <MinAside
        key={item.id}
        {...item}
        unreadCount={
            item.a === "/chat"
            ? chatUnreadCount
            : 0
        }
        />
    ));
    };

    const MinAside = ({
    a,
    icon,
    unreadCount
    }) => {
    return (
        <MinCard
        a={a}
        icon={icon}
        unreadCount={unreadCount}
        />
    );
    };
    const Card = ({
    a,
    icon,
    label,
    classNameBtn,
    unreadCount
    }) => {
    const navigate = useNavigate();
    return(
        <li className="max-li">
            <button
                onClick={() => navigate(a)}
                className={classNameBtn}
                style={{ position: "relative" }}
            >
                {unreadCount > 0 && (
                    <span className="chat-aside-badge">
                    {unreadCount}
                    </span>
                )}
                <div>
                    {icon} 
                </div>
                <div>
                    {label}
                </div>
            </button>
        </li>
    )
};



const Mains= [
    { id:1, a: '/', icon: <HomeOutlined className='icon-aside'/>, label: <label>Home</label>, classNameBtn: "btn-home" },
    { id:2, a: '/unslovedqa',  icon: <SignatureOutlined className='icon-aside'/>, label: <label>Answer <span style={{color:"red",}}>QA</span></label> },
    { id:3, a: '/chat', icon: <img src={gossiperlogo} className='sub-icon sub-icon-logo'/>, label: <label id='gossip-label'>Gossiper</label> },
    { id:4, a: '/spammy', icon: <FontAwesomeIcon icon={faTriangleExclamation} fade style={{color: "rgb(255, 212, 59)",}} className='icon-aside'/>, label: <label>Spammy</label> },
];


const AppendMain = ({ chatUnreadCount }) => {
  return Mains.map(item => (
    <Main
      key={item.id}
      {...item}
      unreadCount={
        item.a === "/chat"
          ? chatUnreadCount
          : 0
      }
    />
  ));
};

const Main = ({
  a,
  icon,
  label,
  classNameBtn,
  unreadCount
}) => {
  return (
    <Card
      a={a}
      icon={icon}
      label={label}
      classNameBtn={classNameBtn}
      unreadCount={unreadCount}
    />
  );
};

const UserTools= [
    { id:5, a: '/history',  icon: <ClockCircleOutlined className='icon-aside'/>, label: <label>History</label> },
    { id:6, a: '/favorite',  icon: <FontAwesomeIcon icon={faBookmark} className='icon-aside icon-awesome'/>, label: <label>Favorite</label> },
    { id:7, a: '/likepost',  icon: <HeartOutlined className='icon-aside'/>, label: <label>Like Post</label> },
    { id:8, a: '/yourpost',  icon: <FontAwesomeIcon icon={faNewspaper} className='icon-aside icon-awesome'/>, label: <label>Your Post</label> },
];

const AppendUserTool = () =>{
    return(
        <>
        <label className='label-li'>You </label>
        {UserTools.map(item => (
            <UserTool key={item.id} {...item} />
        ))}
        </>
    )
};

const UserTool = ({a, icon, label, classNameIcon})=> {
    return <Card a={a} icon={icon} label={label} classNameIcon={classNameIcon} />
};

const Explores= [
    { id:9, a:'/gif',  icon:<FontAwesomeIcon icon={faFaceGrinWink} bounce  className='icon-aside'/>, label: <label>Gif Reaction</label> },
    { id:10, a: '/trending',  icon: <RiseOutlined  className='icon-aside'/>, label: <label>Trending <span style={{color:"yellowgreen", }}>NOW</span></label> },
    { id:11, a: '/halloffame',  icon: <FireOutlined className='icon-aside'/>, label: <label>Hall of Fame</label>, classNameBtn: "btn-hall-of-fame" },
];


const AppendExplore = () =>{
    return(
        <>
        <label className='label-li'>Explore</label>
        {Explores.map(item => (
            <Explore key={item.id} {...item} />
        ))}
        </>
    )
};

const Explore = ({a, icon, label, classNameBtn})=> {
    return <Card a={a} icon={icon} label={label} classNameBtn={classNameBtn}/>
};

const Mores= [

    { id:12, a: '/Feedback',  icon: <ExceptionOutlined className='icon-aside'/>, label: <label>Feedback </label>},
    { id:13, a: '/Reporthistory',  icon: <FlagOutlined className='icon-aside'/>, label: <label>Report History</label> }
];

const AppendMore = () =>{
    return(
        <>
        <hr className="aside-hr"/>
        {Mores.map(item => (
            <More key={item.id} {...item} />
        ))}
        </>
    )
};

const More = ({a, icon, label, classNameIcon})=> {
    return <Card a={a} icon={icon} label={label} classNameIcon={classNameIcon} />
};

const Rules= [
    { id:14, a: '/nahidearule', icon: <ReadOutlined className='icon-aside'/>, label: <label>Nahidea Rule</label> },
    { id:15, a: '/privacypolicy',  icon: <FileProtectOutlined className='icon-aside'/>, label: <label>Private Policy</label> },
    { id:16, a: '/useragreement',  icon: <FileDoneOutlined className='icon-aside'/>, label: <label>User Agreement</label> },
    { id:17, a: '/accessibility',  icon: <FontAwesomeIcon icon={faChildReaching} className='icon-aside'/>, label: <label>Accessibility</label> },
];


const AppendRule = () =>{
    return(
        <>
        <hr className="aside-hr"/>
        {Rules.map(item => (
            <Rule key={item.id} {...item} />
        ))}
        </>
    )
};

const Rule = ({a, icon, label, classNameIcon})=> {
    return <Card a={a} icon={icon} label={label} classNameIcon={classNameIcon} />
};

export default Aside;