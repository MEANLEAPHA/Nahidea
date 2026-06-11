import axios from "axios";
import { message } from "antd";
const token = localStorage.getItem("token");


const handleDeletePost = async (postId) => {
  try {
    await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/delete-post/${postId}`,
       { headers: { Authorization: `Bearer ${token}` } });
    message.success("Post deleted successfully");
  } catch (err) {
    console.error(err);
    message.error("Failed to delete post");
  }
};

export default handleDeletePost;