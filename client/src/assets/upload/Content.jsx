import React from "react";
import { useState, useEffect, useRef } from 'react';
import Select from "react-select";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Aside from "../components/Aside";


import {
  getNextLocalMidnight,
  readTokens,
  saveTokens,
  readResetDate,
  saveResetDate,
  clearResetDate,
  formatSeconds
} from "../util/anonymousTokens";


import "../style/Main.css";
import "../style/App.css";
import "../style/upload/tag.css";


// const ONE_DAY_MS = 24 * 60 * 60 * 1000;
// const STORAGE_KEY_TOKENS = "AnnoymousUsed";
// const STORAGE_KEY_RESET = "AnnoymousResetAt";

export default function Content(){

    // Declare state
    const [showMaxAside, setMaxAside] = useState(() => {
        return localStorage.getItem("maxAside") === "true";
    })


    useEffect(()=>{
        localStorage.setItem("maxAside", showMaxAside)
    },
    [showMaxAside]
    );

    const toggleAside = () =>{
            setMaxAside(prev => !prev)
    }


     const [darkMode, setDarkMode] = useState( () => {
            return localStorage.getItem("darkMode") === "true"; 
        });
    
        useEffect(
            () => {
                if(darkMode){
                    document.body.classList.add("dark-theme")
                }
                else{
                    document.body.classList.remove("dark-theme")
                }
                localStorage.setItem("darkMode", darkMode);
            },
            [darkMode]
        );
     
        const toggleTheme = () =>{
            setDarkMode(prev => !prev)
        }
        
    return(
        <>
            <Header onToggleAside={toggleAside} onToggleTheme={toggleTheme} currentTheme={darkMode}/>
             <Main appendValue={showMaxAside}/>
            <Footer />
        </>
    )
}

const Main = ({appendValue}) =>{
    return(
        <main>
            <Aside append={appendValue}/>
            <Section />
        </main>
    )
}



