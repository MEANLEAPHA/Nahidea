import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Avatar, Badge, Typography, Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook } from "@fortawesome/free-regular-svg-icons";
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../../socket';

const { Text } = Typography;

const Sidebar = ({ activeChat, setActiveChat }) => {
  const { onlineUsers } = useOutletContext();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const socket = getSocket();

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

  const handleSelectChat = (chatUser) => {
    setActiveChat(chatUser);
    // Immediately clear unread badge locally (optimistic)
    setUsers(prev =>
      prev.map(u =>
        u.id === chatUser.id ? { ...u, unread_count: 0 } : u
      )
    );
  };

  return (
    <div id='side-bar-gossip'>
      <div id='side-bar-header'>
        <FontAwesomeIcon icon={faAddressBook} id='gossip-icon' />
        <Text id='gossip-header-label'>
          Gossip with your friend now!
        </Text>
      </div>

      <Input
        placeholder="Search users..."
        prefix={<SearchOutlined />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        id='search-chat'
      />

      {/* Custom list – uses your className structure */}
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
  );
};

export default Sidebar;