import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../style/page/Aboutpost.css";
import "../style/page/Home.css";
 import "../style/upload/Postpreview.css";
 import "../style/upload/MultipleMedia.css";
import {MediaPreview} from "../util/mediaUploader";

const AboutPost = () => {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("post") || "{}");
    // Only hydrate if the stored post matches the current id
    if (String(stored.postId) === String(id)) {
      setPost(stored);
    } else {
      // optional: clear if mismatch fetch from DB later
      sessionStorage.removeItem("post");
    }
  }, [id]);

  if (!post) {
    return (
      <div className="aboutPost">
        <h1>Post {id}</h1>
        <p>No data found in sessionStorage. (Cold start case)</p>
      </div>
    );
  }

  return (
    <div className="aboutPost">
      <h1>{post.title}</h1>
      <p>Author: {post.isAnonymous ? "Anonymous" : post.author}</p>
      <p>Type: {post.type}</p>
      <p>Tags: {post.postTags}</p>
     <MediaPreview files={parse.JSON(post.mediaUrl)} />
      <div className="post-body">
        <ReactMarkdown remarkPlugin={[remarkGfm]}>{post.textBody}</ReactMarkdown>
      </div>
      
    </div>
  );
};

export default AboutPost;
