// import React, { useState } from "react";
// import "../style/page/Notifications.css";
// import { ClearOutlined, DeleteOutlined, HeartOutlined, MailOutlined, MessageOutlined, UserAddOutlined } from "@ant-design/icons";
// import { faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEllipsis, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
// import { Dropdown } from "antd";
// import { useNavigate, useOutletContext } from "react-router-dom";

// export default function Notifications() {



//   const toggleNotification = (id) => {
//     setNotifications((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? { ...item, expanded: !item.expanded }
//           : item
//       )
//     );
//   };

//   const removeNotification = (id) => {
//     setNotifications((prev) =>
//       prev.filter((item) => item.id !== id)
//     );
//   };

//   return (
//     <div className="notification-panel">

//       {/* Header */}
//       <div className="notification-header">
//         <div className='head-left'>
//             <h3>Notifications </h3>
//             <div id='unread-badge'>3</div>
//         </div>
//         <div className='mark-div'>
//             <button className="mark-read-btn">
//                <ClearOutlined /> Clear all
//             </button>
//             |
//             <button className="mark-read-btn">
//                 <FontAwesomeIcon icon={faEnvelopeOpen} /> Mark all as read
//             </button>
//             |
//             <button className="refresh-btn" type="button">
//                 ↻ 
//             </button>
//         </div>
//       </div>

     

//       {/* Body */}

//       <div className="notification-list">
  
//          <div
//             key='1'
//             className='notification-card' 
//           >
      
//               <div className="notification-left">
//                 <div
//                   className='status-icon-unread'
//                   style={{backgroundColor: 'grey'}}
//                 >
//                 </div>
//                 <div className="notification-body">

//                   <div className="notification-title-avatar">
                      
//                       <HeartOutlined className='noti-icon-type'/> 

//                       {/* <img src={user.avatar} alt="avatar" /> */}
//                   </div>

//                   <div className="notification-title-div">
//                     <div className="notification-title">
//                       This is like logic(some one like you post or comment)
//                     </div>
//                     <div className="notification-title-time">
//                         2026-04-23
//                     </div>
//                    </div>
//                 </div>
                
//               </div>

//               <div className="notification-actions">
//                   <button
//                   className="icon-btn"
//                   onClick={() =>
//                     removeNotification(1)
//                   }
//                 >
//                   <FontAwesomeIcon icon={faEnvelopeOpen} />
//                 </button>
//                 <button
//                   className="icon-btn"
//                   onClick={() =>
//                     removeNotification(1)
//                   }
//                 >
//                   <DeleteOutlined />
//                 </button>
//                 <DropDown />
//               </div>
           
//           </div>
//           <div
//             key='2'
//             className='notification-card' 
//           >
      
//               <div className="notification-left">
//                 <div
//                   className='status-icon-unread'
//                   style={{backgroundColor: 'bluesky'}}
//                 >
//                 </div>
//                 <div className="notification-body">

//                   <div className="notification-title-avatar">
                      
                    
//                       <MessageOutlined className='noti-icon-type'/>
//                       {/* <img src={user.avatar} alt="avatar" /> */}
//                   </div>

//                   <div className="notification-title-div">
//                     <div className="notification-title">
//                       This is like logic(some one like you post or comment)
//                     </div>
//                     <div className="notification-title-time">
//                         2026-04-23
//                     </div>
//                    </div>
//                 </div>
                
//               </div>

//               <div className="notification-actions">
//                   <button
//                   className="icon-btn"
//                   onClick={() =>
//                     removeNotification(1)
//                   }
//                 >
//                   <MailOutlined />
//                 </button>
//                 <button
//                   className="icon-btn"
//                   onClick={() =>
//                     removeNotification(1)
//                   }
//                 >
//                   <DeleteOutlined />
//                 </button>
//                 <DropDown />
//               </div>
           
//           </div>
//           <div
//             key='2'
//             className='notification-card' 
//           >
      
//               <div className="notification-left">
//                 <div
//                   className='status-icon-unread'
//                   style={{backgroundColor: 'bluesky'}}
//                 >
//                 </div>
//                 <div className="notification-body">

//                   <div className="notification-title-avatar">
                      
                    
//                       <UserAddOutlined className='noti-icon-type'/>
                     
//                   </div>

//                   <div className="notification-title-div">
//                     <div className="notification-title">
//                       This user is following you 
//                       {/* if user accept follow back then remove that btn after succesfull follow back */}
//                       <button className='followbackBtn'>Follow back</button> 
//                     </div>
//                     <div className="notification-title-time">
//                         2026-04-23
//                     </div>
//                    </div>
//                 </div>
                
//               </div>

