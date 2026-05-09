import React,{ useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {axios} from "axios";
import "../style/page/Notification.css";

const token = localStorage.getItem("token");
const Notification = () => {

    const navigate = useNavigate();
    const [notification, setNotification] = useState([]);
    useEffect(() => {
        getNotification();
    }, []);

    const getNotification = async () => {
        try{
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/notifications/get-all`, 
                {headers: {Authorization: `Bearer ${token}`}}
            );
            const notificationData = res.data.notifications;
            setNotification(notificationData);
        }
        catch(err){
            console.error(err);
        }
    }
    return (
        <>
        <div>Notification</div>
        {
            notification.map((item, index) => (
                <div key={index} onClick={() => navigate(`/aboutpost/${item.post_id}#${item.comment_id}`)}>
                    <p>{item.content}</p>
                </div>
            ))
        }
        </>
    );
};

export default Notification;