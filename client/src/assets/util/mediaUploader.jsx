import React, { useRef, useMemo, useState} from "react";
import {RightOutlined , CloseOutlined,TagsOutlined,CloudUploadOutlined,DeleteOutlined, PlusOutlined, ClearOutlined, LeftOutlined} from '@ant-design/icons';
import { Carousel } from 'antd';
import { Skeleton } from 'antd';
export  function MediaUploader({ maxFiles = 5, value = [], onChange }) {
  const multiInputRef = useRef(null);

  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const next = [...value];
    for (let i = 0; i < maxFiles && selected.length; i++) {
      if (!next[i]) next[i] = selected.shift() || null;
    }
    onChange?.(next.filter(Boolean));
    if (multiInputRef.current) multiInputRef.current.value = "";
  };

  const handleSingleSelect = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const next = [...value];
    next[index] = file;
    onChange?.(next.filter(Boolean));
    e.target.value = "";
  };

  const handleRemove = (index) => {
    const next = [...value];
    next.splice(index, 1);
    onChange?.(next);
  };

  const handleRemoveAll = () => {
    onChange?.([]);
    if (multiInputRef.current) multiInputRef.current.value = "";
  };

  const filledCount = value.length;
  const remaining = maxFiles - filledCount;

 const mediaFileUrl = (file) => URL.createObjectURL(file);


return (
  <div className="media-uploader">
   
    {filledCount === 0 ? (
      <label className="upload-placeholder">
        <CloudUploadOutlined id='cloud-icon'/>
        <input
          ref={multiInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleMultiSelect}
          className="file-input"
        />
        <small className="upload-hint">
          You can select up to {maxFiles} files at once.
        </small>
      </label>
    ) : (
  
        <Carousel arrows infinite={true} className="media-carousel" swipe={true} draggable={true} autoplay={{ pauseOnHover: true }} autoplaySpeed={10000}
         prevArrow={<button className="slick-arrow slick-prev"><LeftOutlined /></button>}
  nextArrow={<button className="slick-arrow slick-next"><RightOutlined /></button>} >
          {value.map((file, idx) => (
            <div className="carousel-slide" key={idx}>
              {file ? (
                <>
                  {(file.type || "").startsWith("image/") ? (
                   <div 
                      className="preview-wrapper" 
                      style={{ "--preview-url": `url(${mediaFileUrl(file)})` }}
                      >
                      <img src={mediaFileUrl(file)} alt={file.name} className="preview-image" />
                      <button type="button" onClick={() => handleRemove(idx)} className="remove-btn"><DeleteOutlined /></button>
                    </div>

                  ) : (
                    <div className="video-placeholder">Video file selected</div>
                  )}
                </>
              ) : (
                <label className="add-file-label">
                  <div className="add-file-text">Add file</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSingleSelect(idx, e)}
                    className="file-input"
                  />
                </label>
              )}
            </div>
          ))}
        </Carousel>

    )}
    {
     filledCount > 0 && (
      <div className="uploader-footer">
        
        {remaining > 0 && (
          <div className="add-more">
            <label className="add-more-label">
              <button className="add-more-text" type="button" onClick={() => multiInputRef.current.click()}>
                <PlusOutlined /> Add up to {remaining} more file{remaining > 1 ? "s" : ""}
              </button>
              <input
                ref={multiInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultiSelect}
                className="file-input"
              />
            </label>
          </div>
        )}
        {remaining === 0 && (
           <button type="button" disabled='true' style={{visibility: 'hidden'}}>Empty</button>
        )}
         <div className="uploader-footer-right">
          <button
            type="button"
            onClick={handleRemoveAll}
            disabled={filledCount === 0}
            className="remove-all-btn"
            style={filledCount > 1 ? {display: "block"} : {display: "none"}}
          >
          <ClearOutlined /> Remove all
          </button>
        <div className="media-count">
          {filledCount} / {maxFiles}
        </div>
      </div>
    </div>
     )
    }
  </div>
);
}

