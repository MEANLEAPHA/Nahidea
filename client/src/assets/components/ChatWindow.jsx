import React, { useState, useEffect, useRef } from 'react';
import { Button, Dropdown, Popconfirm, message, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { DeleteOutlined, FlagOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import api from '../services/api';
import { getSocket } from '../../socket';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ activeChat, setActiveChat, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldestMessageId, setOldestMessageId] = useState(null);
  const socket = getSocket();
  const messagesEndRef = useRef(null);
  const messagesTopRef = useRef(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editMessage, setEditMessage] = useState(null);

  const handleReply = (msg) => {
    setEditMessage(null);
    setReplyTo(msg);
  };

  const handleEdit = (msg) => {
    setReplyTo(null);
    setEditMessage(msg);
  };

  // Fetch initial messages (most recent)
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/api/get-message/${activeChat.id}?limit=30`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversationId(res.data.conversationId);
      setMessages(res.data.messages);
      setHasMore(res.data.hasMore || false);
      if (res.data.messages.length > 0) {
        setOldestMessageId(res.data.messages[0].id); // oldest of loaded batch
      }
      if (socket && res.data.conversationId) {
        socket.emit('mark_seen', { conversationId: res.data.conversationId });
      }
    } catch (err) {
      message.error('Failed to load messages');
    }
  };

  // Fetch older messages (before oldestMessageId)
  const loadOlderMessages = async () => {
    if (loadingOlder || !hasMore || !oldestMessageId) return;
    setLoadingOlder(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/api/get-message/${activeChat.id}?limit=30&beforeId=${oldestMessageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.messages.length > 0) {
        // Prepend older messages
        setMessages(prev => [...res.data.messages, ...prev]);
        setOldestMessageId(res.data.messages[0].id);
        setHasMore(res.data.hasMore || false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      message.error('Failed to load older messages');
    } finally {
      setLoadingOlder(false);
    }
  };

  // Detect scroll to top
  const handleScroll = (e) => {
    const container = e.target;
    if (container.scrollTop === 0 && !loadingOlder && hasMore) {
      loadOlderMessages();
    }
  };

  // Join conversation room
  useEffect(() => {
    if (socket && conversationId) {
      socket.emit('join_conversation', { conversationId });
    }
  }, [conversationId, socket]);

  // Socket event listeners (same as before)
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
  // Set conversationId if it's not already set (important!)
  if (!conversationId && msg.conversation_id) {
    setConversationId(Number(msg.conversation_id));
  }
  
  if (msg.sender_id === activeChat.id || msg.sender_id === user.id) {
    setMessages((prev) => [...prev, msg]);
    if (msg.sender_id !== user.id && (conversationId || msg.conversation_id)) {
      const convId = conversationId || msg.conversation_id;
      socket.emit('message_delivered', { messageId: msg.id });
      socket.emit('mark_seen', { conversationId: convId });
    }
  }
};

    const handleMessageSent = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    // const handleMessagesSeen = ({ conversationId: seenConvId }) => {
    //   if (seenConvId === conversationId) {
    //     setMessages((prev) =>
    //       prev.map((m) =>
    //         m.sender_id !== user.id ? { ...m, status: 'seen' } : m
    //       )
    //     );
    //   }
    // };
   const handleMessagesSeen = ({ conversationId: seenConvId }) => {
  console.log('📨 messages_seen event', { seenConvId, currentConvId: conversationId });
  const currentConvId = Number(conversationId);
  const eventConvId = Number(seenConvId);
  if (currentConvId === eventConvId && currentConvId) {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.sender_id !== user.id ? { ...msg, status: 'seen' } : msg
      )
    );
  } else {
    // fallback: update messages that belong to this conversation
    setMessages((prev) =>
      prev.map((msg) =>
        msg.sender_id !== user.id && msg.conversation_id === eventConvId
          ? { ...msg, status: 'seen' }
          : msg
      )
    );
  }
};

    const handleMessageEdited = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m))
      );
    };

    const handleMessageDeleted = ({ messageId, updatedMessage, permanentlyDeleted }) => {
      if (permanentlyDeleted) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      } else if (updatedMessage) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? updatedMessage : m))
        );
      }
    };

    const handleMessageStatusUpdated = ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status } : m))
      );
    };

      const handleUserTyping = ({ userId: typingUserId, isTyping: typing }) => {
      console.log(`📥 Received user_typing: userId=${typingUserId}, isTyping=${typing}`);
      const otherUserId = Number(activeChat.id);
      if (typingUserId === otherUserId) {
        setIsTyping(typing);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_sent', handleMessageSent);
    socket.on('messages_seen', handleMessagesSeen);
    socket.on('message_edited', handleMessageEdited);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('message_status_updated', handleMessageStatusUpdated);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_sent', handleMessageSent);
      socket.off('messages_seen', handleMessagesSeen);
      socket.off('message_edited', handleMessageEdited);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('message_status_updated', handleMessageStatusUpdated);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, activeChat, conversationId, user.id]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages();
    }
  }, [activeChat]);

 
  // Handlers same as before
  const handleSend = (content, gif, replyToId = null) => {
    if (!content && !gif) return;
    socket.emit('send_message', {
      toUserId: parseInt(activeChat.id),
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

  const confirmDeleteConversation = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/delete-conversation/${activeChat.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Conversation deleted');
      setActiveChat(null);
    } catch (err) {
      message.error('Failed to delete');
    }
  };

  const handleReportUser = () => {
    message.info('Report user – please use the flag icon on individual messages.');
  };

  const handleReportMessage = async (msgId) => {
    const reason = prompt('Reason for reporting this message (optional):');
    if (reason === null) return;
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/api/report-message',
        { messageId: msgId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Message reported');
    } catch (err) {
      message.error('Failed to report');
    }
  };

  const handleTyping = (isUserTyping) => {
    if (!socket) return;
     console.log(`📤 Emitting typing: toUserId=${activeChat.id}, isTyping=${isUserTyping}`);
    const targetUserId = Number(activeChat.id);
    socket.emit('typing', { toUserId: targetUserId, isTyping: isUserTyping });
    if (isUserTyping && typingTimeout) clearTimeout(typingTimeout);
    if (!isUserTyping) return;
    setTypingTimeout(
      setTimeout(() => {
        socket.emit('typing', { toUserId: activeChat.id, isTyping: false });
      }, 2000)
    );
  };

  const items = [
    {
      key: '1',
      label: (
        <Popconfirm
          title="Delete Chat"
          description="Are you sure you want to delete this chat?"
          onConfirm={confirmDeleteConversation}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          okText="Delete"
          cancelText="No, Keep"
          okButtonProps={{
            style: { backgroundColor: 'red', borderColor: 'red', height: '30px', color: '#fff', borderRadius: '5px' },
          }}
          cancelButtonProps={{
            style: { backgroundColor: 'skyblue', height: '30px', color: '#fff', borderRadius: '5px' },
          }}
        >
          <DeleteOutlined /> Delete this Chat
        </Popconfirm>
      ),
    },
    {
      key: '2',
      label: (
        <span onClick={handleReportUser}>
          <FlagOutlined /> Report this Chat
        </span>
      ),
    },
  ];

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-left">
          {window.innerWidth <= 1000 && (
            <button className="back-button" onClick={() => setActiveChat(null)}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
          )}
          <div className="chat-avatar-div">
            <img src={activeChat.avatar_url} alt={activeChat.username} className="chat-avatar" />
            <div className="online-status-chat"></div>
          </div>
          <div className="chat-user-info">
            <span className="chat-username">{activeChat.username}</span>
            {isTyping && <div className="typing-indicator"><span></span><span></span><span></span></div>}
          </div>
        </div>
        <div className="chat-header-right" style={{ cursor: "pointer" }}>
          <Dropdown menu={{ items }} placement="bottom">
            <FontAwesomeIcon icon={faBarsStaggered} className='back-button' />
          </Dropdown>
        </div>
      </div>

      <div className="message-list" onScroll={handleScroll}>
        {loadingOlder && (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <Spin size="small" />
          </div>
        )}
        <MessageList
          messages={messages}
          currentUserId={parseInt(user.id)}
          onReplyMessage={handleReply}
          onEditMessage={handleEdit}
          onDeleteMessage={handleDeleteMessage}
          onReportMessage={handleReportMessage}
          scrollToBottomRef={messagesEndRef}
        />
   
      </div>

      <MessageInput
        onSend={handleSend}
        onTyping={handleTyping}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
        editMessage={editMessage}
        setEditMessage={setEditMessage}
        onEditMessage={handleEditMessage}
      />
    </div>
  );
};

export default ChatWindow;