

// import React, { useState, useEffect } from 'react';
// import Sidebar from '../components/Sidebar';
// import ChatWindow from '../components/ChatWindow';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faWineGlassEmpty } from '@fortawesome/free-solid-svg-icons';
// import '../style/page/chat.css';

// // Custom hook for responsive design
// const useMediaQuery = (query) => {
//   const [matches, setMatches] = useState(false);
//   useEffect(() => {
//     const media = window.matchMedia(query);
//     if (media.matches !== matches) setMatches(media.matches);
//     const listener = () => setMatches(media.matches);
//     window.addEventListener('resize', listener);
//     return () => window.removeEventListener('resize', listener);
//   }, [matches, query]);
//   return matches;
// };

// export default function Chat() {
//   const [activeChat, setActiveChat] = useState(null);
//   const isMobile = useMediaQuery('(max-width: 1000px)');
//   const handleBack = () => setActiveChat(null);

//   if (isMobile) {
//     return (
//       <div className="chat-container">
//         {activeChat ? (
//           <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} onBack={handleBack} />
//         ) : (
//           <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} />
//         )}
//       </div>
//     );
//   }

//   // Desktop view: always show sidebar and chat window (or empty state)
//   return (
//     <div className="chat-container">
      
//       {activeChat ? (
//         <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} />
//       ) : (
//         <div className="empty-div">
//           <FontAwesomeIcon icon={faWineGlassEmpty} id="empty-glass" />
//           Select a chat to start gossiping
//         </div>
//       )}
//       <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} />
//     </div>
    
//   );
// }

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWineGlassEmpty } from '@fortawesome/free-solid-svg-icons';
import '../style/page/chat.css';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);
  return matches;
};

export default function Chat() {
  const [activeChat, setActiveChat] = useState(null);
  const isMobile = useMediaQuery('(max-width: 1000px)');
  const handleBack = () => setActiveChat(null);

  if (isMobile) {
    return (
      <div className="chat-container">
        {activeChat ? (
          <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} onBack={handleBack} />
        ) : (
          <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} />
        )}
      </div>
    );
  }

  return (
    <div className="chat-container">
   
      {activeChat ? (
        <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} />
      ) : (
        <div className="empty-div">
          <FontAwesomeIcon icon={faWineGlassEmpty} id="empty-glass" />
          Select a chat to start gossiping
        </div>
      )}
         <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} />
    </div>
  );
}