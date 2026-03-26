// const pool = require("../../config/db");
// const {Error} = require("../../util/error/error");
// const content = async (req, res)=>{
//     try{
//         const userId = req.user.userId;
//         const {type, title, isAnonymous} = req.body;
//         const mediaUrl = [];
//         const mediaType = [];
//         const [create] = await pool.query(
//             `INSERT INTO content(user_id, type, title, media_type, media_url, is_anonymous)
//             VALUES(?, ?, ?, ?, ?, ?)`,
//             [userId, type, title, JSON.stringify(mediaType), JSON.stringify(mediaUrl), isAnonymous]
//         );
//         const contentId = create.insertId;
//         res.status(200).json({success: true, contentId: contentId});
//     }
//     catch(error){
//         console.error("Error creating content:", error.message);
//         await Error(error.message, error.code, "contentController", error.stack);
//         return res.status(500).json({success: false, error: error.message});
//     }
// }

// module.exports = {content};


// const pool = require("../../config/db");
// const { Error } = require("../../util/error/error");
// const ftp = require("basic-ftp");
// const path = require("path");
// const multer = require("multer");

// // Multer setup for multiple files
// const upload = multer({ dest: "temp/" });

// async function uploadToHostinger(localFile, remoteFile) {
//     const client = new ftp.Client();
//     try {
//         await client.access({
//             host: "ftp.picocolor.site",
//             user: "u859618886.nahideaLoader",
//             password: "naHideaLoad6r$$img",
//             secure: false
//         });
//         await client.uploadFrom(localFile, `/public_html/img/${remoteFile}`);
//     } finally {
//         client.close();
//     }
// }

// const content = async (req, res) => {
//     try {
//         // const userId = req.user.userId;
//         const { userId, type, title, isAnonymous } = req.body;

//         let mediaUrl = [];
//         let mediaType = [];

//         if (req.files && req.files.length > 0) {
//             for (const file of req.files) {
//                 const fileName = Date.now() + "-" + file.originalname;
//                 await uploadToHostinger(file.path, fileName);

//                 const fileUrl = `https://picocolor.site/img/${fileName}`;
//                 mediaUrl.push(fileUrl);

//                 // detect type
//                 if (file.mimetype.startsWith("image")) {
//                     mediaType.push("image");
//                 } else if (file.mimetype.startsWith("video")) {
//                     mediaType.push("video");
//                 } else {
//                     mediaType.push("other");
//                 }
//             }
//         }

//         const [create] = await pool.query(
//             `INSERT INTO content(user_id, type, title, media_type, media_url, is_anonymous)
//              VALUES(?, ?, ?, ?, ?, ?)`,
//             [userId, type, title, JSON.stringify(mediaType), JSON.stringify(mediaUrl), isAnonymous]
//         );

//         const contentId = create.insertId;
//         res.status(200).json({ success: true, contentId, mediaUrl });
//     } catch (error) {
//         console.error("Error creating content:", error.message);
//         await Error(error.message, error.code, "contentController", error.stack);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };

// module.exports = { content, upload };




// const content = async (req, res) => {
//     try {
//         const { userId, type, title, isAnonymous } = req.body;

//         let mediaUrl = [];
//         let mediaType = [];

//         if (req.files && req.files.length > 0) {
//             for (const file of req.files) {
//                 const fileName = Date.now() + "-" + file.originalname;
//                 await uploadToHostinger(file.path, fileName);

//                 const fileUrl = `https://picocolor.site/img/${fileName}`;
//                 mediaUrl.push(fileUrl);

//                 if (file.mimetype.startsWith("image")) {
//                     mediaType.push("image");
//                 } else if (file.mimetype.startsWith("video")) {
//                     mediaType.push("video");
//                 } else {
//                     mediaType.push("other");
//                 }
//             }
//         }

//         const [create] = await pool.query(
//             `INSERT INTO content(user_id, type, title, media_type, media_url, is_anonymous)
//              VALUES(?, ?, ?, ?, ?, ?)`,
//             [userId, type, title, JSON.stringify(mediaType), JSON.stringify(mediaUrl), isAnonymous]
//         );

//         const contentId = create.insertId;
//         res.status(200).json({ success: true, contentId, mediaUrl });
//     } catch (error) {
//         console.error("Error creating content:", error);
//         await Errors(error.message, error.code, "contentController", error.stack);
//         // Send full error details to frontend
//         return res.status(500).json({
//             success: false,
//             error: error.message,
//             stack: error.stack,
//             code: error.code || "UNKNOWN"
//         });
//     }
// };












// On react frontend

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("userId", 1)
  //   formData.append("title", "My Post");
  //   formData.append("type", "advice");
  //   formData.append("isAnonymous", false);

  //   files.forEach((file) => {
  //     if (file) {
  //       formData.append("media", file); 
  //     }
  //   });

  //   try {
  //     const res = await axios.post(
  //       "https://nahidea-sever-backend.onrender.com/api/posts/create/content",
  //       formData,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );
  //     console.log("Upload success:", res.data);
  //   } catch (err) {
  //     console.error("Upload failed:", err);
  //   }
  // };



  //media
    // <div style={{ display: "flex", gap: "10px" }}>
    //     {files.map((file, index) => (
    //       <div key={index} style={{ border: "1px solid #ccc", padding: "10px" }}>
    //         {file ? (
    //           <div>
    //             <p>{file.name}</p>
    //             <button type="button" onClick={() => handleRemove(index)}>
    //               Cancel
    //             </button>
    //           </div>
    //         ) : (
    //           <input
    //             type="file"
    //             accept="image/*,video/*"
    //             onChange={(e) => handleFileChange(index, e)}
    //           />
    //         )}
    //       </div>
    //     ))}
    //   </div>