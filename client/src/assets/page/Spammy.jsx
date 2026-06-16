import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/page/Spammy.css";

export default function Spammy() {
  const [inbox, setInbox] = useState([]);
  const [activeSpam, setActiveSpam] = useState(null);

  const [receiverId, setReceiverId] = useState("");
  const [spamType, setSpamType] = useState("poke");

  const [unreadCount, setUnreadCount] = useState(0);
const [sentSpam, setSentSpam] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

useEffect(() => {
  fetchInbox();
  fetchUnreadCount();
  fetchSentSpam();
}, []);
const fetchSentSpam = async () => {
  try {

    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/spam/sent`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setSentSpam(res.data);

  } catch (err) {
    console.error(err);
  }
};
  const fetchInbox = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/spam/inbox`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setInbox(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/spam/unread-count`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUnreadCount(res.data.unread);
    } catch (err) {
      console.error(err);
    }
  };

  const sendSpam = async () => {
    if (!receiverId) return;

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/spam/send`, {
        receiver_id: receiverId,
        spam_type: spamType,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Spam sent 🚀");

      setReceiverId("");
      fetchSentSpam();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed");
    }
  };

  const openSpam = async (spam) => {
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/spam/view/${spam.spam_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setActiveSpam(spam);

      setUnreadCount((prev) => Math.max(prev - 1, 0));

      setShowCelebration(true);

      setTimeout(() => {
        setShowCelebration(false);
      }, 10000);

      fetchInbox();
    } catch (err) {
      console.error(err);
    }
  };

  const getSpamAsset = (type) => {
    switch (type) {
      case "poke":
        return "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyODNycmo3NHdiOTF1Mmo4anY3OWlleTg2MnR3MHB4Zm40N3VnbDU3YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/PkR8gPgc2mDlrMSgtu/200.gif";

      case "goodnight":
        return "https://media.tenor.com/LBppk55tCvsAAAAM/meme.gif";

      case "sendlove":
        return "https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUycncyOG5hZTdxc3lrMTB0NzJkem4waHl0bWlqMHBpZDF2MmphMnplYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ytu2GUYbvhz7zShGwS/giphy.gif";

      default:
        return "https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyenFzZmFmbDJqYjhwNW5kNTZqMHl3YzY4M24xN3R2bWxxZWR4NnNoaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/t8xgPfC5oNIRMrNooe/giphy.gif";
    }
  };

  return (
    <div className="spam-dashboard">
      <div className="spam-header">
        <h1>Spammy</h1>

        <div className="spam-badge">
          {unreadCount} unread
        </div>
      </div>

      <div className="spam-grid">
        {/* SEND PANEL */}

        <div className="send-panel">
          <h2>Send Spam</h2>

          <input
            type="number"
            placeholder="Receiver User ID"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          />

          <select
            value={spamType}
            onChange={(e) => setSpamType(e.target.value)}
          >
            <option value="poke">Poke</option>
            <option value="goodnight">Good Night</option>
            <option value="sendlove">Send Love</option>
          </select>

          <button onClick={sendSpam}>
            Send
          </button>
        </div>

        {/* INBOX */}

        <div className="inbox-panel">
          <h2>Inbox</h2>

          {inbox.length === 0 && (
            <div className="empty-state">
              No spam received
            </div>
          )}

          {inbox.map((spam) => (
            <div
              key={spam.spam_id}
              className={`spam-card ${
                spam.is_viewed ? "" : "unread"
              }`}
              onClick={() => openSpam(spam)}
            >
              <div>
                <h3>{spam.spam_type}</h3>

                <p>
                  From User #{spam.sender_id}
                </p>
              </div>

              {!spam.is_viewed && (
                <div className="unread-dot"></div>
              )}
            </div>
          ))}
        </div>
        <div className="sent-panel">

  <h2>Your Sent Spam</h2>

  {sentSpam.length === 0 && (
    <div className="empty-state">
      No spam sent yet
    </div>
  )}

  {sentSpam.map((spam) => (
    <div
      key={spam.spam_id}
      className="sent-card"
    >

      <div>
        <h4>{spam.spam_type}</h4>

        <p>
          To User #{spam.receiver_id}
        </p>
      </div>

      <div className="view-status">

        {spam.is_viewed ? (
          <>
            <span className="viewed-badge">
              👀 Viewed
            </span>
          </>
        ) : (
          <>
            <span className="pending-badge">
              ⏳ Waiting
            </span>
          </>
        )}

      </div>

    </div>
  ))}

</div>
      </div>

      {showCelebration && (
        <div className="celebration-overlay"></div>
      )}

      {activeSpam && (
        <div className="spam-overlay">
          <button
            className="close-overlay"
            onClick={() => setActiveSpam(null)}
          >
            ✕
          </button>

          <img
            src={getSpamAsset(activeSpam.spam_type)}
            alt=""
          />
        </div>
      )}
    </div>
  );
}