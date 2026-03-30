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


import "../style/Main.css";
import "../style/App.css";
import "../style/upload/tag.css";

import {
  getNextLocalMidnight,
  readTokens,
  saveTokens,
  readResetDate,
  saveResetDate,
  clearResetDate,
  formatSeconds
} from "../util/anonymousTokens";

export default function Confession(){

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
       const [file, setFile] = useState(null); // single file only
    
const [tags, setTags] = useState([]);

const [isAnnoymous, setIsAnnoymous] = useState(false);
const [annoymousUsed, setAnnoymousUsed] = useState(3);
const [countDown, setCountDown] = useState(0);
const intervalRef = useRef(null);

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


    
  
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  tags.forEach((t) => formData.append("tags[]", t));
  formData.append("post_type", "confession");
  formData.append("confession_title", "My Post");
  formData.append("confession_type", selectType?.value ?? "general");
  formData.append("isAnonymous", isAnnoymous);

if (file) {
      formData.append("media", file);
    }

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
  // ❤️ Relationship & Crush
  { value: "secret_crush", label: "Secret Crush" },
  { value: "in_love", label: "In Love" },
  { value: "heartbreak", label: "Heartbreak" },
  { value: "situationship", label: "Situationship" },
  { value: "dating_drama", label: "Dating Drama" },

  // 🧠 Feelings & Emotions
  { value: "lonely", label: "Feeling Lonely" },
  { value: "overthinking", label: "Overthinking" },
  { value: "anxiety", label: "Anxiety/Stress" },
  { value: "happy_vibes", label: "Happy Vibes" },
  { value: "mood_swing", label: "Mood Swing" },

  // 🎓 School & Work Life
  { value: "exam_struggles", label: "Exam Struggles" },
  { value: "teacher_story", label: "Teacher Story" },
  { value: "workplace_secret", label: "Workplace Secret" },
  { value: "boss_drama", label: "Boss/Colleague Drama" },
  { value: "student_life", label: "Student Life" },

  // 👀 Personal & Past
  { value: "embarrassing", label: "Embarrassing Moment" },
  { value: "funny_experience", label: "Funny Experience" },
  { value: "childhood_memory", label: "Childhood Memory" },
  { value: "regret", label: "Regret" },
  { value: "life_lesson", label: "Life Lesson" },

  // 🔥 Spicy & Fun
  { value: "party_story", label: "Party Story" },
  { value: "wild_night", label: "Wild Night" },
  { value: "confession_dare", label: "Confession Dare" },
  { value: "gossip", label: "Gossip" },
  { value: "unpopular_opinion", label: "Unpopular Opinion" },

  // 🧩 Identity & Self
  { value: "secret_talent", label: "Secret Talent" },
  { value: "hidden_habit", label: "Hidden Habit" },
  { value: "personal_growth", label: "Personal Growth" },
  { value: "dreams_goals", label: "Dreams & Goals" },
  { value: "random_thought", label: "Random Thought" },
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
   <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
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

      <button type="submit">Confess</button>
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
