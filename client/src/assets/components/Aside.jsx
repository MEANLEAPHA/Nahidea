
import React, { useEffect, useState } from "react";
import { Divider, Dropdown, Space } from 'antd';
import { VerticalLeftOutlined, VerticalRightOutlined  } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGauge,faSliders, faFlag, faCommentDots, faBug, faUser, faBook, faNewspaper, faUsers, faComments, faComment, faBell, faFlagCheckered, faDatabase, faChartPie, faTowerBroadcast, faChevronCircleLeft, faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import "../style/Aside.css";
import {useNavigate} from "react-router-dom";

const Aside = (props) => {

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
                <AppendMain />
                <AppendReportAndFeedback />
                <AppendUserInsight />
                <AppendBroadcast />
            </ul>
        )
    }

    const SmallAsideUl = () => {
        return(
            <ul className='min-ul'>
                    <AppendMinAside />
            </ul>     
                
            
        )
    }
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
        id:1, a: '/DashBoard', icon: faChartPie
    },
    {
        id:2, a: '/Error', icon: faBug
    },
    {
        id:3, a: '/UserInsight', icon: faDatabase
    },
    {
        id:4, a: '/FeedbackAndReport', icon: faFlagCheckered
    },
    {
        id:5, a: '/Broadcast', icon: faTowerBroadcast
    },
    {
        id:6, a: '/DashBoard', icon: faChartPie
    },
    {
        id:7, a: '/Error', icon: faBug
    },
    {
        id:8, a: '/UserInsight', icon: faDatabase
    },
    {
        id:9, a: '/FeedbackAndReport', icon: faFlagCheckered
    },
    {
        id:10, a: '/Broadcast', icon: faTowerBroadcast
    }
]

const MinCard = ({a, icon}) => {
    const navigate = useNavigate();
    return(
        <li className="nav-item">
            <button onClick={() => navigate(a)}>
                <FontAwesomeIcon icon={icon} className='sub-icon'/> 
            </button>
        </li>
    )
}

const AppendMinAside = () =>{
    return(
        MinInfo.map(item => (
            <MinAside key={item.id} {...item} />
        ))
    )
};

const MinAside = ({a, icon, classNameIcon})=> {
    return(
        <MinCard a={a} icon={icon} classNameIcon={classNameIcon}/>
    )
};

const Card = ({a, icon, label, classNameIcon}) =>{
    const navigate = useNavigate();
    return(
        <li className="max-li">
            <button onClick={() => navigate(a)} >
                <div>
                    <FontAwesomeIcon icon={icon} className={classNameIcon}/> 
                </div>
                <div>
                    {label}
                </div>
            </button>
        </li>
    )
};



const Mains= [
    { id:1, a: '/Dashboard', icon: faChartPie, label: 'Dashboard', classNameIcon: 'icon-aside' },
    { id:2, a: '/Maintenance', icon: faSliders, label: 'Maintenance', classNameIcon: 'icon-aside' },
    { id:3, a: '/Error', icon: faBug, label: 'Error', classNameIcon: 'icon-aside' }
];

const AppendMain = () =>{
    return Mains.map(item => <Main key={item.id} {...item} />)
};

const Main = ({a, icon, label, classNameIcon})=> {
    return <Card a={a} icon={icon} label={label} classNameIcon={classNameIcon}/>
};

const ReportAndFeedbacks= [
    { id:1, a: '/Feedback', icon: faCommentDots, label: 'Feedback', classNameIcon: 'icon-aside' },
    { id:2, a: '/Report', icon: faFlag, label: 'Report', classNameIcon: 'icon-aside' }
];

const AppendReportAndFeedback = () =>{
    return(
        <>
        <label className='label-li'>Reports & Feedback </label>
        {ReportAndFeedbacks.map(item => (
            <ReportAndFeedback key={item.id} {...item} />
        ))}
        </>
    )
};

const ReportAndFeedback = ({a, icon, label, classNameIcon})=> {
    return <Card a={a} icon={icon} label={label} classNameIcon={classNameIcon} />
};

const UserInsights= [
    { id:1, a: '/User', icon: faUser, label: 'User', classNameIcon: 'icon-aside' },
    { id:2, a: '/Community', icon: faUsers, label: 'Community', classNameIcon: 'icon-aside' },
    { id:3, a: '/Book', icon: faBook, label: 'Book', classNameIcon: 'icon-aside' },
    { id:4, a: '/Comment', icon: faComment, label: 'Comment', classNameIcon: 'icon-aside' },
    { id:5, a: '/Reply', icon: faComments, label: 'Reply', classNameIcon: 'icon-aside' }
];

const AppendUserInsight = () =>{
    return(
        <>
        <label className='label-li'>User Insight</label>
        {UserInsights.map(item => (
            <UserInsight key={item.id} {...item} />
        ))}
        </>
    )
};

const UserInsight = ({a, icon, label, classNameIcon})=> {
    return <Card a={a} icon={icon} label={label} classNameIcon={classNameIcon} />
};

const Broadcasts= [
    { id:1, a: '/Notification', icon: faBell, label: 'Notification', classNameIcon: 'icon-aside' },
    { id:2, a: '/Article', icon: faNewspaper, label: 'Article', classNameIcon: 'icon-aside' }
];

const AppendBroadcast = () =>{
    return(
        <>
        <label className='label-li'>Broadcast</label>
        {Broadcasts.map(item => (
            <Broadcast key={item.id} {...item} />
        ))}
        </>
    )
};

const Broadcast = ({a, icon, label, classNameIcon})=> {
    return <Card a={a} icon={icon} label={label} classNameIcon={classNameIcon} />
};

export default Aside;