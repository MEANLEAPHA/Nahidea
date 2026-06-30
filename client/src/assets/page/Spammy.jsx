import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Select from "react-select";
import toast from "react-hot-toast";
import "../style/page/Spammy.css";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { spammy_options } from "../data/post_type_data";

// NOTE: render <Toaster /> once near the root of your app (e.g. in App.jsx),
// not inside this component — otherwise toasts can get cut off when this
// component unmounts.

const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 1;

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default function Spammy() {
  const [inbox, setInbox] = useState([]);
  const [activeSpam, setActiveSpam] = useState(null);

  // The actually-selected user to send spam to (must come from a dropdown pick)
  const [receiverId, setReceiverId] = useState(null);
  // What's currently typed in the search box (separate from the selection)
  const [searchQuery, setSearchQuery] = useState("");

  const [spamType, setSpamType] = useState(
    Array.isArray(spammy_options) && spammy_options.length > 0
      ? spammy_options[0]
      : null
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [sentSpam, setSentSpam] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [sending, setSending] = useState(false);

  const searchContainerRef = useRef(null);
  const debounceRef = useRef(null);
  const searchRequestIdRef = useRef(0);

  useEffect(() => {
    fetchInbox();
    fetchUnreadCount();
    fetchSentSpam();
  }, []);

  // Close the dropdown when clicking outside of the search box
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced user search, with protection against out-of-order responses
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = searchQuery.trim();

    if (query.length < MIN_SEARCH_LENGTH) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const requestId = ++searchRequestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/searchUser?q=${encodeURIComponent(
            query
          )}`,
          getAuthHeaders()
        );

        // Ignore stale responses from earlier keystrokes
        if (requestId === searchRequestIdRef.current) {
          setSearchResults(res.data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error(err);
        if (requestId === searchRequestIdRef.current) {
          toast.error("Couldn't search users right now");
        }
      } finally {
        if (requestId === searchRequestIdRef.current) {
          setSearchLoading(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const fetchSentSpam = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/spam/sent`,
        getAuthHeaders()
      );
      setSentSpam(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load sent spam");
    }
  };

  const fetchInbox = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/spam/inbox`,
        getAuthHeaders()
      );
      setInbox(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load inbox");
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/spam/unread-count`,
        getAuthHeaders()
      );
      setUnreadCount(res.data.unread);
    } catch (err) {
      console.error(err);
      // Non-critical, fail silently rather than nag the user
    }
  };

  const sendSpam = async () => {
    if (!receiverId) {
      toast.error("Pick a user from the search results first");
      return;
    }
    if (!spamType?.value) {
      toast.error("Pick a spam type first");
      return;
    }
    if (sending) return;

    setSending(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/spam/send`,
        {
          receiver_id: receiverId,
          spam_type: spamType.value,
        },
        getAuthHeaders()
      );

      toast.success("Spam sent 🚀");

      setReceiverId(null);
      setSearchQuery("");
      setSearchResults([]);
      fetchSentSpam();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send spam");
    } finally {
      setSending(false);
    }
  };

  const openSpam = async (spam) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/spam/view/${spam.spam_id}`,
        {}, // body
        getAuthHeaders() // config (this was previously being passed as the body!)
      );

      setActiveSpam(spam);
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      setShowCelebration(true);

      setTimeout(() => {
        setShowCelebration(false);
      }, 10000);

      fetchInbox();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't open that spam");
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
        <h2>
          <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: "gold" }} />{" "}
          Spammy
        </h2>

        <div className="spam-badge">{unreadCount} unread</div>
      </div>

      <div className="spam-grid">
        <div className="send-panel">
          <h3 className="spam-h3-label">Send Spam</h3>

          <div className="search-user-container" ref={searchContainerRef}>
            <input
              type="text"
              placeholder="Search User"
              className="spam-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Typing again invalidates any prior selection
                setReceiverId(null);
              }}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
            />
            {searchLoading && <div className="search-loading">Searching…</div>}

            {showDropdown && searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="search-item"
                    onClick={() => {
                      setReceiverId(user.id);
                      setSearchQuery(user.username);
                      setSearchResults([]);
                      setShowDropdown(false);
                    }}
                  >
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      className="avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    <span>{user.username}</span>
                  </div>
                ))}
              </div>
            )}

            {showDropdown &&
              !searchLoading &&
              searchQuery.trim().length >= MIN_SEARCH_LENGTH &&
              searchResults.length === 0 && (
                <div className="search-dropdown">
                  <div className="search-item search-item-empty">No users found</div>
                </div>
              )}
          </div>

          <Select
            options={spammy_options}
            value={spamType}
            onChange={(option) => {
              setSpamType(option);
            }}
            classNamePrefix="customsp"
            placeholder="Select spam type"
            formatOptionLabel={(option) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0px",
                  height: "20px",
                  padding: "0px",
                }}
              >
                <span>{option.label}</span>
              </div>
            )}
          />

          <button
            onClick={sendSpam}
            type="button"
            className="sent-btn"
            disabled={sending || !receiverId}
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </div>

        {/* INBOX */}
        <div className="inbox-panel">
          <h3 className="spam-h3-label">Inbox</h3>

          {inbox.length === 0 && <div className="empty-state">No spam received</div>}

          {inbox.map((spam) => (
            <div
              key={spam.spam_id}
              className={`spam-card ${spam.is_viewed ? "" : "unread"}`}
              onClick={() => openSpam(spam)}
            >
              <div>
                <h3>{spam.spam_type}</h3>
                <p>
                  From {spam.sender_username ? spam.sender_username : `User #${spam.sender_id}`}
                </p>
              </div>

              {!spam.is_viewed && <div className="unread-dot"></div>}
            </div>
          ))}
        </div>
      </div>

      {showCelebration && <div className="celebration-overlay"></div>}

      {activeSpam && (
        <div className="spam-overlay">
          <button className="close-overlay" onClick={() => setActiveSpam(null)}>
            ✕
          </button>

          <img src={getSpamAsset(activeSpam.spam_type)} alt="" />
        </div>
      )}

      <div className="sent-panel">
        <h3 className="spam-h3-label">Your Sent Spam</h3>

        {sentSpam.length === 0 && <div className="empty-state">No spam sent yet</div>}

        {sentSpam.map((spam) => (
          <div key={spam.spam_id} className="sent-card">
            <div>
              <h4>{spam.spam_type}</h4>
              <p>
                To {spam.receiver_username ? spam.receiver_username : `User #${spam.receiver_id}`}
              </p>
            </div>

            <div className="view-status">
              {spam.is_viewed ? (
                <span className="viewed-badge">👀 Viewed</span>
              ) : (
                <span className="pending-badge">⏳ Waiting</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}