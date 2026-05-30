import React from 'react';
import { Avatar, Typography, Button, Tooltip, Image, Space } from 'antd';
import { FlagOutlined, CheckOutlined, CheckCircleOutlined, MessageOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MessageList = ({ messages, currentUserId, onReplyMessage, onEditMessage, onDeleteMessage, onReportMessage }) => {
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
        const isDeletedForMe =
          (msg.deleted_by_sender && isMe) || (msg.deleted_by_recipient && !isMe);
        const isDeletedForBoth = msg.deleted_by_sender && msg.deleted_by_recipient;

        if (isDeletedForBoth) return null; // permanently deleted, don't show

        return (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: isMe ? 'flex-end' : 'flex-start',
              marginBottom: 12,
            }}
          >
            {!isMe && <Avatar src={msg.avatar} size={32} style={{ marginRight: 8 }} />}
            <div
              style={{
                maxWidth: '70%',
                background: isMe ? 'var(--primary-color)' : 'var(--secondary-color)',
                padding: '8px 12px',
                borderRadius: 12,
                color: isMe ? '#fff' : 'var(--font-color)',
              }}
            >
              {!isMe && (
                <Text strong style={{ fontSize: 12, display: 'block' }}>
                  {msg.username}
                </Text>
              )}

              {/* Reply context */}
              {msg.reply_to_id && (
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.7,
                    marginBottom: 4,
                    borderLeft: '2px solid #fd7648',
                    paddingLeft: 8,
                  }}
                >
                  Replying to: {msg.reply_preview || 'a message'}
                </div>
              )}

              {/* GIF */}
              {msg.gif_url && (
                <Image
                  src={msg.gif_url}
                  width={200}
                  preview={false}
                  style={{ borderRadius: 8, marginBottom: 4 }}
                />
              )}

              {/* Content or deleted placeholder */}
              {isDeletedForMe ? (
                <Text italic style={{ color: 'inherit' }}>
                  {isMe ? 'You deleted this message' : 'This message was deleted'}
                </Text>
              ) : (
                <Text style={{ color: 'inherit' }}>{msg.content}</Text>
              )}

              {msg.is_edited && !isDeletedForMe && (
                <Text style={{ fontSize: 10, marginLeft: 8 }}>(edited)</Text>
              )}

              <div
                style={{
                  fontSize: 10,
                  marginTop: 4,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                {isMe && getStatusIcon(msg.status)}

                <Space size={4}>
                  {!isMe && (
                    <Tooltip title="Reply">
                      <Button
                        type="text"
                        size="small"
                        icon={<MessageOutlined />}
                        onClick={() => onReplyMessage(msg)}
                        style={{ color: 'inherit' }}
                      />
                    </Tooltip>
                  )}
                  {isMe && (
                    <>
                      <Tooltip title="Edit">
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => onEditMessage(msg)}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Button
                          type="text"
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => onDeleteMessage(msg.id)}
                          danger
                        />
                      </Tooltip>
                    </>
                  )}
                  {!isMe && (
                    <Tooltip title="Report">
                      <Button
                        type="text"
                        size="small"
                        icon={<FlagOutlined />}
                        onClick={() => onReportMessage(msg.id)}
                        style={{ color: '#ff4d4f' }}
                      />
                    </Tooltip>
                  )}
                </Space>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;