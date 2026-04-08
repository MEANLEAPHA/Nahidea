import React from "react";
import { useState, useEffect, useRef } from 'react';
import Select from "react-select";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import  MediaUploader  from "../util/mediaUploader";
import {useAnonymousTokens, AnonymousToggle, AnonymousTokensCoolDown}from "../util/anonymousTokens";
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


  const resetAll = () => {
    setLoading(false);
    setTitle("");
    setTags([]);
    setMediaFiles([]);
    setIsAnonymous(false);
    setSelectType(null);
  };

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
    const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/create-posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json();

      if(res.ok){
        res.status === 200 && toast.success(data.message);
        if (isAnonymous) consume();

        resetAll();

      }
      else{
        resetAll();
      }
    } catch (err) {
        {res.status = 500 && console.error(data.message)}
        toast.error("Sorry our server is error please try again later");
        resetAll();
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div className='toast-feedback'>
        <ToastContainer position="top-right" autoClose={2000}/>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Write something..."
        type="text"
        required
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
      />

      <button type="submit">{loading ? "Posting..." : "Post"}</button>

    </form>
    <AnonymousTokensCoolDown tokens={tokens} countdown={countdown} />
    </>
  );
}
