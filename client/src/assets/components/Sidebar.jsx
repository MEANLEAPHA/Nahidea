import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Avatar, Badge, Typography, Input, message } from 'antd';
import { Divider, Dropdown, Space } from 'antd';

import {MenuOutlined,LeftOutlined,PlusOutlined,UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,SearchOutlined, BellOutlined, QuestionOutlined, FormOutlined, SoundOutlined, LogoutOutlined, MoonFilled, SunFilled, ExceptionOutlined, SettingOutlined, PlusSquareOutlined, SunOutlined, MoonOutlined,
        HomeOutlined,SignatureOutlined,BarChartOutlined,ClockCircleOutlined,HeartOutlined, RiseOutlined, FireOutlined, QuestionCircleOutlined, FlagOutlined, ReadOutlined, FileProtectOutlined,FileDoneOutlined, 
} from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook } from "@fortawesome/free-regular-svg-icons";

  import { faArrowRightFromBracket, } from "@fortawesome/free-solid-svg-icons";
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  connectSocket,
  disconnectSocket,
  getSocket
} from "../../socket";

import gossiperlogo from "../img/gossiperlogo.png";

const { Text } = Typography;

const Sidebar = ({ activeChat, setActiveChat }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [userSpam, setUserSpam] = useState([]);
  const [userArchive, setUserArchive] = useState([]);

  const [search, setSearch] = useState('');
  const [searchSpam, setSearchSpam] = useState('');
  const [searchArchive, setSearchArchive] = useState('');
 
  const socket = getSocket();
  const token = localStorage.getItem('token');

  const [selected, setSelected] = useState(1);

      useEffect(() => {
        if (!token) return;

        const socket = connectSocket({
          token,
          userId: user.id,
          username: user.username,
          avatar_url: user.avatar_url
        });
    
        socket.on("online-users", (users) => {
          setOnlineUsers(users);
        });
    
        return () => {
    
          socket.off("online-users");
    
          disconnectSocket();
        };
    
      }, []);

  const fetchChatUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/get-chat-user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      message.error('Failed to load contacts');
    }
  };

  useEffect(() => {
    fetchChatUsers();
  }, []);

  const fetchChatUserSpam = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/get-chat-spam-user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserSpam(res.data);
    } catch (err) {
      message.error('Failed to load contacts');
    }
  };

  useEffect(() => {
    fetchChatUserSpam();
  }, [selected === 2]);

  const handleRestoreChat = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/open-conversation/${userId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchChatUsers();
      fetchChatUserArchive();
    } catch (err) {
      message.error('Failed to restore contact');
    }
  };

  const fetchChatUserArchive = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/get-chat-archived-user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserArchive(res.data);
    } catch (err) {
      message.error('Failed to load contacts');
    }
  };

  useEffect(() => {
    fetchChatUserArchive();
  }, [selected === 3]);


  // Listen for new messages to update sidebar (last message & unread count)
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = () => {
      fetchChatUsers(); // refresh sidebar data
    };
    socket.on('new_message', handleNewMessage);
    return () => socket.off('new_message', handleNewMessage);
  }, [socket]);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUserSpam = userSpam.filter(u =>
    u.username.toLowerCase().includes(searchSpam.toLowerCase())
  );

  const filteredUserArchive = userArchive.filter(u =>
    u.username.toLowerCase().includes(searchArchive.toLowerCase())
  );

  const handleSelectChat = (chatUser) => {
    setActiveChat(chatUser);
    // Immediately clear unread badge locally (optimistic)
    setUsers(prev =>
      prev.map(u =>
        u.id === chatUser.id ? { ...u, unread_count: 0 } : u
      )
    );
  };

  // =========================================
    // THEME
    // =========================================
    const [darkMode, setDarkMode] = useState(() => {
      return localStorage.getItem("darkMode") === "true";
    });
  
    useEffect(() => {
  
      document.body.classList.toggle(
        "dark-theme",
        darkMode
      );
  
      localStorage.setItem(
        "darkMode",
        darkMode
      );
  
    }, [darkMode]);
  
    const toggleTheme = () => {
      setDarkMode(prev => !prev);
    };

    

  return (
    <div id='side-bar-gossip'>
      <div id='side-bar-header'>
        <div className='side-bar-header-child'>
          <LeftOutlined className="btn-out-gossiper"/>
          <img src={gossiperlogo} id='gossiper-logo'/>
          <p id='gossip-label-chat'>Gossiper</p>
        </div>
        
        <div className='side-bar-header-child side-bar-header-child-right'>
          <button className='button-bar-icon btn-theme' onClick={toggleTheme} >
            {darkMode ? <MoonOutlined className="bar-icon"/> : <SunOutlined className=" bar-icon"/>}
            
          </button>
          <ProfileDropDown theme={darkMode} toggleTheme={toggleTheme} avatar_url={user?.avatar_url} />
        </div>
      </div>

       <div  className='radio-button-div'>
          {[{id: 1, label: "Friends"}, {id: 2, label: "Spam"}, {id: 3, label: `Archived`}].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            style={{
              borderBottom: selected === opt.id ? "2px solid #fd7648" : "2px solid transparent",
              color: selected === opt.id ? "#fd7648" : "grey",
            }}
            className='radio-button'
          >
            {opt.label}
          </button>
        ))}
        </div>

        {
          selected === 1 && 
            <div>
          <Input placeholder="Search users..." prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} id='search-chat' />
      
          <div className="user-chat-list">
            <div className="user-list-items">
              {filteredUsers.map((item) => (
                <div
                  key={item.id}
                  className="user-list-item"
                  onClick={() => handleSelectChat(item)}
                  style={{
                    cursor: 'pointer',
                    background: activeChat?.id === item.id ? 'var(--secondary-color)' : 'transparent',
                    padding: '12px 16px',
                    transition: '0.2s',
                  }}
                >
                  <div className="user-list-item-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="user-list-item-meta-avatar">
                      <img src={item.avatar_url || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"} alt="" className='user-chat-avatar' />
                      {onlineUsers.includes(String(item.id)) ? (
                        <div className='online-status-chat'></div>
                      ) : (
                        <div className='offline-status-chat'></div>
                      )}
                      
                    </div>
                    <div className="user-list-item-meta-content">
                      <div className="user-list-item-meta-title">
                        <div className='user-chat-name'>{item.username}</div>
                        <div className='user-chat-message'>{item.last_message || 'No messages yet'}</div>
                      </div>
                      {item.unread_count > 0 && (
                        <Badge
                          count={item.unread_count}
                          style={{ backgroundColor: 'red' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
            </div>
        }
        {
        selected === 2 && 
          <div>
        <Input placeholder="Search spam users..." prefix={<SearchOutlined />} value={searchSpam} onChange={(e) => setSearchSpam(e.target.value)} id='search-chat' />
    
        <div className="user-chat-list">
          <div className="user-list-items">
            {filteredUserSpam.map((item) => (
              <div
                key={item.id}
                className="user-list-item"
                onClick={() => handleSelectChat(item)}
                style={{
                  cursor: 'pointer',
                  background: activeChat?.id === item.id ? 'var(--secondary-color)' : 'transparent',
                  padding: '12px 16px',
                  transition: '0.2s',
                }}
              >
                <div className="user-list-item-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="user-list-item-meta-avatar">
                    <img src={item.avatar_url || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"} alt="" className='user-chat-avatar' />
                    {onlineUsers.includes(String(item.id)) ? (
                      <div className='online-status-chat'></div>
                    ) : (
                      <div className='offline-status-chat'></div>
                    )}
                    
                  </div>
                  <div className="user-list-item-meta-content">
                    <div className="user-list-item-meta-title">
                      <div className='user-chat-name'>{item.username}</div>
                      <div className='user-chat-message'>{item.last_message || 'No messages yet'}</div>
                    </div>
                    {item.unread_count > 0 && (
                      <Badge
                        count={item.unread_count}
                        style={{ backgroundColor: 'red' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
          </div>
      }
      {
        selected === 3 && 
          <div>
        <Input placeholder="Search archive users..." prefix={<SearchOutlined />} value={searchArchive} onChange={(e) => setSearchArchive(e.target.value)} id='search-chat' />
    
        <div className="user-chat-list">
          <div className="user-list-items">
            {filteredUserArchive.map((item) => (
              <div
                key={item.id}
                className="user-list-item"
                style={{
                  cursor: 'pointer',
                  background: activeChat?.id === item.id ? 'var(--secondary-color)' : 'transparent',
                  padding: '12px 16px',
                  transition: '0.2s',
                }}
              >
                <div className="user-list-item-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="user-list-item-meta-avatar">
                    <img src={item.avatar_url || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"} alt="" className='user-chat-avatar' />
                    {onlineUsers.includes(String(item.id)) ? (
                      <div className='online-status-chat'></div>
                    ) : (
                      <div className='offline-status-chat'></div>
                    )}
                    
                  </div>
                  <div className="user-list-item-meta-content">
                    <div className="user-list-item-meta-title">
                      <div className='user-chat-name'>{item.username}</div>
                    </div>
                    <button onClick={handleRestoreChat(item.id)}>Restore Chat</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
          </div>
      }
      
    </div>
  );
};

const ProfileDropDown = ({ theme, toggleTheme, avatar_url}) => {
   
  const navigate = useNavigate();
  
 const {user} = useAuth();

  const userId = user?.id;
  const username = user?.username;
  const nickname = user?.nickname;
  const avatar = user?.avatar_url;
  const work_location = user?.work_location;
  const bio = user?.bio;
  const profession = user?.profession;
 


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
        <li onClick={() => navigate("/account", {
          state: {
            userId: userId,
            username: username,
            nickname: nickname,
            avatar_url: avatar,
            work_location: work_location,
            bio: bio,
            profession: profession
          }
        })}>
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
        <li onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          navigate("/login");
        }}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} /> <span>Logout</span>
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
            src={avatar_url || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"}
            className="profile-div-img button-bar-icon button-bar-icon-pf"
            alt="profile"
            style={{backgroundColor: 'var(--secondary-color)'}}
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

export default Sidebar;