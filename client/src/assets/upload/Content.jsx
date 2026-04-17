import React, { useState, useRef, useCallback } from "react";
import Select from "react-select";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


import {MoreFields, MarkdownPreview} from "../util/moreFlieds";


import { useAnonymousTokens, AnonymousTokensCoolDown } from "../util/anonymousTokens";
import { content_options } from "../data/post_type_data";

const token = localStorage.getItem("token");

 import "../style/upload/tag.css";
 import "../style/upload/Content.css";

export default function Content() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [textBody, setTextBody] = useState("");

  const [selectType, setSelectType] = useState(null);
  const [tags, setTags] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { tokens, countdown, consume } = useAnonymousTokens();


  const resetAll = () => {
    setLoading(false);
    setTitle("");
    setTextBody("");
    setTags([]);
    setMediaFiles([]);
    setIsAnonymous(false);
    setSelectType(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("post_type", "content");
    formData.append("content_title", title);
    formData.append("text_body", textBody);
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Post created");
        if (isAnonymous) consume();

        // reset
       resetAll();
       
      }
    } catch (err) {
      toast.error("Server error");
      resetAll();
    }
  };

  return (
    <div id="content-container">
       <article id='tool-article'>
           <AnonymousTokensCoolDown tokens={tokens} countdown={countdown} />
             <form onSubmit={handleSubmit} id="content-form">
                <div className="toast-feedback">
                    <ToastContainer position="top-right" autoClose={2000} />
                 </div>
                 <p id="content-label">Create Content</p>

        <Select
          options={content_options}
          value={selectType}
          onChange={setSelectType}
           classNamePrefix="custom"
                placeholder="Select Content Type"
        />

        <div className="title-wrapper">
            <p className="title-label" >Title</p>
        
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title*"
              type="text"
              required
              id="title-input"
              
              maxLength={300} // enforce limit
            />
            <div className="char-counter">
              {title.length}/300
            </div>
          </div>

        <MoreFields
          tags={tags}
          setTags={setTags}
          mediaFiles={mediaFiles}
          setMediaFiles={setMediaFiles}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
          tokens={tokens}
          textBodyValue={textBody}
          setTextBodyValue = {setTextBody}
        />

     

      <div id="form-footer">
          <button type="submit" disabled={loading} id="content-post-button">
                {loading ? "Posting..." : "Post"}
        </button>
      </div>
      <div id="form-footer-2">
        <p>Nahidea Rule</p>
        <p>Private Policy</p>
        <p>User Agreement</p>
        <p>Accessibility</p>
        <p>Nahidea. © 2026. All rights reserved </p>
      </div>
        
      </form>
      
       </article>
        <article id='preview-article'> 
          <div id="preview-container">
            < MarkdownPreview content={textBody}/>
            {/* <PreviewRadio /> */}
          </div>
            
        </article>
    </div>
  );
}
const PreviewRadio = () => {
  const [selected, setSelected] = useState("Preivew");

  return (
    <>
      {/* Radio-style buttons */}
      <div id="select-radio">
        <div  className='radio-button-div'>
             {["Preivew", "Document"].map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            style={{
              border: selected === opt ? "2px solid #fd7648" : "2px solid transparent",
              color: selected === opt ? "#fd7648" : "grey",
            }}
            className='radio-button'
          >
            {opt}
          </button>
        ))}
        </div>
      </div>

      {/* Word underneath */}
      <div style={{ marginTop: "10px", color: "#555", fontSize: "14px" }}>
         {selected === "Preivew" ? "A" : "D"}
         <div style={{ marginTop: "10px" }}>

</div>
      </div>
    </>
  );
};