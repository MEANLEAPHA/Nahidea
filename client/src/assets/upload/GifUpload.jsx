// import React, { useState } from "react";
// import { Form, Input, Button, Upload, message, Select } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import axios from "axios";

// export default function GifUpload() {
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (values) => {
//     try {
//       const formData = new FormData();
  
//       formData.append("gif_name", values.gif_name);
//       formData.append("gif_label", values.gif_label);
//       formData.append("gif_url", values.gif_url);
//       formData.append("gif_type", values.gif_type);

    

//       setLoading(true);

//       const res = await axios.post(
//         `${import.meta.env.VITE_SERVER_URL}/api/gifs/upload`,
//         formData
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
//     <Form onFinish={handleSubmit}>
//       <Form.Item name="gif_name" rules={[{ required: true }]}>
//         <Input placeholder="Name" />
//       </Form.Item>
//       <Form.Item name="gif_label" rules={[{ required: true }]}>
//         <Input placeholder="Label"/>
//       </Form.Item>
//       <Form.Item name="gif_url" rules={[{ required: true }]}>
//         <Input placeholder="Label"/>
//       </Form.Item>
//       <Form.Item name="gif_type" rules={[{ required: true }]}>
//         <Select
//           placeholder="Select GIF Category"
//           options={item_list}
//           showSearch
//           style={{ width: "100%" }}
//         />
//       </Form.Item>


//       <Button htmlType="submit" loading={loading}>
//         Submit
//       </Button>
//     </Form>
//   );
// };

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
import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

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

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("gif_name", values.gif_name);
      formData.append("gif_label", values.gif_label);
      formData.append("gif_url", values.gif_url);
      formData.append("gif_type", values.gif_type);

      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/gifs/upload`,
        formData
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

  return (
    <Form onFinish={handleSubmit} layout="vertical">
      <Form.Item name="gif_name" rules={[{ required: true }]}>
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item name="gif_label" rules={[{ required: true }]}>
        <Input placeholder="Label" />
      </Form.Item>
      <Form.Item name="gif_url" rules={[{ required: true }]}>
        <Input placeholder="GIF URL" />
      </Form.Item>
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
  );
}
