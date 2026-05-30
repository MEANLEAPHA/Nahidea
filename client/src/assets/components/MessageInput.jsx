// import React, { useState, useEffect } from 'react';
// import { Input, Button, Popover, Space, Image } from 'antd';
// import { SendOutlined, GifOutlined, CloseOutlined } from '@ant-design/icons';
// import GifPicker from './GifPicker';

// const { TextArea } = Input;

// const MessageInput = ({
//   onSend,
//   onTyping,
//   replyTo,
//   setReplyTo,
//   editMessage,
//   setEditMessage,
//   onEditMessage,
// }) => {
//   const [text, setText] = useState('');
//   const [selectedGif, setSelectedGif] = useState(null);
//   const [gifPickerVisible, setGifPickerVisible] = useState(false);

//   useEffect(() => {
//     if (editMessage) {
//       setText(editMessage.content || '');
//       setSelectedGif(editMessage.gif_url ? editMessage : null);
//     } else {
//       setText('');
//       setSelectedGif(null);
//     }
//   }, [editMessage]);

//   const handleSend = () => {
//     if (!text.trim() && !selectedGif) return;
//     if (editMessage) {
//       onEditMessage(editMessage.id, text, selectedGif);
//       setEditMessage(null);
//     } else {
//       onSend(text, selectedGif, replyTo?.id);
//       setReplyTo(null);
//     }
//     setText('');
//     setSelectedGif(null);
//     setGifPickerVisible(false);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const handleTextChange = (e) => {
//     setText(e.target.value);
//     onTyping(true);
//   };

//   const cancelReply = () => setReplyTo(null);
//   const cancelEdit = () => setEditMessage(null);

//   return (
//     <div style={{ padding: '12px 20px', borderTop: '1px solid var(--secondary-color)', background: 'var(--back-con)' }}>
//       {/* Reply context banner */}
//       {replyTo && (
//         <div
//           style={{
//             background: 'var(--secondary-color)',
//             padding: '4px 8px',
//             fontSize: 12,
//             borderRadius: 8,
//             marginBottom: 8,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <span>Replying to: {replyTo.content?.substring(0, 50) || 'GIF message'}</span>
//           <Button type="text" size="small" icon={<CloseOutlined />} onClick={cancelReply} />
//         </div>
//       )}

//       {/* Edit mode banner */}
//       {editMessage && (
//         <div
//           style={{
//             background: 'var(--secondary-color)',
//             padding: '4px 8px',
//             fontSize: 12,
//             borderRadius: 8,
//             marginBottom: 8,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <span>Editing message</span>
//           <Button type="text" size="small" icon={<CloseOutlined />} onClick={cancelEdit} />
//         </div>
//       )}

//       {/* Selected GIF preview */}
//       {selectedGif && (
//         <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
//           <Image src={selectedGif.gif_url} width={80} preview={false} />
//           <Button size="small" onClick={() => setSelectedGif(null)}>
//             Remove
//           </Button>
//         </div>
//       )}

//       <Space.Compact style={{ width: '100%' }}>
//         <Popover
//           content={<GifPicker onSelect={(gif) => { setSelectedGif(gif); setGifPickerVisible(false); }} />}
//           trigger="click"
//           open={gifPickerVisible}
//           onOpenChange={setGifPickerVisible}
//           placement="top"
//         >
//           <Button icon={<GifOutlined />} />
//         </Popover>

//         <TextArea
//           autoSize={{ minRows: 1, maxRows: 4 }}
//           value={text}
//           onChange={handleTextChange}
//           onKeyPress={handleKeyPress}
//           placeholder={editMessage ? 'Edit your message...' : 'Type a message or select GIF...'}
//           style={{ resize: 'none' }}
//         />

//         <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
//           {editMessage ? 'Update' : 'Send'}
//         </Button>
//       </Space.Compact>
//     </div>
//   );
// };

// export default MessageInput;

import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MessageInput = ({ onSend, onTyping, replyTo, setReplyTo, editMessage, setEditMessage, onEditMessage }) => {
  const [text, setText] = useState('');
  const [selectedGif, setSelectedGif] = useState(null);
  const [gifSearch, setGifSearch] = useState('');
  const [gifs, setGifs] = useState([]);
  const [showGifPicker, setShowGifPicker] = useState(false);

  useEffect(() => {
    if (editMessage) {
      setText(editMessage.content || '');
      setSelectedGif(editMessage.gif_url ? editMessage : null);
    } else {
      setText('');
      setSelectedGif(null);
    }
  }, [editMessage]);

  useEffect(() => {
    if (gifSearch) {
      api.get(`/api/gifs?q=${gifSearch}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(res => setGifs(res.data)).catch(console.error);
    } else {
      setGifs([]);
    }
  }, [gifSearch]);

  const handleSend = () => {
    if (!text.trim() && !selectedGif) return;
    if (editMessage) {
      onEditMessage(editMessage.id, text, selectedGif);
      setEditMessage(null);
    } else {
      onSend(text, selectedGif, replyTo?.id);
      setReplyTo(null);
    }
    setText('');
    setSelectedGif(null);
    setShowGifPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    onTyping(true);
  };

  return (
    <div className="message-input-container">
      {(replyTo || editMessage) && (
        <div className="input-banner">
          {replyTo && <span>Replying to: {replyTo.content?.substring(0, 50)}</span>}
          {editMessage && <span>Editing message</span>}
          <button onClick={() => { setReplyTo(null); setEditMessage(null); }}>✖</button>
        </div>
      )}
      {selectedGif && (
        <div className="selected-gif-preview">
          <img src={selectedGif.gif_url} alt="gif" width="80" />
          <button onClick={() => setSelectedGif(null)}>Remove</button>
        </div>
      )}
      <div className="input-row">
        <button className="gif-button" onClick={() => setShowGifPicker(!showGifPicker)}>GIF</button>
        <textarea
          className="message-textarea"
          rows={1}
          value={text}
          onChange={handleTextChange}
          onKeyPress={handleKeyPress}
          placeholder={editMessage ? 'Edit your message...' : 'Type a message...'}
        />
        <button className="send-button" onClick={handleSend}>
          {editMessage ? 'Update' : 'Send'}
        </button>
      </div>
      {showGifPicker && (
        <div className="gif-picker">
          <input
            type="text"
            placeholder="Search GIFs..."
            value={gifSearch}
            onChange={(e) => setGifSearch(e.target.value)}
            className="gif-search"
          />
          <div className="gif-list">
            {gifs.map(gif => (
              <img
                key={gif.id}
                src={gif.gif_url}
                alt={gif.gif_label}
                onClick={() => { setSelectedGif(gif); setShowGifPicker(false); }}
                className="gif-thumb"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;