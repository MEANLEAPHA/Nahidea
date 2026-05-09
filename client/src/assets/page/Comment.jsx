import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

const token = localStorage.getItem("token");

const username = sessionStorage.getItem("username");
const Comment = () => {
  const { state } = useLocation();
  const {username} = useOutletContext();
  
  const navigate = useNavigate();



  // const [content, setContent] = useState(
  // state?.mode === "edit" ? state?.content || "" : ""
  // );
  
  const [content, setContent] = useState("");
  const [gif, setGif] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [lockedAnon, setLockedAnon] = useState(false);

 
  useEffect(() => {
    fetchAnon();
    if (state?.content) setContent(state.content);
  }, []);

  const fetchAnon = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/get-anon-identity/${state.postId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.exists) setLockedAnon(true);
  };

  const submit = async () => {
    const payload = {
      content,
      username_mention,
      username: username,
      gif_url: gif,
      is_anonymous: isAnon ? 1 : 0,
      parent_id: state?.parent_id || null
    };

    if (state?.mode === "edit") {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/comments/${state.commentId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/${state.postId}/comments`,
        payload,
        { headers: { Authorization:  `Bearer ${token}`} }
      );
    }

    navigate(-1);
  };

  return (
    <div className="comment-page">

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
      />

      <input
        value={gif}
        onChange={(e) => setGif(e.target.value)}
        placeholder="GIF URL"
      />

      {gif && (
        <img src={gif} className="gif-preview" />
      )}

      {!lockedAnon && (
        <label>
          <input
            type="checkbox"
            checked={isAnon}
            onChange={() => setIsAnon(!isAnon)}
          />
          Anonymous
        </label>
      )}

      <button onClick={submit}>
        Submit
      </button>

    </div>
  );
};

export default Comment;