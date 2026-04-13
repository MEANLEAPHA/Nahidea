import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

import { EditOutlined ,TagsOutlined,CloudUploadOutlined   } from '@ant-design/icons';
import MediaUploader from "../util/mediaUploader";
import { useAnonymousTokens, AnonymousToggle, AnonymousTokensCoolDown } from "../util/anonymousTokens";
import TagInput from "../util/tagInput";
import { content_options } from "../data/post_type_data";

  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faUserSecret, faMask} from "@fortawesome/free-solid-svg-icons";
  import { faImages} from "@fortawesome/free-regular-svg-icons";
import "../style/upload/tag.css";
import "../style/upload/Content.css";
import { icon } from "@fortawesome/fontawesome-svg-core";
const token = localStorage.getItem("token");
import { Carousel } from 'antd';
export default function Content() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
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
    if (loading) return;
    setLoading(true);

    if (!title.trim()) {
      toast.error("Title is required");
      setLoading(false);
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // axios automatically parses JSON
      if (res.status === 201 || res.status === 200) {
        toast.success(res.data.message || "Post created successfully");
        if (isAnonymous) consume();
        resetAll();
      } else {
        toast.error(res.data.message || "Failed to create post");
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
   
    <div id='content-container'>
        <article id='tool-article'>
              <AnonymousTokensCoolDown tokens={tokens} countdown={countdown} />
           <form onSubmit={handleSubmit} id="content-form">
             <p id="content-label">Create Content</p>
              <div className="toast-feedback">
                <ToastContainer position="top-right" autoClose={2000} />
              </div>

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
              <MoreFlieds />
              <MediaUploader maxFiles={5} value={mediaFiles} onChange={setMediaFiles} />
              <TagInput value={tags} onChange={setTags} />

              

              <AnonymousToggle
                enabled={isAnonymous}
                setEnabled={setIsAnonymous}
                tokens={tokens}
              />

              <button type="submit" disabled={loading} id="content-post-button">
                {loading ? "Posting..." : "Post"}
              </button>
            </form>
        </article>
        <article id='preview-article'> 
          <div id="preview-container">
            <PreviewRadio />
          </div>
            
        </article>
      </div>
 
  );
}

const MoreFlieds = () => {
  const [selected, setSelected] = useState(1);

  return (
    <>
      {/* Radio-style buttons */}
      <div id="select-radio">
        <div  className='radio-button-div'>
             {[{label: 'Text', icon: <EditOutlined />, id: 1},
              {label: 'Image', icon: <FontAwesomeIcon icon={faImages} />, id: 2},
              {label: 'Tags', icon: <TagsOutlined />, id: 3},
              {label: 'Anonymous', icon: <FontAwesomeIcon icon={faMask} />, id: 4},
            ].map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => setSelected(opt.id)}
            style={{
              border: selected === opt.id ? "2px solid #fd7648" : "2px solid transparent",
              color: selected === opt.id ? "#fd7648" : "grey",
            }}
            className='radio-button'
          >
            {opt.icon}{" "}{opt.label}
          </button>
        ))}
        </div>
      </div>

      {/* Word underneath */}
      <div style={{ marginTop: "10px", color: "#555", fontSize: "14px" }}>
         {selected === 1 ? "A" : "D"}
      </div>
    </>
  );
};

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
      </div>
    </>
  );
};


