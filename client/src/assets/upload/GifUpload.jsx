
// import React, { useState } from "react";
// import { Form, Input, Button, Upload, message } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import axios from "axios";



// export default function GifUpload() {
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (values) => {
//     const formData = new FormData();
//     // formData.append("gif", values.gif.file.originFileObj);

// formData.append("gif", values.gif[0].originFileObj);
// formData.append("gif_name", values.gif_name);
// formData.append("userId", 1);


//     try {
//       setLoading(true);
//       const res = await axios.post(
//         `${import.meta.env.VITE_SERVER_URL}/api/gifs/upload`,
//         formData,
//         {
//         headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (res.data.success) {
//         message.success("GIF uploaded successfully!");
//       } else {
//         message.error(res.data.error);
//       }
//     } catch (err) {
//       if (err.response?.status === 429) {
//         message.warning(
//           "You’ve hit the hourly limit (42 uploads). Please wait one hour before uploading again."
//         );
//       } else {
//         message.error("Upload failed.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
//       <Form layout="vertical" onFinish={handleSubmit}>
//         <Form.Item
//           name="gif_name"
//           label="GIF Name"
//           rules={[{ required: true, message: "Please enter a name" }]}
//         >
//           <Input placeholder="Enter a name for your GIF" />
//         </Form.Item>

//         <Form.Item
//   name="gif"
//   label="Upload Image/Video"
//   rules={[{ required: true, message: "Please upload a file" }]}
//   valuePropName="fileList"
//   getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
// >
//   <Upload
//     beforeUpload={(file) => {
//       const isAllowedType = [
//         "image/gif",
//         "image/png",
//         "image/jpeg",
//         "video/mp4",
//       ].includes(file.type);
//       if (!isAllowedType) {
//         message.error("Only GIF, PNG, JPG, or MP4 files are allowed.");
//         return Upload.LIST_IGNORE;
//       }
//       const isLt10M = file.size / 1024 / 1024 < 10;
//       if (!isLt10M) {
//         message.error("File must be smaller than 10MB!");
//         return Upload.LIST_IGNORE;
//       }
//       return false; // prevent auto upload
//     }}
//     maxCount={1}
//     accept="image/gif,image/png,image/jpeg,video/mp4"
//   >
//     <Button icon={<UploadOutlined />}>Select File</Button>
//   </Upload>
// </Form.Item>


//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={loading}>
//             Upload
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

export default function GifUpload() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      const file = values.gif?.[0]?.originFileObj;
      if (!file) throw new Error("File missing");

      if (file.size > 10 * 1024 * 1024) {
        return message.error("Max 10MB")
      }

      const formData = new FormData();
      formData.append("gif", file);
      formData.append("gif_name", values.gif_name);
      formData.append("userId", 1);

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
    <Form onFinish={handleSubmit}>
      <Form.Item name="gif_name" rules={[{ required: true }]}>
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item
        name="gif"
        valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList}
        rules={[{ required: true }]}
      >
        <Upload beforeUpload={() => false} maxCount={1}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      <Button htmlType="submit" loading={loading}>
        Submit
      </Button>
    </Form>
  );
};