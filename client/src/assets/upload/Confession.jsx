import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

import { useAnonymousTokens, AnonymousToggle, AnonymousTokensCoolDown } from "../util/anonymousTokens";
import { confession_options } from "../data/post_type_data";
import TagInput from "../util/tagInput";

import "../style/upload/tag.css";

const token = localStorage.getItem("token");

export default function Confession() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [selectType, setSelectType] = useState(null);
  const [confessionFile, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { tokens, countdown, consume } = useAnonymousTokens();

  const resetAll = () => {
    setTitle("");
    setTags([]);
    setFile(null);
    setIsAnonymous(false);
    setSelectType(null);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!title.trim()) {
      toast.error("Confession title is required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    tags.forEach((t) => formData.append("tags[]", t));
    formData.append("post_type", "confession");
    formData.append("confession_title", title);
    formData.append("confession_type", selectType?.value ?? "general");
    formData.append("isAnonymous", isAnonymous);
    if (confessionFile) {
      formData.append("confessionFile", confessionFile);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/create-posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success(res.data.message || "Confession posted successfully");
        if (isAnonymous) consume();
        resetAll();
      } else {
        toast.error(res.data.message || "Failed to post confession");
        resetAll();
      }
    } catch (err) {
      console.error(err);
      toast.error(
        "Server error, please try again later"
      );
      resetAll();
    }
     resetAll();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="toast-feedback">
          <ToastContainer position="top-right" autoClose={2000} />
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Confess something..."
          type="text"
          required
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
        />

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      <AnonymousTokensCoolDown tokens={tokens} countdown={countdown} />
    </>
  );
}
