

// const item_list = [
//   { value: "laughing", label: "😂 Laughing / LOL" },
//   { value: "crying", label: "😢 Crying / Sad" },
//   { value: "angry", label: "😡 Angry / Rage" },
//   { value: "surprised", label: "😲 Surprised / Shocked" },
//   { value: "confused", label: "🤔 Confused / Eye Roll" },
//   { value: "thumbs_up", label: "👍 Thumbs Up" },
//   { value: "applause", label: "👏 Applause / Clapping" },
//   { value: "facepalm", label: "🤦 Facepalm" },
//   { value: "birthday", label: "🎂 Happy Birthday" },
//   { value: "congrats", label: "🎉 Congratulations / Cheers" },
//   { value: "party", label: "🕺 Party / Dancing" },
//   { value: "hug", label: "🤗 Hug / Love" },
//   { value: "thank_you", label: "🙏 Thank You" },
//   { value: "cat_meme", label: "🐱 Cat Meme" },
//   { value: "dog_meme", label: "🐶 Dog Meme" },
//   { value: "spongebob", label: "🟨 SpongeBob Meme" },
//   { value: "simpsons", label: "💛 Simpsons Meme" },
//   { value: "gaming", label: "🎮 Gaming GIF" },
//   { value: "yes", label: "✅ Yes" },
//   { value: "no", label: "❌ No" },
//   { value: "omg", label: "😱 OMG / Wow" },
//   { value: "bye", label: "👋 Bye / Wave" },
//   { value: "please", label: "🙇 Please / Sorry" },
// ];

