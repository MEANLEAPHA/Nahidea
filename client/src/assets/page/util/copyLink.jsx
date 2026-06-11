import { message } from "antd";

const handleCopyLink = async (postId) => {
  try {

    const postUrl = `https://nahidea.onrender.com/aboutpost/${postId}`;

    await navigator.clipboard.writeText(postUrl);

    message.success("Link copied successfully");

  } catch (err) {

    console.error(err);

    message.error("Failed to copy link");
  }
};

export default handleCopyLink