const Section = () =>{
     const navigate = useNavigate();
      const [files, setFiles] = useState(Array(5).fill(null)); // max 5 slots
      const [mediaFiles, setMediaFiles] = useState([]);
const [tags, setTags] = useState([]);

const [isAnnoymous, setIsAnnoymous] = useState(false);
const [annoymousUsed, setAnnoymousUsed] = useState(3);
const [countDown, setCountDown] = useState(0);
const intervalRef = useRef(null);

const startCountdown = (targetDate) => {
  if (intervalRef.current) clearInterval(intervalRef.current);
  const tick = () => {
    const diffMs = targetDate.getTime() - Date.now();
    if (diffMs <= 0) {
      setAnnoymousUsed(3);
      saveTokens(3);
      clearResetDate();
      setCountDown(0);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    setCountDown(Math.ceil(diffMs / 1000));
  };
  tick();
  intervalRef.current = setInterval(tick, 1000);
};

useEffect(() => {
  const tokens = readTokens();
  setAnnoymousUsed(tokens);

  const resetDate = readResetDate();
  if (resetDate) {
    if (resetDate.getTime() > Date.now()) {
      startCountdown(resetDate);
    } else {
      setAnnoymousUsed(3);
      saveTokens(3);
      clearResetDate();
    }
  }
  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, []);

    
  
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  tags.forEach((t) => formData.append("tags[]", t));
  // Option A: append tags as multiple fields tags[]
  // Option B: append tags as a single JSON string (uncomment if you prefer)
   // formData.append("tags", JSON.stringify(tags));
  // formData.append("userId", 1);
  
  formData.append("confession_title", "My Post");
  formData.append("confession_type", selectType?.value ?? "general");
  formData.append("post_type", "content");

  formData.append("isAnonymous", isAnnoymous);

 
 
// in handleSubmit
files.forEach((file) => {
  if (file) formData.append("media", file);
});
// OR use mediaFiles
// mediaFiles.forEach((f) => formData.append("media", f));
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/create-posts`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log("Upload success:", res.data);
  } catch (err) {
    if (err.response) {
      console.error("Upload failed:", err.response.data);
    } else {
      console.error("Upload failed:", err.message);
    }
  }

 if (isAnnoymous) {
  const newCount = Math.max(0, annoymousUsed - 1);
  setAnnoymousUsed(newCount);
  saveTokens(newCount);

  if (newCount === 0) {
    const nextMidnight = getNextLocalMidnight();
    saveResetDate(nextMidnight);
    startCountdown(nextMidnight);
  }
}

  
};

const [title, setTitle] = useState('');
const [selectType, setSelectType] = useState(null);
const handleChangeType = (option) => {
  setSelectType(option)
;}
const options = [
  { value: "advice", label: "Advice" },
  { value: "experience", label: "Experience" },
  { value: "story", label: "Story" },
  { value: "educational", label: "Educational" },
  { value: "relationship", label: "Relationship" },
  { value: "religion", label: "Religion" },
  { value: "general", label: "General" },
  { value: "news", label: "News" },
  { value: "entertainment", label: "Entertainment" },
  { value: "technology", label: "Technology" },
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "travel", label: "Travel" },
  { value: "food", label: "Food" },
  { value: "sports", label: "Sports" },
  { value: "art", label: "Art" },
  { value: "science", label: "Science" },
  { value: "politics", label: "Politics" },
  { value: "career", label: "Career" },
  { value: "lifestyle", label: "Lifestyle" },

  // ➕ Added categories
  { value: "gaming", label: "Gaming" },
  { value: "environment", label: "Environment" },
  { value: "history", label: "History" },
  { value: "parenting", label: "Parenting" },
  { value: "philosophy", label: "Philosophy" },
  { value: "diy", label: "DIY" },
  { value: "fashion", label: "Fashion" },
  { value: "motivation", label: "Motivation" },
];


    return (
    <form onSubmit={handleSubmit}>

      <label htmlFor="title">Caption</label>
      <input type="text" 
              name='title'
              className='input-title'
              onChange={(e)=> setTitle(e.target.value)} 
              value={title}
              placeholder="Type your text content here..."
      />

      <label htmlFor="type">Type of Content</label>
      <Select options={options}
              onChange={handleChangeType} 
              isSearchable 
              value={selectType}
              placeholder='Select type of Content'
              className="my-select"
              classNamePrefix="my-select"
      />
      
   <TagInput value={tags} onChange={setTags} maxTags={5} />
   <MediaUploader maxFiles={5} onChange={setMediaFiles} />

   {annoymousUsed !== 0 ? (
  <div className="toggle-switch">
    <span>Post anonymous</span>
    <input
      type="checkbox"
      id="deadlineStatus"
      checked={isAnnoymous}
      onChange={(e) => setIsAnnoymous(e.target.checked)}
    />
    <label htmlFor="deadlineStatus"></label>
    <div>Remaining tokens: {annoymousUsed}</div>
  </div>
) : (
  <div>
    <span>You have used all anonymous tokens for today. They reset at local midnight.</span>
    <div>Remaining anonymous token: {annoymousUsed}</div>
    <div className="time-countdown">Time left: {formatSeconds(countDown)}</div>
  </div>
)}


      <button type="submit">Create</button>
    </form>
  );
}

const TagInput = ({value = [], onChange, maxTags = 5}) =>{
    const [input, setInput] = useState("");
  const [tags, setTags] = useState(value);
  const [error, setError] = useState("");

  const normalize = (t) => t.trim().toLowerCase();

  const addTag = (raw) => {
    const newTag = raw.split(",").map(s => s.trim()).filter(Boolean);
    if (newTag.length === 0) return;

    let next = [...tags];
    for (const t of newTag) {
      const n = normalize(t);
      if (!n) continue;
      if (next.map(normalize).includes(n)) continue; // skip duplicates
      if (next.length >= maxTags) {
        setError(`Maximum ${maxTags} tags allowed`);
        break;
      }
      next.push(t);
    }
    setTags(next);
    onChange?.(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addTag(input);
      setInput("");
    } 
    else if (e.key === "Backspace" && input === "" && tags.length) {
      const next = tags.slice(0, -1);
      setTags(next);
      onChange?.(next);
    }
  };

  const handleBlur = () => {
    if (input.trim()) {
      addTag(input);
      setInput("");
    }
  };

  const removeTag = (index) => {
    const next = tags.filter((_, i) => i !== index);
    setTags(next);
    setError("");
    onChange?.(next);
  };

  const clearAll = () => {
    setTags([]);
    setError("");
    onChange?.([]);
  };
  return(
     <div className="tags-input-wrapper">
        <label className="tags-label">Add Tags to your Content</label>
        <div className={`tags-input ${error ? "has-error" : ""}`}>
          {tags.map((t, i) => (
            <span className="tag" key={t + i}>
              #<span className="tag-text">{t}</span>
              <button
                type="button"
                className="tag-remove"
                onClick={() => removeTag(i)}
                aria-label={`Remove ${t}`}
              >
                ×
              </button>
            </span>
          ))}

          <input
            className="tag-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={tags.length >= maxTags ? "" : "Type tag and press Enter or comma"}
            disabled={tags.length >= maxTags}
            aria-describedby="tags-help"
          />
        </div>

        <div className="tags-controls">
          <button type="button" className="btn-clear" onClick={clearAll} disabled={!tags.length}>
            Remove all
          </button>
          <div id="tags-help" className="tags-count">
            <strong>{tags.length} / 5</strong> tags
          </div>
        </div>

        {error && <div className="tags-error">{error}</div>}
        <div className="tags-hint">Use comma or Enter to separate tags. Max {maxTags}.</div>
    </div>
  );
}

function MediaUploader({ maxFiles = 5, onChange }) {
  // files: array of File | null, length = maxFiles
  const [files, setFiles] = useState(Array(maxFiles).fill(null));
  const multiInputRef = useRef(null);

  // helper to notify parent
  const emitChange = (next) => {
    setFiles(next);
    onChange?.(next.filter(Boolean)); // send only non-null files
  };

  // When user uses the initial multi-file input
  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    // limit to remaining slots
    const next = [...files];
    let slotIndex = 0;
    for (let i = 0; i < next.length && selected.length; i++) {
      if (!next[i]) {
        next[i] = selected.shift() || null;
      }
    }
    emitChange(next);

    // reset the multi input so same files can be reselected later if needed
    if (multiInputRef.current) multiInputRef.current.value = "";
  };

  // When user selects a single file for a specific slot
  const handleSingleSelect = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const next = [...files];
    next[index] = file;
    emitChange(next);
    e.target.value = "";
  };

  const handleRemove = (index) => {
    const next = [...files];
    next[index] = null;
    emitChange(next);
  };

  const handleRemoveAll = () => {
    const next = Array(maxFiles).fill(null);
    emitChange(next);
    if (multiInputRef.current) multiInputRef.current.value = "";
  };

  // count filled slots
  const filledCount = files.filter(Boolean).length;
  const remaining = maxFiles - filledCount;

  return (
    <div className="media-uploader">
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <strong>{filledCount}</strong> / {maxFiles} media
        <button
          type="button"
          onClick={handleRemoveAll}
          disabled={filledCount === 0}
          style={{ marginLeft: "auto" }}
        >
          Remove all
        </button>
      </div>

      {/* If no files selected at all, show the single multi-file input as fallback */}
      {filledCount === 0 ? (
        <div style={{ border: "1px dashed #ccc", padding: 12, borderRadius: 6 }}>
          <input
            ref={multiInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMultiSelect}
            style={{ display: "block" }}
          />
          <small style={{ color: "#666" }}>You can select up to {maxFiles} files at once.</small>
        </div>
      ) : (
        <>
          {/* Show filled slots and single-file inputs for remaining slots */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {files.map((file, idx) => (
              <div
                key={idx}
                style={{
                  width: 180,
                  minHeight: 80,
                  border: "1px solid #ccc",
                  padding: 8,
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {file ? (
                  <>
                    <div style={{ fontSize: 13, marginBottom: 8, wordBreak: "break-word" }}>
                      <strong>{file.name}</strong>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {(file.type || "").startsWith("image/") ? "Image" : "Video"}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" onClick={() => handleRemove(idx)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleSingleSelect(idx, e)}
                    />
                    <div style={{ fontSize: 12, color: "#666" }}>Add file</div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* If there are still remaining slots, show a small multi-input to add multiple at once */}
          {remaining > 0 && (
            <div style={{ marginTop: 10 }}>
              <input
                ref={multiInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMultiSelect}
              />
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                You can add up to {remaining} more file{remaining > 1 ? "s" : ""}.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}