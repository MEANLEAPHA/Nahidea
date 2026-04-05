import React from "react";
import { useState, useEffect, useRef } from 'react';
import Select from "react-select";
import axios from "axios";


import {useAnonymousTokens, AnonymousToggle }from "../util/anonymousTokens";
import { confession_options } from "../data/post_type_data";
import  TagInput  from "../util/tagInput";

import "../style/upload/tag.css";

const token = localStorage.getItem("token");

export default function Confession(){

      const [loading, setLoading] = useState(false);

      const [title, setTitle] = useState('');
      const [selectType, setSelectType] = useState(null);
      const [confessionFile, setFile] = useState(null); 
      const [tags, setTags] = useState([]);
      
      const [isAnonymous, setIsAnonymous] = useState(false);
      const { tokens, countdown, consume } = useAnonymousTokens();

const handleSubmit = async (e) => {
  e.preventDefault();

  if(loading) return;
  setLoading(true);
  const formData = new FormData();
  tags.forEach((t) => formData.append("tags[]", t));
  formData.append("post_type", "confession");
  formData.append("confession_title", "My Post");
  formData.append("confession_type", selectType?.value ?? "general");
  formData.append("isAnonymous", isAnonymous);
  if (confessionFile) {
    formData.append("confessionFile", confessionFile);
  }

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
  } 
  catch (err) {
    if (err.response) {
      console.error("Upload failed:", err.response.data);
    } else {
      console.error("Upload failed:", err.message);
    }
  }

      if (isAnonymous) consume();

      setTitle("");
      setTags([]);
      setFile(null);
      setIsAnonymous(false);
      setSelectType(null);

      setLoading(false);
  
};

    return (
    <form onSubmit={handleSubmit}>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Confess something..."
      />

      <Select
        options={confession_options}
        value={selectType}
        onChange={setSelectType}
      />

      <TagInput value={tags} onChange={setTags} />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <AnonymousToggle
        enabled={isAnonymous}
        setEnabled={setIsAnonymous}
        tokens={tokens}
        countdown={countdown}
      />

      <button type="submit">Confess</button>
    </form>
  );
}





