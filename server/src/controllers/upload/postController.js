const pool = require("../../config/db");

const createPost = async (req, res) => {
  const { type, title, content, is_anonymous, options } = req.body;

  const [result] = await pool.query(
    "INSERT INTO posts (user_id, type, title, content, is_anonymous) VALUES (?, ?, ?, ?, ?)",
    [req.user.id, type, title, content, is_anonymous]
  );

  const postId = result.insertId;

  if (type === "decision" && options) {
    for (let opt of options) {
      await pool.query(
        "INSERT INTO decision_options (post_id, option_text) VALUES (?, ?)",
        [postId, opt]
      );
    }
  }

  res.json({ message: "Post created", postId });
};

const getPosts = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC"
  );
  res.json(rows);
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  const [post] = await pool.query(
    "SELECT * FROM posts WHERE id=?",
    [id]
  );

  const [comments] = await pool.query(
    "SELECT * FROM comments WHERE post_id=?",
    [id]
  );

  const [options] = await pool.query(
    "SELECT * FROM decision_options WHERE post_id=?",
    [id]
  );

  res.json({ post: post[0], comments, options });
};



const markSolved = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE posts SET status='solved' WHERE id=? AND user_id=?",
    [id, req.user.id]
  );

  res.json({ message: "Marked as solved" });
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  markSolved,
};