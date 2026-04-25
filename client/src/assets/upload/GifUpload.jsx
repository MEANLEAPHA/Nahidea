// import React, { useState } from "react";
// import { Form, Input, Button, Upload, message } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import axios from "axios";
// const token = localStorage.getItem("token");
// export default function GifUpload() {
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (values) => {
//     const formData = new FormData();
//     formData.append("gif", values.gif.file.originFileObj);
//     formData.append("gif_name", values.gif_name);

// try {
//   setLoading(true);
//   const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/gifs/upload`, formData, {
//     headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
//   });

//   if (res.data.success) {
//     message.success("GIF uploaded successfully!");
//   } else {
//     message.error(res.data.error);
//   }
// } catch (err) {
//   if (err.response?.status === 429) {
//     message.warning("You’ve hit the hourly limit (42 uploads). Please wait one hour before uploading again.");
//   } else {
//     message.error("Upload failed.");
//   }
// } finally {
//   setLoading(false);
// }

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
//           name="gif"
//           label="Upload GIF"
//           rules={[{ required: true, message: "Please upload a GIF" }]}
//         >
//           <Upload beforeUpload={() => false} maxCount={1} accept="image/gif">
//             <Button icon={<UploadOutlined />}>Select GIF</Button>
//           </Upload>
//         </Form.Item>
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

const token = localStorage.getItem("token");

export default function GifUpload() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("gif", values.gif.file.originFileObj);
    formData.append("gif_name", values.gif_name);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/gifs/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        message.success("GIF uploaded successfully!");
      } else {
        message.error(res.data.error);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        message.warning(
          "You’ve hit the hourly limit (42 uploads). Please wait one hour before uploading again."
        );
      } else {
        message.error("Upload failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="gif_name"
          label="GIF Name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input placeholder="Enter a name for your GIF" />
        </Form.Item>

        <Form.Item
          name="gif"
          label="Upload Image/Video"
          rules={[{ required: true, message: "Please upload a file" }]}
        >
          <Upload
            beforeUpload={(file) => {
              const isAllowedType = [
                "image/gif",
                "image/png",
                "image/jpeg",
                "video/mp4",
              ].includes(file.type);
              if (!isAllowedType) {
                message.error("Only GIF, PNG, JPG, or MP4 files are allowed.");
                return Upload.LIST_IGNORE;
              }
              const isLt10M = file.size / 1024 / 1024 < 10;
              if (!isLt10M) {
                message.error("File must be smaller than 10MB!");
                return Upload.LIST_IGNORE;
              }
              return false; // prevent auto upload, let Form handle it
            }}
            maxCount={1}
            accept="image/gif,image/png,image/jpeg,video/mp4"
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Upload
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
