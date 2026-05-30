import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Typography, Button, Dropdown, Menu, message, Modal, Input } from 'antd';
import { MoreOutlined, DeleteOutlined, FlagOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import api from '../services/api';
import { getSocket } from '../../socket';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;
const token = localStorage.getItem('token');

const ChatWindow = ({ activeChat, setActiveChat }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const socket = getSocket();
  const messagesEndRef = useRef(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // For reply & edit
  const [replyTo, setReplyTo] = useState(null);
  const [editMessage, setEditMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/api/get-message/${activeChat.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversationId(res.data.conversationId);
      setMessages(res.data.messages);
      if (socket && res.data.conversationId) {
        socket.emit('mark_seen', { conversationId: res.data.conversationId });
      }
    } catch (err) {
      message.error('Failed to load messages');
    }
  };

  // Join conversation room after we have conversationId
  useEffect(() => {
    if (socket && conversationId) {
      socket.emit('join_conversation', { conversationId });
    }
  }, [conversationId, socket]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.sender_id === activeChat.id || msg.sender_id === user.id) {
        setMessages(prev => [...prev, msg]);
        if (msg.sender_id !== user.id && conversationId) {
          socket.emit('mark_seen', { conversationId });
        }
      }
    };

    const handleMessagesSeen = ({ conversationId: seenConvId }) => {
      if (seenConvId === conversationId) {
        setMessages(prev =>
          prev.map(m =>
            m.sender_id !== user.id ? { ...m, status: 'seen' } : m
          )
        );
      }
    };

    const handleMessageEdited = (updatedMsg) => {
      setMessages(prev => prev.map(m => (m.id === updatedMsg.id ? updatedMsg : m)));
    };

    const handleMessageDeleted = ({ messageId, updatedMessage, permanentlyDeleted }) => {
      if (permanentlyDeleted) {
        setMessages(prev => prev.filter(m => m.id !== messageId));
      } else if (updatedMessage) {
        setMessages(prev => prev.map(m => (m.id === messageId ? updatedMessage : m)));
      }
    };

    const handleMessageStatusUpdated = ({ messageId, status }) => {
      setMessages(prev => prev.map(m => (m.id === messageId ? { ...m, status } : m)));
    };

    const handleUserTyping = ({ userId: typingUserId, isTyping: typing }) => {
      if (typingUserId === activeChat.id) setIsTyping(typing);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_seen', handleMessagesSeen);
    socket.on('message_edited', handleMessageEdited);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('message_status_updated', handleMessageStatusUpdated);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('messages_seen', handleMessagesSeen);
      socket.off('message_edited', handleMessageEdited);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('message_status_updated', handleMessageStatusUpdated);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, activeChat, conversationId, user.id]);

  useEffect(() => {
    if (activeChat) fetchMessages();
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (content, gif, replyToId = null) => {
    if (!content && !gif) return;
    socket.emit('send_message', {
      toUserId: activeChat.id,
      content: content || null,
      gifId: gif?.id || null,
      gifUrl: gif?.gif_url || null,
      replyToId,
    });
  };

  const handleEditMessage = (messageId, newContent, newGif) => {
    socket.emit('edit_message', {
      messageId,
      newContent: newContent || null,
      newGifId: newGif?.id || null,
      newGifUrl: newGif?.gif_url || null,
    });
  };

  const handleDeleteMessage = (messageId) => {
    socket.emit('delete_message', { messageId });
  };

  const handleDeleteConversation = () => {
    Modal.confirm({
      title: 'Delete chat',
      content: 'This will delete the conversation for you. The other person can still see it unless they also delete.',
      onOk: async () => {
        try {
          await api.delete(`/api/delete-conversation/${activeChat.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success('Conversation deleted');
          setActiveChat(null);
        } catch (err) {
          message.error('Failed to delete');
        }
      },
    });
  };

  const handleReport = () => {
    Modal.info({
      title: 'Report user',
      content: 'Click the flag icon next to any message to report it.',
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={handleDeleteConversation}>
        Delete conversation
      </Menu.Item>
      <Menu.Item key="report" icon={<FlagOutlined />} onClick={handleReport}>
        Report user
      </Menu.Item>
    </Menu>
  );

  const handleTyping = (isUserTyping) => {
    if (!socket) return;
    socket.emit('typing', { toUserId: activeChat.id, isTyping: isUserTyping });
    if (isUserTyping && typingTimeout) clearTimeout(typingTimeout);
    if (!isUserTyping) return;
    setTypingTimeout(
      setTimeout(() => {
        socket.emit('typing', { toUserId: activeChat.id, isTyping: false });
      }, 2000)
    );
  };

  const onReportMessage = (msgId) => {
    Modal.confirm({
      title: 'Report message',
      content: <Input.TextArea placeholder="Reason (optional)" id="reportReason" />,
      onOk: async () => {
        const reason = document.getElementById('reportReason')?.value;
        try {
          await api.post(
            '/api/report-message',
            { messageId: msgId, reason },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          message.success('Message reported');
        } catch (err) {
          message.error('Failed to report');
        }
      },
    });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--background-color)' }}>
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--secondary-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setActiveChat(null)}
            style={{ display: 'none', '@media (max-width: 768px)': { display: 'block' } }}
          />
          <Avatar src={activeChat.avatar} size={40} style={{ backgroundColor: '#fd7648' }}>
            {activeChat.username[0]}
          </Avatar>
          <Title level={4} style={{ margin: 0, color: 'var(--font-color)' }}>
            {activeChat.username}
          </Title>
          {isTyping && (
            <div className="typing-indicator" style={{ marginLeft: 8 }}>
              <span></span><span></span><span></span>
            </div>
          )}
        </div>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
      </div>

      <MessageList
        messages={messages}
        currentUserId={user.id}
        onReplyMessage={setReplyTo}
        onEditMessage={setEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onReportMessage={onReportMessage}
      />

      <MessageInput
        onSend={handleSend}
        onTyping={handleTyping}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
        editMessage={editMessage}
        setEditMessage={setEditMessage}
        onEditMessage={handleEditMessage}
      />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;