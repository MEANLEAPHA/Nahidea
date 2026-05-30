import React, { useState, useEffect } from 'react';
import { List, Avatar, Badge, Typography, Space, Button, Modal, Input, message, Switch } from 'antd';
import { LogoutOutlined, SunOutlined, MoonOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../../socket';

const { Text } = Typography;

const Sidebar = ({ activeChat, setActiveChat, toggleTheme, themeMode }) => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const socket = getSocket();

  const fetchChatUsers = async () => {
    try {
      const res = await api.get('/api/get-chat-user');
      setUsers(res.data);
    } catch (err) {
      message.error('Failed to load contacts');
    }
  };

  useEffect(() => {
    fetchChatUsers();
    if (socket) {
      socket.on('new_message', (msg) => {
        // Update last message and unread count for sidebar
        fetchChatUsers();
      });
      return () => socket.off('new_message');
    }
  }, [socket]);

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ width: 520, borderRight: '1px solid var(--secondary-color)', display: 'flex', flexDirection: 'column', background: 'var(--back-con)' }}>
      <div style={{ padding: 16, borderBottom: '1px solid var(--secondary-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Avatar src={user?.avatar} style={{ backgroundColor: '#fd7648' }}>{user?.username?.[0]}</Avatar>
          <Text strong style={{ color: 'var(--font-color)' }}>{user?.username}</Text>
        </Space>
      </div>
      <div style={{ padding: 12 }}>
        <Input placeholder="Search users..." prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <List
        style={{ flex: 1, overflowY: 'auto' }}
        dataSource={filteredUsers}
        renderItem={(item) => (
          <List.Item
            onClick={() => setActiveChat(item)}
            style={{
              cursor: 'pointer',
              background: activeChat?.id === item.id ? 'var(--secondary-color)' : 'transparent',
              padding: '12px 16px',
              transition: '0.2s'
            }}
          >
            <List.Item.Meta
              avatar={<Badge dot={item.unread_count > 0} color="#fd7648"><Avatar src={item.avatar} /></Badge>}
              title={<Text style={{ color: 'var(--font-color)' }}>{item.username}</Text>}
              description={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" ellipsis style={{ maxWidth: 180 }}>
                    {item.last_message || 'No messages yet'}
                  </Text>
                  {item.unread_count > 0 && <Badge count={item.unread_count} style={{ backgroundColor: '#fd7648' }} />}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Sidebar;