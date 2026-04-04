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

import  MediaUploader  from "../util/mediaUploader";
import {useAnonymousTokens, AnonymousToggle }from "../util/anonymousTokens";
import  TagInput  from "../util/tagInput";
import { content_options } from "../data/post_type_data";


import "../style/Main.css";
import "../style/App.css";
import "../style/upload/tag.css";

const token = localStorage.getItem("token");


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
  const [title, setTitle] = useState('');
  const [selectType, setSelectType] = useState(null);
  const [tags, setTags] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);

  const [isAnonymous, setIsAnonymous] = useState(false);
  const { tokens, countdown, consume } = useAnonymousTokens();

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      console.error("Title required");
      return;
    }

    const formData = new FormData();

    formData.append("post_type", "content");
    formData.append("content_title", title);
    formData.append("content_type", selectType?.value || "general");
    formData.append("isAnonymous", isAnonymous);

    tags.forEach((t) => formData.append("tags[]", t));
    mediaFiles.forEach((f) => formData.append("contentFile", f));

    try {
     await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/create-posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (isAnonymous) consume();

      setTitle("");
      setTags([]);
      setMediaFiles([]);
      setIsAnonymous(false);
      setSelectType(null);

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Write something..."
      />

      <Select
        options={content_options}
        value={selectType}
        onChange={setSelectType}
      />

      <TagInput value={tags} onChange={setTags} />
      <MediaUploader maxFiles={5} value={mediaFiles} onChange={setMediaFiles} />


      <AnonymousToggle
        enabled={isAnonymous}
        setEnabled={setIsAnonymous}
        tokens={tokens}
        countdown={countdown}
      />

      <button type="submit">Create</button>
    </form>
  );
}