// export default function GifUpload() {
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (values) => {
//     try {
   

//       setLoading(true);

//       const res = await axios.post(
//         `${import.meta.env.VITE_SERVER_URL}/api/gifs/upload`,
//          {
//             gif_name: values.gif_name,
//             gif_label: values.gif_label,
//             gif_url: values.gif_url,
//             gif_type: values.gif_type,
//           }
//       );

//       if (res.data.success) {
//         message.success("Uploaded");
//       } else {
//         message.error(res.data.error);
//       }
//     } catch (err) {
//       console.error(err);
//       message.error("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Form onFinish={handleSubmit} layout="vertical">
//       <Form.Item name="gif_name" rules={[{ required: true }]}>
//         <Input placeholder="Name" />
//       </Form.Item>
//       <Form.Item name="gif_label" rules={[{ required: true }]}>
//         <Input placeholder="Label" />
//       </Form.Item>
//       <Form.Item name="gif_url" rules={[{ required: true }]}>
//         <Input placeholder="GIF URL" />
//       </Form.Item>
//       <Form.Item name="gif_type" rules={[{ required: true }]}>
//         <Select
//           placeholder="Select GIF Category"
//           options={item_list}
//           showSearch
//           style={{ width: "100%" }}
//         />
//       </Form.Item>
//       <Button type="primary" htmlType="submit" loading={loading}>
//         Submit
//       </Button>
//     </Form>
//   );
// }
// import React, { useState } from "react";
// import { Form, Input, Button, Select, message } from "antd";
// import axios from "axios";
// import "./GifUpload.css";

import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";
import "../style/upload/GifUpload.css";

const item_list = [
  { value: "laughing", label: "😂 Laughing / LOL" },
  { value: "crying", label: "😢 Crying / Sad" },
  { value: "angry", label: "😡 Angry / Rage" },
  { value: "surprised", label: "😲 Surprised / Shocked" },
  { value: "confused", label: "🤔 Confused / Eye Roll" },
  { value: "thumbs_up", label: "👍 Thumbs Up" },
  { value: "applause", label: "👏 Applause / Clapping" },
  { value: "facepalm", label: "🤦 Facepalm" },
  { value: "birthday", label: "🎂 Happy Birthday" },
  { value: "congrats", label: "🎉 Congratulations / Cheers" },
  { value: "party", label: "🕺 Party / Dancing" },
  { value: "hug", label: "🤗 Hug / Love" },
  { value: "thank_you", label: "🙏 Thank You" },
  { value: "cat_meme", label: "🐱 Cat Meme" },
  { value: "dog_meme", label: "🐶 Dog Meme" },
  { value: "spongebob", label: "🟨 SpongeBob Meme" },
  { value: "simpsons", label: "💛 Simpsons Meme" },
  { value: "gaming", label: "🎮 Gaming GIF" },
  { value: "yes", label: "✅ Yes" },
  { value: "no", label: "❌ No" },
  { value: "omg", label: "😱 OMG / Wow" },
  { value: "bye", label: "👋 Bye / Wave" },
  { value: "please", label: "🙇 Please / Sorry" },
];


export default function GifUpload() {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [form] = Form.useForm(); // ✅ create form instance

  const handleSubmit = async (values) => {
    if (!values.gif_url.toLowerCase().endsWith(".gif")) {
      message.error("Only .gif links are allowed.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/gifs/upload`,
        {
          gif_name: values.gif_name,
          gif_label: values.gif_label, // renamed label -> tag
          gif_url: values.gif_url,
          gif_type: values.gif_type,
        }
      );
      if (res.data.success) {
        message.success("Uploaded");
      } else {
        message.error(res.data.error);
      }
    } catch (err) {
      console.error(err);
      message.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      form.setFieldsValue({ gif_url: text }); // ✅ set value in form
      setPreviewUrl(text);
    } catch {
      message.error("Failed to paste from clipboard");
    }
  };

  return (
    <div className="gif-upload-container">
      <div className="gif-upload-header">
        <p className="p-head">Upload Your Favorite GIF Is Very Easy</p>
        <p>Choose any GIF provider and paste the link down below</p>
        <div className="gif-provider-grid">
          <a href="https://giphy.com" target="_blank" rel="noopener noreferrer">
            <img src="https://giphy.com/static/img/giphy-be-animated-logo.gif" alt="Giphy" />
          </a>
          <a href="https://tenor.com" target="_blank" rel="noopener noreferrer">
            <img src="https://miro.medium.com/1*5hX-Oevy9NZ7KC_OP4LyLA.gif" alt="Tenor" />
          </a>
          <a href="https://imgur.com" target="_blank" rel="noopener noreferrer">
            <img src="https://i.imgur.com/HnJkrC5.gif" alt="Imgur" />
          </a>
          <a href="https://www.gifbin.com" target="_blank" rel="noopener noreferrer">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3A2uVIZMtPo9l4ChNQZd5gr0MXAi-JwPNyQ&s" alt="GIFbin" />
          </a>
          <a href="https://www.tumblr.com/explore/gifs" target="_blank" rel="noopener noreferrer">
            <img src="https://64.media.tumblr.com/bd6fff7623438e399cdd5d197d08910b/tumblr_no5c6imzO61r7ealro1_r1_540.gif" alt="Reaction GIFs" />
          </a>
        </div>
      </div>

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="gif_name" rules={[{ required: true }]}>
          <Input placeholder="GIF Name (e.g. Dancing SpongeBob)" />
        </Form.Item>
        <Form.Item name="gif_label" rules={[{ required: true }]}>
          <Input placeholder="Tags (e.g. funny, cartoon, party)" />
        </Form.Item>
        <Form.Item name="gif_url" rules={[{ required: true }]}>
          <Input
            placeholder="Paste GIF URL"
            addonAfter={<Button type="link" onClick={handlePaste}>Paste</Button>}
            onChange={(e) => setPreviewUrl(e.target.value)}
          />
        </Form.Item>
        {previewUrl && previewUrl.toLowerCase().endsWith(".gif") && (
          <div className="gif-preview">
            <img src={previewUrl} alt="GIF Preview" />
          </div>
        )}
        <Form.Item name="gif_type" rules={[{ required: true }]}>
          <Select
            placeholder="Select GIF Category"
            options={item_list}
            showSearch
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
