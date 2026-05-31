// import React from 'react';
// import { Avatar, Typography, Button, Tooltip, Image, Space } from 'antd';
// import { FlagOutlined, CheckOutlined, CheckCircleOutlined, MessageOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// const { Text } = Typography;

// const MessageList = ({ messages, currentUserId, onReplyMessage, onEditMessage, onDeleteMessage, onReportMessage }) => {
//   const getStatusIcon = (status) => {
//     if (status === 'sent') return <CheckOutlined style={{ fontSize: 12, color: '#aaa' }} />;
//     if (status === 'delivered') return <CheckCircleOutlined style={{ fontSize: 12, color: '#aaa' }} />;
//     if (status === 'seen') return <CheckCircleOutlined style={{ fontSize: 12, color: '#fd7648' }} />;
//     return null;
//   };

//   return (
//     <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
//       {messages.map((msg) => {
//         const isMe = msg.sender_id === currentUserId;
//         const isDeletedForMe =
//           (msg.deleted_by_sender && isMe) || (msg.deleted_by_recipient && !isMe);
//         const isDeletedForBoth = msg.deleted_by_sender && msg.deleted_by_recipient;

//         if (isDeletedForBoth) return null; // permanently deleted, don't show

//         return (
//           <div
//             key={msg.id}
//             style={{
//               display: 'flex',
//               justifyContent: isMe ? 'flex-end' : 'flex-start',
//               marginBottom: 12,
//             }}
//           >
//             {!isMe && <Avatar src={msg.avatar} size={32} style={{ marginRight: 8 }} />}
//             <div
//               style={{
//                 maxWidth: '70%',
//                 background: isMe ? 'var(--primary-color)' : 'var(--secondary-color)',
//                 padding: '8px 12px',
//                 borderRadius: 12,
//                 color: isMe ? '#fff' : 'var(--font-color)',
//               }}
//             >
//               {!isMe && (
//                 <Text strong style={{ fontSize: 12, display: 'block' }}>
//                   {msg.username}
//                 </Text>
//               )}

//               {/* Reply context */}
//               {msg.reply_to_id && (
//                 <div
//                   style={{
//                     fontSize: 12,
//                     opacity: 0.7,
//                     marginBottom: 4,
//                     borderLeft: '2px solid #fd7648',
//                     paddingLeft: 8,
//                   }}
//                 >
//                   Replying to: {msg.reply_preview || 'a message'}
//                 </div>
//               )}

//               {/* GIF */}
//               {msg.gif_url && (
//                 <Image
//                   src={msg.gif_url}
//                   width={200}
//                   preview={false}
//                   style={{ borderRadius: 8, marginBottom: 4 }}
//                 />
//               )}

//               {/* Content or deleted placeholder */}
//               {isDeletedForMe ? (
//                 <Text italic style={{ color: 'inherit' }}>
//                   {isMe ? 'You deleted this message' : 'This message was deleted'}
//                 </Text>
//               ) : (
//                 <Text style={{ color: 'inherit' }}>{msg.content}</Text>
//               )}

//               {msg.is_edited && !isDeletedForMe && (
//                 <Text style={{ fontSize: 10, marginLeft: 8 }}>(edited)</Text>
//               )}

//               <div
//                 style={{
//                   fontSize: 10,
//                   marginTop: 4,
//                   display: 'flex',
//                   justifyContent: 'flex-end',
//                   alignItems: 'center',
//                   gap: 8,
//                 }}
//               >
//                 <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
//                 {isMe && getStatusIcon(msg.status)}

