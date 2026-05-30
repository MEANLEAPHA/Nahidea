import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Typography, Button, Dropdown, Menu, message, Modal } from 'antd';
import { MoreOutlined, DeleteOutlined, FlagOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import api from '../services/api';
import { getSocket } from '../../socket';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const ChatWindow = ({ activeChat, setActiveChat }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const socket = getSocket();
    const messagesEndRef = useRef(null);
    const [typingTimeout, setTypingTimeout] = useState(null);

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/api/get-messages/${activeChat.id}`);
            setConversationId(res.data.conversationId);
            setMessages(res.data.messages);
            // Mark as seen via socket
            if (socket && res.data.conversationId) {
                socket.emit('mark_seen', { conversationId: res.data.conversationId });
            }
        } catch (err) {
            message.error('Failed to load messages');
        }
    };

    useEffect(() => {
        if (activeChat) {
            fetchMessages();
            if (socket) {
                socket.on('new_message', (msg) => {
                    if (msg.sender_id === activeChat.id || msg.sender_id === user.id) {
                        setMessages(prev => [...prev, msg]);
                        // If message is from other user, mark seen immediately
                        if (msg.sender_id !== user.id && conversationId) {
                            socket.emit('mark_seen', { conversationId });
                        }
                    }
                });
                socket.on('messages_seen', ({ conversationId: seenConvId }) => {
                    if (seenConvId === conversationId) {
                        setMessages(prev => prev.map(m => 
                            m.sender_id !== user.id ? { ...m, status: 'seen' } : m
                        ));
                    }
                });
            }
        }
        return () => {
            if (socket) {
                socket.off('new_message');
                socket.off('messages_seen');
            }
        };
    }, [activeChat, conversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (content, gif) => {
        if (!content && !gif) return;
        socket.emit('send_message', {
            toUserId: activeChat.id,
            content: content || null,
            gifId: gif?.id || null,
            gifUrl: gif?.gif_url || null,
        });
    };

    const handleDeleteConversation = () => {
        Modal.confirm({
            title: 'Delete chat',
            content: 'This will delete the conversation for you. The other person can still see it unless they also delete.',
            onOk: async () => {
                try {
                    await api.delete(`/api/delete-conversation/${activeChat.id}`);
                    message.success('Conversation deleted');
                    setActiveChat(null);
                } catch (err) {
                    message.error('Failed to delete');
                }
            }
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
            <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={handleDeleteConversation}>Delete conversation</Menu.Item>
            <Menu.Item key="report" icon={<FlagOutlined />} onClick={handleReport}>Report user</Menu.Item>
        </Menu>
    );

    const handleTyping = (isTyping) => {
        if (!socket) return;
        socket.emit('typing', { toUserId: activeChat.id, isTyping });
        if (isTyping && typingTimeout) clearTimeout(typingTimeout);
        if (!isTyping) return;
        setTypingTimeout(setTimeout(() => {
            socket.emit('typing', { toUserId: activeChat.id, isTyping: false });
        }, 2000));
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--background-color)' }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--secondary-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => setActiveChat(null)} style={{ display: 'none', '@media (max-width: 768px)': { display: 'block' } }} />
                    <Avatar src={activeChat.avatar} size={40} style={{ backgroundColor: '#fd7648' }}>{activeChat.username[0]}</Avatar>
                    <Title level={4} style={{ margin: 0, color: 'var(--font-color)' }}>{activeChat.username}</Title>
                </div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon={<MoreOutlined />} type="text" />
                </Dropdown>
            </div>
            <MessageList messages={messages} currentUserId={user.id} onReportMessage={(msgId) => {
                Modal.confirm({
                    title: 'Report message',
                    content: <Input.TextArea placeholder="Reason (optional)" id="reportReason" />,
                    onOk: async () => {
                        const reason = document.getElementById('reportReason')?.value;
                        try {
                            await api.post('/api/report-message', { messageId: msgId, reason });
                            message.success('Message reported');
                        } catch (err) {
                            message.error('Failed to report');
                        }
                    }
                });
            }} />
            <MessageInput onSend={handleSend} onTyping={handleTyping} />
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatWindow;