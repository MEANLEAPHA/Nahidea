import React from "react";
import { useState, useEffect, useRef } from 'react';
import Select from "react-select";
import axios from "axios";

import  MediaUploader  from "../util/mediaUploader";
import {useAnonymousTokens, AnonymousToggle }from "../util/anonymousTokens";
import  TagInput  from "../util/tagInput";
import { content_options } from "../data/post_type_data";


import "../style/upload/tag.css";

const token = localStorage.getItem("token");


export default function Content(){
 const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [selectType, setSelectType] = useState(null);
  const [tags, setTags] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);

  const [isAnonymous, setIsAnonymous] = useState(false);
  const { tokens, countdown, consume } = useAnonymousTokens();

const handleSubmit = async (e) => {
    e.preventDefault();

    if(loading) return;
    setLoading(true);
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

    setLoading(false);
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