//                 <Space size={4}>
//                   {!isMe && (
//                     <Tooltip title="Reply">
//                       <Button
//                         type="text"
//                         size="small"
//                         icon={<MessageOutlined />}
//                         onClick={() => onReplyMessage(msg)}
//                         style={{ color: 'inherit' }}
//                       />
//                     </Tooltip>
//                   )}
//                   {isMe && (
//                     <>
//                       <Tooltip title="Edit">
//                         <Button
//                           type="text"
//                           size="small"
//                           icon={<EditOutlined />}
//                           onClick={() => onEditMessage(msg)}
//                         />
//                       </Tooltip>
//                       <Tooltip title="Delete">
//                         <Button
//                           type="text"
//                           size="small"
//                           icon={<DeleteOutlined />}
//                           onClick={() => onDeleteMessage(msg.id)}
//                           danger
//                         />
//                       </Tooltip>
//                     </>
//                   )}
//                   {!isMe && (
//                     <Tooltip title="Report">
//                       <Button
//                         type="text"
//                         size="small"
//                         icon={<FlagOutlined />}
//                         onClick={() => onReportMessage(msg.id)}
//                         style={{ color: '#ff4d4f' }}
//                       />
//                     </Tooltip>
//                   )}
//                 </Space>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default MessageList;

import React from 'react';
import { EnterOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan, faShareFromSquare } from '@fortawesome/free-regular-svg-icons';

const MessageList = ({ messages, currentUserId, onReplyMessage, onEditMessage, onDeleteMessage, onReportMessage, scrollToBottomRef }) => {
  const getStatusIcon = (status) => {
    if (status === 'sent') return <FontAwesomeIcon icon={faCheck} />;
    if (status === 'delivered') return 'Delivered';
    if (status === 'seen') return <FontAwesomeIcon icon={faCheckDouble} style={{ color: 'yellowgreen' }} />;
    return '';
  };
  useEffect(() => {
  const timeout = setTimeout(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 100);
  return () => clearTimeout(timeout);
}, [messages]);

  return (
    <div className="message-list">
      {messages.map((msg) => {
        const isMe = msg.sender_id === currentUserId;
        // When sender deletes their own message, it becomes deleted for EVERYONE
        const isDeleted = msg.deleted_by_sender === 1;

        // If both flags are true (rare), don't show at all
        if (msg.deleted_by_sender && msg.deleted_by_recipient) return null;

        return (
          <div key={msg.id} className={`message-item ${isMe ? 'message-me' : 'message-other'}`}>
            {!isMe && <img src={msg.avatar} alt={msg.username} className="message-avatar" />}
            {isMe && (
              <div className="message-actions">
                <button className="message-action-btn" onClick={() => onEditMessage(msg)}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button className="message-action-btn" onClick={() => onDeleteMessage(msg.id)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            )}
            <div className="message-bubble">
              {!isMe && <div className="message-username">{msg.username}</div>}

              {/* Reply context */}
              {msg.reply_to_id && (
                <div className="message-reply-context">
                  <EnterOutlined style={{ transform: 'scaleX(-1)' }} />
                  {msg.reply_gif_preview && <img src={msg.reply_gif_preview} alt="gif" className="reply_gif_preview" />}
                  {msg.reply_preview || 'Reply to a message'}
                </div>
              )}

              {/* GIF */}
              {msg.gif_url && <img src={msg.gif_url} alt="gif" className="message-gif" />}

              {/* Content or deleted placeholder */}
              {isDeleted ? (
                <div className="message-deleted">{isMe ? 'You deleted this message' : 'This message was deleted'}</div>
              ) : (
                <div className="message-text">
                  {msg.content}
                   {msg.is_edited === 1 && <span className="message-edited">Edit*</span>}
                </div>
              )}

              <div className="message-footer">
                <span className="message-time">
                  {msg.created_at === 'Just now' ? 'Just now' : new Date(msg.created_at).toLocaleTimeString()}
                </span>
                {isMe && (
                  <span className="message-status" style={{ color: '#c3c3c3' }}>
                    {getStatusIcon(msg.status)}
                  </span>
                )}
              </div>
            </div>
            {!isMe && (
              <div className="message-actions">
                <button className="message-action-btn" onClick={() => onReplyMessage(msg)}>
                  <FontAwesomeIcon icon={faShareFromSquare} /> <small>Reply</small>
                </button>
              </div>
            )}
          </div>
        );
      })}
        <div ref={scrollToBottomRef} />
    </div>
  );
};

export default MessageList;