//               <div className="notification-actions">
//                   <button
//                   className="icon-btn"
//                   onClick={() =>
//                     removeNotification(1)
//                   }
//                 >
//                   <MailOutlined />
//                 </button>
//                 <button
//                   className="icon-btn"
//                   onClick={() =>
//                     removeNotification(1)
//                   }
//                 >
//                   <DeleteOutlined />
//                 </button>
//                 <DropDown />
//               </div>
           
//           </div>
//             <div
//             key='2'
//             className='notification-card' 
//           >
      
//               <div className="notification-left">
//                 <div
//                   className='status-icon-unread'
//                   style={{backgroundColor: 'bluesky'}}
//                 >
//                 </div>
//                 <div className="notification-body">

//                   <div className="notification-title-avatar">
                      
                    
         
                     
//                   </div>

//                   <div className="notification-title-div">
//                     <div className="notification-title">
//                       This user is following you 
//                       {/* if user accept follow back then remove that btn after succesfull follow back */}
//                       <button className='followbackBtn'>Follow back</button> 
//                     </div>
//                     <div className="notification-title-time">
//                         2026-04-23
//                     </div>
//                    </div>
//                 </div>
                
//               </div>

//               <div className="notification-actions">
//                   <button
//                   className="icon-btn"
//                   onClick={() =>
//                     removeNotification(1)
//                   }
//                 >
//                   <MailOutlined />
//                 </button>
//                 <button
//                   className="icon-btn"
//                   onClick={() =>
//                     removeNotification(1)
//                   }
//                 >
//                   <DeleteOutlined />
//                 </button>
//                 <DropDown />
//               </div>
           
//           </div>
//       </div>

  

//     </div>
//   );
// }

