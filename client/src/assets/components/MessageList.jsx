import React from 'react';
import { List, Avatar, Typography, Space, Button, Tooltip, Image } from 'antd';
import { FlagOutlined, CheckOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MessageList = ({ messages, currentUserId, onReportMessage }) => {
  const getStatusIcon = (status) => {
    if (status === 'sent') return <CheckOutlined style={{ fontSize: 12, color: '#aaa' }} />;
    if (status === 'delivered') return <CheckCircleOutlined style={{ fontSize: 12, color: '#aaa' }} />;
    if (status === 'seen') return <CheckCircleOutlined style={{ fontSize: 12, color: '#fd7648' }} />;
    return null;
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      {messages.map((msg) => {
        const isMe = msg.sender_id === currentUserId;
        return (
          <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
            {!isMe && <Avatar src={msg.avatar} size={32} style={{ marginRight: 8 }} />}
            <div style={{ maxWidth: '70%', background: isMe ? 'var(--primary-color)' : 'var(--secondary-color)', padding: '8px 12px', borderRadius: 12, color: isMe ? '#fff' : 'var(--font-color)' }}>
              {!isMe && <Text strong style={{ fontSize: 12, display: 'block' }}>{msg.username}</Text>}
              {msg.gif_url && <Image src={msg.gif_url} width={200} preview={false} style={{ borderRadius: 8, marginBottom: 4 }} />}
              {msg.content && <Text style={{ color: 'inherit' }}>{msg.content}</Text>}
              <div style={{ fontSize: 10, marginTop: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
                <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                {isMe && getStatusIcon(msg.status)}
                {!isMe && (
                  <Tooltip title="Report message">
                    <Button type="text" size="small" icon={<FlagOutlined />} onClick={() => onReportMessage(msg.id)} style={{ color: '#ff4d4f' }} />
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;