export  function MediaPreview({ files = [] }) {
  if (!files.length) {
    return (
      <div className="media-preview-empty">
          <Skeleton.Image active />
      </div>
    );
  }

  const mediaFileUrl = (file) => URL.createObjectURL(file);

  return (
    <Carousel
      arrows
      infinite={true}
      className="media-preview-carousel"
      swipe={true}
      draggable={true}
      autoplay={{ pauseOnHover: true }}
      autoplaySpeed={8000}
      prevArrow={
        <button className="slick-arrow slick-prev">
          <LeftOutlined />
        </button>
      }
      nextArrow={
        <button className="slick-arrow slick-next">
          <RightOutlined />
        </button>
      }
    >
      {files.map((file, idx) => (
        <div className="carousel-slide" key={idx}>
          {(file.type || "").startsWith("image/") ? (
            <div
              className="preview-wrapper"
              style={{ "--preview-url": `url(${mediaFileUrl(file)})` }}
            >
              <img
                src={mediaFileUrl(file)}
                alt={file.name || `preview-${idx}`}
                className="preview-image"
              />
            </div>
          ) : (
            <div className="video-placeholder">Video file selected</div>
          )}
        </div>
      ))}
    </Carousel>
  );
}


            {/* {value.map((file, idx) => (
              <div
                key={idx}
                style={{
                  width: 180,
                  minHeight: 80,
                  border: "1px solid #ccc",
                  padding: 8,
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {file ? (
                  <>
                    <div style={{ fontSize: 13, marginBottom: 8, wordBreak: "break-word" }}>
                      <strong>{file.name}</strong>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {(file.type || "").startsWith("image/") ? "Image" : "Video"}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" onClick={() => handleRemove(idx)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleSingleSelect(idx, e)}
                    />
                    <div style={{ fontSize: 12, color: "#666" }}>Add file</div>
                  </>
                )}
              </div>
            ))} */}

            {/*         
          <Carousel arrows infinite={true}>
           
              {value.map((file, idx) => (
            <div style={contentStyle}>
              {file ? (
                <>
                  {(file.type || "").startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{
                        width: "100%",
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 4,
                        marginBottom: 8,
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                      Video file selected
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={() => handleRemove(idx)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <label style={{ cursor: "pointer" }}>
                    <div style={{ fontSize: 12, color: "#666" }}>Add file</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleSelect(idx, e)}
                      style={{ display: "none" }}
                    />
                  </label>
                </>
              )}
            </div>
          ))}
            
          </Carousel>
         */}


//          return (
//   <div className="media-uploader">
//     <p className='anonymous-label'><CloudUploadOutlined /> Image</p>
//     {filledCount === 0 ? (
//       <label
//         style={{
//           border: "1px dashed #ccc",
//           padding: "50px",
//           borderRadius: 6,
//           display: "block",
//           textAlign: "center",
//           cursor: "pointer",
//         }}
//       >
//         Click to upload image
//         <input
//           ref={multiInputRef}
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleMultiSelect}
//           style={{ display: "none" }} // hide the raw input
//         />
//         <small style={{ color: "#666" }}>
//           You can select up to {maxFiles} files at once.
//         </small>
//       </label>
//     ) : (
//       <>
    



//     <Carousel arrows infinite={true}>
//       {value.map((file, idx) => (
//         <div style={contentStyle} key={idx}>
//           {file ? (
//             <>
//               {(file.type || "").startsWith("image/") ? (
//                 <div style={{ position: "relative", width: "100%", height: "100%" }}>
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt={file.name}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                       borderRadius: 6,
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemove(idx)}
//                     style={{
//                       position: "absolute",
//                       top: 8,
//                       right: 8,
//                       background: "rgba(0,0,0,0.6)",
//                       color: "#fff",
//                       border: "none",
//                       borderRadius: "50%",
//                       width: 28,
//                       height: 28,
//                       cursor: "pointer",
//                       fontSize: 14,
//                       lineHeight: "28px",
//                     }}
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ) : (
//                 <div style={{ fontSize: 14, color: "#eee" }}>Video file selected</div>
//               )}
//             </>
//           ) : (
//             <label style={{ cursor: "pointer", display: "block", height: "100%" }}>
//               <div style={{ fontSize: 14, color: "#eee" }}>Add file</div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleSingleSelect(idx, e)}
//                 style={{ display: "none" }}
//               />
//             </label>
//           )}
//         </div>
//       ))}
//     </Carousel>

     

//         {/* add more */}
//         {remaining > 0 && (
//           <div style={{ marginTop: 10 }}>
//             <label style={{ cursor: "pointer" }}>
//               <div style={{ fontSize: 12, color: "#666" }}>
//                 Add up to {remaining} more file{remaining > 1 ? "s" : ""}.
//               </div>
//               <input
//                 ref={multiInputRef}
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleMultiSelect}
//                 style={{ display: "none" }}
//               />
//             </label>
//           </div>
//         )}
        
//       </>
//     )}
//     <div style={{ display: "flex", alignItems: "center", marginBottom: 8, justifyContent: "space-between" , marginTop: 10}}>
//       <button
//         type="button"
//         onClick={handleRemoveAll}
//         disabled={filledCount === 0}
//       >
//         Remove all
//       </button>
//       <div>
//         <strong>{filledCount}</strong> / {maxFiles} media
//       </div>
//     </div>
//   </div>
// );