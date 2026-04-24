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
      // <div className="media-preview-empty">
      //     <Skeleton.Image active />
      // </div>
      null
    );
  }

  const mediaFileUrl = (file) => {
    if(file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file;
  }
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
          {typeof file === "string" || (file.type || "").startsWith("image/") ? (
            <div className="preview-wrapper"  style={{ "--preview-url": `url(${mediaFileUrl(file)})` }}>
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
