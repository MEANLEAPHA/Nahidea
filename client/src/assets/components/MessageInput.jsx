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



// import React, { useState, useEffect } from 'react';
// import Masonry from 'react-masonry-css';
// import { SendOutlined, CheckOutlined, DeleteOutlined, RetweetOutlined } from '@ant-design/icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFaceGrinWink, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
// import { faXmark } from '@fortawesome/free-solid-svg-icons';
// import { EnterOutlined, EditOutlined } from '@ant-design/icons';
// import api from '../services/api';

// const MessageInput = ({ onSend, onTyping, replyTo, setReplyTo, editMessage, setEditMessage, onEditMessage }) => {
//   const [text, setText] = useState('');
//   const [selectedGif, setSelectedGif] = useState(null);
//   const [gifSearch, setGifSearch] = useState('');
//   const [gifs, setGifs] = useState([]);
//   const [showGifPicker, setShowGifPicker] = useState(false);

//   useEffect(() => {
//     if (editMessage) {
//       setText(editMessage.content || '');
//       setSelectedGif(editMessage.gif_url ? editMessage : null);
//     } else {
//       setText('');
//       setSelectedGif(null);
//     }
//   }, [editMessage]);

//   // Real GIF search from backend
//   useEffect(() => {
//     const fetchGifs = async () => {
//       if (!gifSearch.trim()) {
//         setGifs([]);
//         return;
//       }
//       try {
//         const token = localStorage.getItem('token');
//          const res = await api.get(`/api/search-gif?q=${encodeURIComponent(gifSearch)}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setGifs(res.data);
//       } catch (err) {
//         console.error('GIF search failed', err);
//       }
//     };
//     const debounce = setTimeout(fetchGifs, 300);
//     return () => clearTimeout(debounce);
//   }, [gifSearch]);

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
//     setShowGifPicker(false);
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

//   return (
//     <div className="message-input-container">
//      {(replyTo || editMessage) && (
//         <div className="input-banner">
//           {replyTo && !editMessage && (
//             <div className="reply-banner">
//               <span><EnterOutlined style={{ transform: 'scaleX(-1)', color: 'var(--primary-color)', fontSize: 18 }} /></span>
//               {replyTo.gif_url && <img src={replyTo.gif_url} alt="gif" width={50} />}
//               <span>{replyTo.content?.substring(0, 50)}</span>
//             </div>
//           )}
//           {editMessage && !replyTo && (
//             <span><EditOutlined /> Editing message</span>
//           )}
//           <button onClick={() => { setReplyTo(null); setEditMessage(null); }}>
//             <FontAwesomeIcon icon={faXmark} />
//           </button>
//         </div>
//       )}

//       {selectedGif && (
//         <div className="selected-gif-preview">
//           <img src={selectedGif.gif_url} alt="gif" className='preview-gif-holder' />
//           <div className='preview-gif-holder-action'>
//             <button onClick={() => setSelectedGif(null)} className='preview-gif-btn'><DeleteOutlined /></button>
//             <button onClick={() => setShowGifPicker(!showGifPicker)} className='preview-gif-btn'><RetweetOutlined /></button>
//           </div>
//         </div>
//       )}

//       <div className="input-row">
//         <button className="gif-button" onClick={() => setShowGifPicker(!showGifPicker)}>
//           <FontAwesomeIcon icon={faFaceGrinWink} />
//         </button>
//         <textarea
//           className="message-textarea"
//           rows={1}
//           value={text}
//           onChange={handleTextChange}
//           onKeyPress={handleKeyPress}
//           placeholder={editMessage ? 'Edit your message...' : 'Type a message...'}
//         />
//         <button className="send-button" onClick={handleSend}>
//           {editMessage ? <CheckOutlined /> : <SendOutlined />}
//         </button>
//       </div>

//       {showGifPicker && (
//         <div className="gif-picker">
//           <input
//             type="text"
//             placeholder="Search GIFs..."
//             value={gifSearch}
//             onChange={(e) => setGifSearch(e.target.value)}
//             className="gif-search"
//           />
//           <Masonry
//             breakpointCols={{ default: 3, 700: 2, 500: 2, 380: 1 }}
//             className="gif-masonry"
//             columnClassName="gif-masonry-column"
//           >
//             {gifs.map(gif => (
//               <img
//                 key={gif.id}
//                 src={gif.gif_url}
//                 alt={gif.gif_label}
//                 onClick={() => { setSelectedGif(gif); setShowGifPicker(false); }}
//                 className="gif-masonry-item"
//               />
//             ))}
//           </Masonry>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessageInput;

import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { SendOutlined, CheckOutlined, DeleteOutlined, RetweetOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceGrinWink } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { EnterOutlined, EditOutlined } from '@ant-design/icons';
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

  // Fetch GIFs (for both initial load and search)
  useEffect(() => {
    const fetchGifs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/api/search-gif?q=${encodeURIComponent(gifSearch)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGifs(res.data);
      } catch (err) {
        console.error('GIF search failed', err);
      }
    };
    const debounce = setTimeout(fetchGifs, 300);
    return () => clearTimeout(debounce);
  }, [gifSearch]);

  // When picker opens, trigger search with current gifSearch (empty → default GIFs)
  useEffect(() => {
    if (showGifPicker) {
      // No need to do anything – the gifSearch effect will run and fetch
      // But if gifSearch is empty, it will fetch default GIFs automatically
    }
  }, [showGifPicker]);

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
          {replyTo && !editMessage && (
            <div className="reply-banner">
              <span><EnterOutlined style={{ transform: 'scaleX(-1)', color: 'var(--primary-color)', fontSize: 18 }} /></span>
              {replyTo.gif_url && <img src={replyTo.gif_url} alt="gif" width={50} />}
              <span>{replyTo.content?.substring(0, 50)}</span>
            </div>
          )}
          {editMessage && !replyTo && (
            <span><EditOutlined /> Editing message</span>
          )}
          <button onClick={() => { setReplyTo(null); setEditMessage(null); }}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}

      {selectedGif && (
        <div className="selected-gif-preview">
          <img src={selectedGif.gif_url} alt="gif" className='preview-gif-holder' />
          <div className='preview-gif-holder-action'>
            <button onClick={() => setSelectedGif(null)} className='preview-gif-btn'><DeleteOutlined /></button>
            <button onClick={() => setShowGifPicker(!showGifPicker)} className='preview-gif-btn'><RetweetOutlined /></button>
          </div>
        </div>
      )}

      <div className="input-row">
        <button className="gif-button" onClick={() => setShowGifPicker(!showGifPicker)}>
          <FontAwesomeIcon icon={faFaceGrinWink} />
        </button>
        <textarea
          className="message-textarea"
          rows={1}
          value={text}
          onChange={handleTextChange}
          onKeyPress={handleKeyPress}
          placeholder={editMessage ? 'Edit your message...' : 'Type a message...'}
        />
        <button className="send-button" onClick={handleSend}>
          {editMessage ? <CheckOutlined /> : <SendOutlined />}
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
          <Masonry
            breakpointCols={{ default: 3, 700: 2, 500: 2, 380: 1 }}
            className="gif-masonry"
            columnClassName="gif-masonry-column"
          >
            {gifs.map(gif => (
              <img
                key={gif.id}
                src={gif.gif_url}
                alt={gif.gif_label}
                onClick={() => { setSelectedGif(gif); setShowGifPicker(false); }}
                className="gif-masonry-item"
              />
            ))}
          </Masonry>
        </div>
      )}
    </div>
  );
};

export default MessageInput;