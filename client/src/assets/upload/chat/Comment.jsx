import React, { useEffect, useState } from "react";
// import "./comments.css";

// const API = "http://localhost:5000";

export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const fetchComments = async () => {
    const res = await fetch(`${API}/comments/1`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) return alert("Empty comment");

    try {
      await fetch(`${API}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: 1,
          parent_id: replyTo?.parent_id || replyTo?.id || null,
          user_id: 1,
          username: "user1",
          content: text,
          username_mention: replyTo?.username || null
        })
      });

      setText("");
      setReplyTo(null);
      fetchComments();

    } catch (err) {
      alert("Failed to post");
    }
  };

  return (
    <div className="container">
      <h2>Comments</h2>

      <div className="input-box">
        {replyTo && <p>Replying to @{replyTo.username}</p>}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleSubmit}>Post</button>
      </div>

      {comments.map(c => (
        <div key={c.id} className="comment">
          <p><b>{c.username}</b> {c.content}</p>

          <button onClick={() => setReplyTo(c)}>Reply</button>

          <div className="replies">
            {c.replies.map(r => (
              <div key={r.id} className="reply">
                <p>
                  <b>{r.username}</b>{" "}
                  {r.username_mention && `@${r.username_mention} `}
                  {r.content}
                </p>

                <button onClick={() => setReplyTo(c)}>Reply</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// .container {
//   max-width: 600px;
//   margin: auto;
//   font-family: Arial;
// }

// .input-box textarea {
//   width: 100%;
//   padding: 10px;
//   border-radius: 10px;
//   border: 1px solid #ddd;
// }

// button {
//   background: #0095f6;
//   color: white;
//   border: none;
//   padding: 8px 14px;
//   margin-top: 5px;
//   border-radius: 8px;
//   cursor: pointer;
// }

// .comment {
//   border-bottom: 1px solid #eee;
//   padding: 10px 0;
// }

// .replies {
//   margin-left: 20px;
// }

// .reply {
//   font-size: 0.9em;
//   color: #444;
// }