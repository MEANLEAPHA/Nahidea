import React, { useState } from 'react';
import { Input, Button, Popover, Space, Image, message } from 'antd';
import { SendOutlined, GifOutlined, SmileOutlined } from '@ant-design/icons';
import GifPicker from './GifPicker';

const { TextArea } = Input;

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('');
  const [selectedGif, setSelectedGif] = useState(null);
  const [gifPickerVisible, setGifPickerVisible] = useState(false);

  const handleSend = () => {
    if (!text.trim() && !selectedGif) return;
    onSend(text, selectedGif);
    setText('');
    setSelectedGif(null);
    setGifPickerVisible(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ padding: '12px 20px', borderTop: '1px solid var(--secondary-color)', background: 'var(--back-con)' }}>
      {selectedGif && (
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Image src={selectedGif.gif_url} width={80} preview={false} />
          <Button size="small" onClick={() => setSelectedGif(null)}>Remove</Button>
        </div>
      )}
      <Space.Compact style={{ width: '100%' }}>
        <Popover
          content={<GifPicker onSelect={(gif) => { setSelectedGif(gif); setGifPickerVisible(false); }} />}
          trigger="click"
          open={gifPickerVisible}
          onOpenChange={setGifPickerVisible}
          placement="top"
        >
          <Button icon={<GifOutlined />} />
        </Popover>
        <TextArea
          autoSize={{ minRows: 1, maxRows: 4 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message or select GIF..."
          style={{ resize: 'none' }}
        />
        <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>Send</Button>
      </Space.Compact>
    </div>
  );
};

export default MessageInput;