import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import '../style/page/Chat.css';

export default function Chat () {
    const [activeChat, setActiveChat] = useState(null);
    return (
        <div className="chat-container">  
        
            {activeChat ? (
            <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} />
            ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--font-color)' }}>
                Select a chat to start messaging
            </div>
            )} 
                <Sidebar activeChat={activeChat} setActiveChat={setActiveChat}/>
        </div>
    )
}