// const DropDown = ({  }) => {
//   const { user } = useOutletContext();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleDelete = async () => {
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_SERVER_URL}/api/comments/}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
     
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleCopyLink = () => {
//     const url = `${window.location.origin}${window.location.pathname}`;
//     navigator.clipboard.writeText(url);
//   };



//   const menuItemsForAll = [
//     {
//       label: <li> Mark as read</li>,
//       key: "0",
//     },
//     {
//       label: (
//         <li onClick={() => navigate('/report')}>
//           Delete
//         </li>
//       ),
//       key: "1",
//     },
//   ];

//   return (
//     <Dropdown
//       menu={{ items: menuItemsForAll }}
//       trigger={["click"]}
//       classNames={{ root: "profile-dropdown" }}
//     >
//       <div className="noti-header-right">
//         <FontAwesomeIcon icon={faEllipsisVertical} className="icon-formore-comm" />
//       </div>
//     </Dropdown>
//   );
// };
import React, { useState, useEffect, useCallback } from "react";
import "../style/page/Notifications.css";
import { 
  ClearOutlined, 
  DeleteOutlined, 
  HeartOutlined, 
  MessageOutlined, 
  UserAddOutlined,
  EyeOutlined 
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpen, faEllipsisVertical, faComment, faHeart, faUserPlus, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'comment_reply':
      case 'mention':
        return <MessageOutlined className='noti-icon-type' />;
      case 'comment_like':
      case 'post_like':
        return <HeartOutlined className='noti-icon-type' />;
      case 'follow':
        return <UserAddOutlined className='noti-icon-type' />;
      case 'follow_back':
        return <UserAddOutlined className='noti-icon-type' style={{ color: '#52c41a' }} />;
      default:
        return <MessageOutlined className='noti-icon-type' />;
    }
  };

  const getNotificationActionIcon = (type, isViewed) => {
    if (!isViewed) {
      return <FontAwesomeIcon icon={faEnvelopeOpen} />;
    }
    switch(type) {
      case 'comment_reply':
      case 'mention':
        return <MessageOutlined />;
      case 'comment_like':
      case 'post_like':
        return <HeartOutlined />;
      case 'follow':
      case 'follow_back':
        return <UserAddOutlined />;
      default:
        return <MessageOutlined />;
    }
  };

  const getNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/notifications/get-all`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error(err);
      message.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_viewed: 1 }
            : notif
        )
      );
      setUnreadCount(res.data.unreadCount);
      message.success("Marked as read");
    } catch (err) {
      console.error(err);
      message.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_viewed: 1 }))
      );
      setUnreadCount(res.data.unreadCount);
      message.success("All notifications marked as read");
    } catch (err) {
      console.error(err);
      message.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/notifications/${notificationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      setUnreadCount(res.data.unreadCount);
      message.success("Notification deleted");
    } catch (err) {
      console.error(err);
      message.error("Failed to delete notification");
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/notifications/delete-all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications([]);
      setUnreadCount(res.data.unreadCount);
      message.success("All notifications deleted");
    } catch (err) {
      console.error(err);
      message.error("Failed to delete all notifications");
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already viewed
    if (!notification.is_viewed) {
      await markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    switch(notification.type) {
      case 'comment_reply':
      case 'mention':
        if (notification.post_id) {
          const commentHash = notification.comment_id ? `#comment-${notification.comment_id}` : '';
          navigate(`/aboutpost/${notification.post_id}${commentHash}`);
        }
        break;
      case 'comment_like':
      case 'post_like':
        if (notification.post_id) {
          navigate(`/aboutpost/${notification.post_id}`);
        }
        break;
      case 'follow':
      case 'follow_back':
        // Navigate to user profile for follow notifications
        if (notification.sender_id) {
          navigate(`/profile/${notification.sender_id}`);
        }
        break;
      default:
        if (notification.post_id) {
          navigate(`/aboutpost/${notification.post_id}`);
        }
    }
  };

  const followBack = async (senderId, notificationId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/add-follow/${senderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        // Update the notification to show mutual status
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { 
                  ...notif, 
                  type: 'follow_back',
                  content: res.data.mutual ? "followed you back" : "started following you"
                }
              : notif
          )
        );
        message.success(res.data.mutual ? "You are now friends!" : "Followed successfully!");
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to follow back");
    }
  };

  const getDropdownItems = (notification) => {
    const items = [
      {
        label: (
          <li>
            {notification.is_viewed ? "Mark as unread" : "Mark as read"}
          </li>
        ),
        key: "mark",
        onClick: () => markAsRead(notification.id)
      },
      {
        label: <li>Delete</li>,
        key: "delete",
        onClick: () => deleteNotification(notification.id)
      }
    ];
    
    return { items };
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-panel">
      {/* Header */}
      <div className="notification-header">
        <div className='head-left'>
          <h3>Notifications</h3>
          {unreadCount > 0 && (
            <div id='unread-badge'>{unreadCount}</div>
          )}
        </div>
        <div className='mark-div'>
          <button 
            className="mark-read-btn" 
            onClick={deleteAllNotifications}
            disabled={notifications.length === 0}
          >
            <ClearOutlined /> Clear all
          </button>
          |
          <button 
            className="mark-read-btn" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <FontAwesomeIcon icon={faEnvelopeOpen} /> Mark all as read
          </button>
          |
          <button 
            className="refresh-btn" 
            onClick={getNotifications}
            disabled={loading}
          >
            ↻ {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="notification-list">
        {loading && notifications.length === 0 ? (
          <div className="loading-state">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">No notifications yet</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className='notification-card'
              onClick={() => handleNotificationClick(notification)}
              style={{ cursor: 'pointer' }}
            >
              <div className="notification-left">
                <div
                  className='status-icon-unread'
                  style={{ 
                    backgroundColor: notification.is_viewed ? 'grey' : '#1890ff'
                  }}
                />
                <div className="notification-body">
                  <div className="notification-title-avatar">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-title-div">
                    <div className="notification-title">
                      {notification.content || (
                        <>
                          {notification.sender_username || 'Someone'} 
                          {notification.type === 'comment_reply' && ' replied to your comment'}
                          {notification.type === 'comment_like' && ' liked your comment'}
                          {notification.type === 'post_like' && ' liked your post'}
                          {notification.type === 'mention' && ' mentioned you'}
                          {notification.type === 'follow' && ' started following you'}
                          {notification.type === 'follow_back' && ' followed you back'}
                        </>
                      )}
                      
                      {/* Follow back button for follow notifications */}
                      {notification.type === 'follow' && !notification.is_viewed && (
                        <button 
                          className='followbackBtn'
                          onClick={(e) => {
                            e.stopPropagation();
                            followBack(notification.sender_id, notification.id);
                          }}
                        >
                          Follow back
                        </button>
                      )}
                      
                      {/* Mutual badge for follow_back */}
                      {notification.type === 'follow_back' && (
                        <span className="mutual-badge">Friends</span>
                      )}
                    </div>
                    <div className="notification-title-time">
                      {formatTime(notification.created_at)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="notification-actions">
                <button
                  className="icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification.id);
                  }}
                  title={notification.is_viewed ? "Mark as unread" : "Mark as read"}
                >
                  {getNotificationActionIcon(notification.type, notification.is_viewed)}
                </button>
                <button
                  className="icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  title="Delete"
                >
                  <DeleteOutlined />
                </button>
                <Dropdown 
                  menu={getDropdownItems(notification)} 
                  trigger={["click"]}
                >
                  <div className="noti-header-right" onClick={(e) => e.stopPropagation()}>
                    <FontAwesomeIcon icon={faEllipsisVertical} className="icon-formore-comm" />
                  </div>
                </Dropdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}