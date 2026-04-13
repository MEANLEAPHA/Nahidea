import React, { useRef } from "react";
import { CloseOutlined,TagsOutlined,CloudUploadOutlined   } from '@ant-design/icons';
import { Carousel } from 'antd';
export default function MediaUploader({ maxFiles = 5, value = [], onChange }) {
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
const contentStyle = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
return (
  <div className="media-uploader">
    <p className='anonymous-label'><CloudUploadOutlined /> Image</p>
    {filledCount === 0 ? (
      <label
        style={{
          border: "1px dashed #ccc",
          padding: "50px",
          borderRadius: 6,
          display: "block",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        Click to upload image
        <input
          ref={multiInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleMultiSelect}
          style={{ display: "none" }} // hide the raw input
        />
        <small style={{ color: "#666" }}>
          You can select up to {maxFiles} files at once.
        </small>
      </label>
    ) : (
      <>
        
          <Carousel arrows infinite={true} autoplay={{ dotDuration: true }} autoplaySpeed={5000}>
           
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
        
     

        {/* add more */}
        {remaining > 0 && (
          <div style={{ marginTop: 10 }}>
            <label style={{ cursor: "pointer" }}>
              <div style={{ fontSize: 12, color: "#666" }}>
                Add up to {remaining} more file{remaining > 1 ? "s" : ""}.
              </div>
              <input
                ref={multiInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultiSelect}
                style={{ display: "none" }}
              />
            </label>
          </div>
        )}
        
      </>
    )}
    <div style={{ display: "flex", alignItems: "center", marginBottom: 8, justifyContent: "space-between" , marginTop: 10}}>
      <button
        type="button"
        onClick={handleRemoveAll}
        disabled={filledCount === 0}
      >
        Remove all
      </button>
      <div>
        <strong>{filledCount}</strong> / {maxFiles} media
      </div>
    </div>
  </div>
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