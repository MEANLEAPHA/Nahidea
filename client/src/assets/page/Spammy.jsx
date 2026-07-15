import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import nahideaIcon from '../img/nahideaIcon.png';
import api from "../api/axiosInstance";
import Select from "react-select";
import toast from "react-hot-toast";
import "../style/page/Spammy.css";
import { faInbox, faTriangleExclamation, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { spammy_options } from "../data/post_type_data";
import { faEnvelope, faEnvelopeOpen, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { Spin } from "antd";

const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 1;
const PREFILL_KEY = "spammy_prefill";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

function loadPrefill(locationState) {
  // Fresh navigation state takes priority
  if (locationState?.id && locationState?.username) {
    const data = {
      id: locationState.id,
      username: locationState.username,
      avatar: locationState.avatar ?? null,
    };
    try {
      sessionStorage.setItem(PREFILL_KEY, JSON.stringify(data));
    } catch {}
    return data;
  }

  // Fall back to sessionStorage (survives refresh)
  try {
    const raw = sessionStorage.getItem(PREFILL_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(PREFILL_KEY);
  }

  return null;
}

function savePrefill(id, username, avatar = null) {
  try {
    sessionStorage.setItem(PREFILL_KEY, JSON.stringify({ id, username, avatar }));
  } catch {}
}

function clearPrefill() {
  sessionStorage.removeItem(PREFILL_KEY);
}



export default function Spammy() {
  const location = useLocation();

  const prefillRef = useRef(null);
  const prefillLoaded = useRef(false);
  if (!prefillLoaded.current) {
    prefillLoaded.current = true;
    prefillRef.current = loadPrefill(location.state); 
  }
  const prefill = prefillRef.current;

  const [inbox, setInbox] = useState([]);
  const [activeSpam, setActiveSpam] = useState(null);

  const [receiverId, setReceiverId] = useState(prefill?.id ?? null);
  const [searchQuery, setSearchQuery] = useState(prefill?.username ?? "");

  const [spamType, setSpamType] = useState(
    Array.isArray(spammy_options) && spammy_options.length > 0
      ? spammy_options[0]
      : null
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [sentSpam, setSentSpam] = useState([]);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [sending, setSending] = useState(false);
  const [markingAllViewed, setMarkingAllViewed] = useState(false);

  const [deletingAllInbox, setDeletingAllInbox] = useState(false);
  const [deletingAllSent, setDeletingAllSent] = useState(false);
  const [deletingSpamId, setDeletingSpamId] = useState(null);

  const searchContainerRef = useRef(null);
  const debounceRef = useRef(null);
  const searchRequestIdRef = useRef(0);

  const skipNextSearchRef = useRef(!!prefill);

  useEffect(() => {
    fetchInbox();
    fetchUnreadCount();
    fetchSentSpam();
  }, []);

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

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = searchQuery.trim();

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    if (query.length < MIN_SEARCH_LENGTH) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const requestId = ++searchRequestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get(
          `/api/searchUser?q=${encodeURIComponent(query)}` );
        

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
      const res = await api.get(
        `/api/spam/sent`);
      setSentSpam(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load sent spam");
    }
  };

  const fetchInbox = async () => {
    try {
      const res = await api.get(
        `/api/spam/inbox`);
      setInbox(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load inbox");
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get(
        `/api/spam/unread-count`);
      setUnreadCount(res.data.unread);
    } catch (err) {
      console.error(err);
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
      await api.post(
        `/api/spam/send`,
        { receiver_id: receiverId, spam_type: spamType.value }
      );

      toast.success("Spam Sent");

      setReceiverId(null);
      setSearchQuery("");
      setSearchResults([]);
      clearPrefill(); 
      fetchSentSpam();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send spam");
    } finally {
      setSending(false);
    }
  };

  const openSpam = async (spam) => {
    try {
      await api.put(
        `/api/spam/view/${spam.spam_id}`,
        {}
      );

      setActiveSpam(spam);

      setInbox((prev) =>
        prev.map((s) =>
          s.spam_id === spam.spam_id ? { ...s, is_viewed: 1 } : s
        )
      );

      if (!spam.is_viewed) {
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't open that spam");
    }
  };

  const handleViewAll = async () => {
    if (markingAllViewed || unreadCount === 0) return;

    setMarkingAllViewed(true);
    try {
      await api.put(
        `/api/spam/view-all`,
        {},
        getAuthHeaders()
      );
      setInbox((prev) => prev.map((s) => ({ ...s, is_viewed: 1 })));
      setUnreadCount(0);
      toast.success("Marked all as read");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't mark all as read");
    } finally {
      setMarkingAllViewed(false);
    }
  };

  const handleDeleteAll = async (type) => {
    const isInbox = type !== "sent";
    // Guard against the right list, not always inbox
    const list = isInbox ? inbox : sentSpam;
    if (list.length === 0) return;

    const confirmed = window.confirm(
      isInbox
        ? "Delete your entire inbox? This can't be undone."
        : "Clear all sent spam? This can't be undone."
    );
    if (!confirmed) return;

    if (isInbox) setDeletingAllInbox(true);
    else setDeletingAllSent(true);

    try {
      await api.delete(
        `/api/spam/delete-all?type=${type}`,
        getAuthHeaders()
      );

      if (isInbox) {
        setInbox([]);
        setUnreadCount(0);
        setActiveSpam(null);
        toast.success("Inbox cleared");
      } else {
        setSentSpam([]);
        toast.success("Sent spam cleared");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't clear spam");
    } finally {
      if (isInbox) setDeletingAllInbox(false);
      else setDeletingAllSent(false);
    }
  };

  const handleDeleteOne = async (e, spam, type) => {
    e.stopPropagation(); 
    if (deletingSpamId) return;

    setDeletingSpamId(spam.spam_id);
    try {
      await api.delete(
        `/api/spam/delete/${spam.spam_id}`
      );

      if (type === "sent") {
        setSentSpam((prev) => prev.filter((s) => s.spam_id !== spam.spam_id));
      } else {
        setInbox((prev) => prev.filter((s) => s.spam_id !== spam.spam_id));
        if (!spam.is_viewed) {
          setUnreadCount((prev) => Math.max(prev - 1, 0));
        }
        if (activeSpam?.spam_id === spam.spam_id) {
          setActiveSpam(null);
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't delete that spam");
    } finally {
      setDeletingSpamId(null);
    }
  };

  const getSpamAsset = (type) => {
  switch (type) {
    case "poke":
      return "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyODNycmo3NHdiOTF1Mmo4anY3OWlleTg2MnR3MHB4Zm40N3VnbDU3YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/PkR8gPgc2mDlrMSgtu/200.gif";
    case "goodnight":
      return "https://media.tenor.com/LBppk55tCvsAAAAM/meme.gif";
    case "text_me":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnJoZXY0Z3Z0ZXhuMDM0ZjJ1cjRueTlmYm05ZGs2cm1hcjNsd280ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tJ2EIL8tBtEHVMRzo5/giphy.gif";
    case "get_a_job":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTJkYWdmOW4zMXAyZGNvdmxmcnhlajY4NTFwZmU1dGhkMjZyaWJybCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JQYsf4F5Jx2C70Knf3/giphy.gif";
    case "callme":
      return "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cThxNzhxZHIzbTBmaXVwc21vMWxlMzN6dDUzMnoxaTNqcjZnNTBrNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/5ICdheP4MoQGt70pD5/giphy.gif";
    case "hello": 
      return "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZuOTRwMTc0c3ZuYTNscjF3OHRnZTR1OTB1dHlvN2p3NmQweHlociZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Cmr1OMJ2FN0B2/giphy.gif";
    case "can_we_talk":
      return "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MjJhdXBpOHZiaWlnYjllc2RsaGMwOHYyczh1MmQ2MGFoYjB0ZHZ4eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT3i1iGcxzSObWeH04/giphy.gif";
    case "are_you_single":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExenBucmVhZ3g2NWRvYzY4bDFoMTFydmRtcjV0bXNlcWg0dmh3NTVmeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bT2lokItWQKwE/giphy.gif";
    case "yes":
      return "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NWpvbXl0Zm9ndnVjZzdlaTZ3ZmZsd29qd3hvM3F2c2NuZXlleGRubCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/sOSRNpG3OiD0jsepP7/giphy.gif";
    case "no":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3lyeXFuczludmZnNnpqdmRhMXk0ZTFvM3lzdWZ5bnFreHQyd3RmcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/d2Z9y3eDoq2cxPpK/giphy.gif";
    case "sendlove":
      return "https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUycncyOG5hZTdxc3lrMTB0NzJkem4waHl0bWlqMHBpZDF2MmphMnplYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ytu2GUYbvhz7zShGwS/giphy.gif";
    case "wake_up":
      return "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGQyOHZ0ejN6bDN6eGZicWhlZnFkeGYwbG43bHB4bHd3dWpoNmgwNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WZj3l2HIRubde/giphy.gif";
    case "can_i_have_your_number":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHNwYzB0dzd6azZwMHIwdjVic3k2MDhxenRwaW5oeHU3NzV4bDBoZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/RtFxzpt8RxzDqCAgLh/giphy.gif";
    case "miss_you":
      return "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZDlyMGRhem9tc2xmNmU0czVnY2hiOXFnNDVsM3RlN2M1N3F6NGI0ayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/UuZCWshuPCSSivRrpM/giphy.gif";
    case "thinking_of_you":
      return "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3M3Jod3IyZ3Q4dDFqdzN6bzQwbHZlbTd2YmQzMmY5MWt0ZDh6Y3AydSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IvQ1ipt61gFUlCK1dV/giphy.gif";
    case "hug":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHJ6aXB3NnNmMTh3NGljZHFta2RiNzlmZ3p4MzdudndzZDh2NzBhbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1JmGiBtqTuehfYxuy9/giphy.gif";
    case "proud_of_you":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWk5czR6eHQ1OHVmaGt2aGszdXY5YzF4bjg2M3lyY2VobjhrY283ZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/raFwbIrDK5jZh8Z3Sl/giphy.gif";
    case "sus":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjZucnA5NDg4eDdkNm81dDVxbDZ4YzYzMG5tYTd5eGExb3J0cWd0dSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ANbD1CCdA3iI8/giphy.gif";
    case "touch_grass":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2N0MGprNmY0NHFxYmwza2dweXRoeGR0Zmd0MTN0eWtveHNmbGJiaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/EG9Zc506rqw8qiv6YK/giphy.gif";
    case "skill_issue":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTBvejI5OGdwbGwyZDZpMGx2MGd1ZnFsaDc3bThpY2sxMmhjY2w0cSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/AqEvr3Zwuw6DJngOKw/giphy.gif";
    case "npc":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW53Mm95b3poOHJiMTVlb3VrcTlqeHl2b2JpaGJ6dWg4djZlZjgxeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/nTKs3aBsBdaDqofkEY/giphy.gif";
    case "caught_in_4k":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjZwaGhtZzJ1bm45bDB3cXBsN3JiZ2Z2Z2Q0eW1nc2sxYXNuZW1ybCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4zCP1LiRo3YXba11R5/giphy.gif";
    case "ratio":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDY3eG1oMGhkYmt6eWlzbTJpM3MyaGo2azRjZjR1c2ZobnhreHphciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/hVNiE7R6PH7fiwpCwO/giphy.gif";
    case "facepalm":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2I5M2xmamN6bHAyZ2Q0aDEwZGpodGdxZmZ0b25kYjduZTY0bXBldiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XD4qHZpkyUFfq/giphy.gif";
    case "sos":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG1hMnhxanJpaGFhdXJubTVzMjJwYWEzZm1sbnRtOThpdHJoMnhyaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U7bo3ZBR8lcKSmGdlT/giphy.gif";
    case "check_in":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWwxNXNib214d2lseXB0cHAwOTRkMzBuMmJjMjRiNTJkZWV4cjF1aiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ll6j3RjFcFHgOxVgXO/giphy.gif";
    case "ghost_alert":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjl6b2g0azlsdzBlODdhcXZoeDFlaDdnOGtuc2p0dTVlc2p3b2Y5NCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4KZ1Q6nU8owonpgpSv/giphy.gif";
    case "where_are_you":
      return "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3b2dranNndnRubHRxYXFwOWc4bTJjNWswa3VucjN2d2dmcHpmOGU3MiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/yxITEyCwy1jJAJLDnr/giphy.gif";
    case "slay":
      return "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjV4ZXFucmt6OGV3enA1Zzc3ZGVra2U5MGwzZ3VpY3U3ZjV0cnlzNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7TT9E5KSGJpUqWUyNz/giphy.gif";
    case "you_ate":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTM2bjJzODF3NXVobzI4b2Ezd2Vxbm11em9rMmRmY2dna25tZTU3dSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7UyhJrObrFS5RrnASI/giphy.gif";
    case "rizz_check":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmxwa3h0dW45dHdwY3Bub3F6dGdwdXpjYnRteG10b2oxMzBwczVtbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/eF7Mt0yiLo03H42V5W/giphy.gif";
    case "rent_free":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWQ5bTIwOXFtYnI2MGZ0aXh2bWhid284dWI4eTF2M2k1MTBlM3h3ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/rjmUhz7wLZMtdrz3kX/giphy.gif";
    case "challenge":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGR1ZHduMTIyeWIzZTBjbzVwODRhaHF3aTF3NW16cnM0N2UwYmp5MSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/PgikPT6uMPmxl5wzlN/giphy.gif";
    case "brain_rot":
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTUydW1rcWg4d2d3aGpvdGJwcnZqM3NuMmx0YW5ncWo2dXY2aTRwMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/emleA2iGk5UFLXrGoX/giphy.gif";

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
        <div className="spam-header-right">
          <button className="spam-right-btn">
            <FontAwesomeIcon icon={faInbox} style={{ opacity: "0.8", cursor: 'none' }} /> {unreadCount}
          </button>
          <button
            className="spam-right-btn"
            type="button"
            onClick={handleViewAll}
            disabled={markingAllViewed || unreadCount === 0}
          >
            <FontAwesomeIcon icon={faEnvelopeOpen} style={{ opacity: "0.8" }} />{" "}
            {markingAllViewed ? "Marking…" : "View All"}
          </button>
          <button
            type="button"
            className="spam-right-btn"
            onClick={() => handleDeleteAll("inbox")}
            disabled={deletingAllInbox || inbox.length === 0}
          >
            <FontAwesomeIcon icon={faTrashCan} style={{ opacity: "0.8" }} />{" "}
            {deletingAllInbox ? "Deleting…" : "Delete All"}
          </button>
        </div>
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
                setReceiverId(null);
                clearPrefill();     
              }}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
            />

            {searchLoading && <div className="search-loading"> <Spin style={{color: 'var(--primary-color)', marginRight: '5px'}}/>Searching…</div>}

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
                      savePrefill(user.id, user.username, user.avatar_url);
                    }}
                  >
                    <img
                      src={user.avatar_url || nahideaIcon}
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
            onChange={(option) => setSpamType(option)}
            classNamePrefix="customsp"
            placeholder="Select spam type"
            formatOptionLabel={(option) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0px",
                  height: "60px",
                  padding: "0px",
                }}
              >
                <img
                  src={option.img}
                  alt={option.label}
                  style={{ width: "50px", height: "50px", marginRight: "5px" }}
                />
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
              <div className="inbox-spam-div">
                <img
                  className="inbox-user-img"
                  src={spam.sender_avatar_url || nahideaIcon}
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <div className="inbox-user-info">
                  <h3 className="inbox-user-h3">
                    {spam.sender_username ?? `User #${spam.sender_id}`}
                  </h3>
                  <p className="inbox-user-p">sent you a spammy</p>
                </div>
              </div>

              <div className="inbox-spam-delete">
                <button
                  type="button"
                  className="detete-one-spam-btn"
                  onClick={(e) => handleDeleteOne(e, spam, "inbox")}
                  disabled={deletingSpamId === spam.spam_id}
                >
                  <FontAwesomeIcon icon={faTrashCan} style={{ opacity: "0.8" }} />
                </button>
                {!spam.is_viewed && <div className="unread-dot"></div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeSpam && (
        <div className="spam-overlay">
          <button className="close-overlay" onClick={() => setActiveSpam(null)}>
            <FontAwesomeIcon icon={faX} />
          </button>
          <img src={getSpamAsset(activeSpam.spam_type)} alt="" />
        </div>
      )}

      <div className="sent-panel">
        <div className="sent-header">
          <h3 className="spam-h3-label">Your Sent Spam</h3>
           {sentSpam.length > 0 &&   <button
            type="button"
            className="delete-all-spam-btn"
            onClick={() => handleDeleteAll("sent")}
            disabled={deletingAllSent || sentSpam.length === 0}
          >
            {deletingAllSent ? "Clearing…" : "Clear All"}
          </button>}
        
        </div>

        {sentSpam.length === 0 && <div className="empty-state">No spam sent yet</div>}

        {sentSpam.map((spam) => (
          <div key={spam.spam_id} className="sent-card">
            <div className="sent-data-div">
              <img src={getSpamAsset(spam.spam_type)} className="sent-gif-holder" alt="" />
              <div className="sent-info-div">
                <h4 className="spam-h4">{spammy_options.find((o) => o.value === spam.spam_type).label}</h4>
                <p className="spam-p">
                  To {spam.receiver_username ?? `User #${spam.receiver_id}`}
                </p>
              </div>
            </div>

            <div className="view-status">
              <button
                type="button"
                className="detete-one-spam-btn"
                onClick={(e) => handleDeleteOne(e, spam, "sent")}
                disabled={deletingSpamId === spam.spam_id}
              >
                <FontAwesomeIcon icon={faTrashCan} style={{ opacity: "0.8" }} />
              </button>

              {spam.is_viewed ? (
                <span className="viewed-badge">
                  <FontAwesomeIcon icon={faEnvelopeOpen} /> <span className='view-status-label'>Seen</span>
                </span>
              ) : (
                <span className="pending-badge">
                  <FontAwesomeIcon icon={faEnvelope} /> <span className='view-status-label'>Delivered</span> 
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}