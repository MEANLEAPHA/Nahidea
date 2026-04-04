// import React from "react";
// import { useState, useEffect, useRef } from 'react';
// export default function MediaUploader({ maxFiles = 5, onChange }) {
//   // files: array of File | null, length = maxFiles
//   const [files, setFiles] = useState(Array(maxFiles).fill(null));
//   const multiInputRef = useRef(null);

//   // helper to notify parent
//   const emitChange = (next) => {
//     setFiles(next);
//     onChange?.(next.filter(Boolean)); // send only non-null files
//   };

//   // When user uses the initial multi-file input
//   const handleMultiSelect = (e) => {
//     const selected = Array.from(e.target.files || []);
//     if (selected.length === 0) return;

//     // limit to remaining slots
//     const next = [...files];
//     let slotIndex = 0;
//     for (let i = 0; i < next.length && selected.length; i++) {
//       if (!next[i]) {
//         next[i] = selected.shift() || null;
//       }
//     }
//     emitChange(next);

//     // reset the multi input so same files can be reselected later if needed
//     if (multiInputRef.current) multiInputRef.current.value = "";
//   };

//   // When user selects a single file for a specific slot
//   const handleSingleSelect = (index, e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const next = [...files];
//     next[index] = file;
//     emitChange(next);
//     e.target.value = "";
//   };

//   const handleRemove = (index) => {
//     const next = [...files];
//     next[index] = null;
//     emitChange(next);
//   };

//   const handleRemoveAll = () => {
//     const next = Array(maxFiles).fill(null);
//     emitChange(next);
//     if (multiInputRef.current) multiInputRef.current.value = "";
//   };

//   // count filled slots
//   const filledCount = files.filter(Boolean).length;
//   const remaining = maxFiles - filledCount;

//   return (
//     <div className="media-uploader">
//       <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
//         <strong>{filledCount}</strong> / {maxFiles} media
//         <button
//           type="button"
//           onClick={handleRemoveAll}
//           disabled={filledCount === 0}
//           style={{ marginLeft: "auto" }}
//         >
//           Remove all
//         </button>
//       </div>

//       {/* If no files selected at all, show the single multi-file input as fallback */}
//       {filledCount === 0 ? (
//         <div style={{ border: "1px dashed #ccc", padding: 12, borderRadius: 6 }}>
//           <input
//             ref={multiInputRef}
//             type="file"
//             accept="image/*,video/*"
//             multiple
//             onChange={handleMultiSelect}
//             style={{ display: "block" }}
//           />
//           <small style={{ color: "#666" }}>You can select up to {maxFiles} files at once.</small>
//         </div>
//       ) : (
//         <>
//           {/* Show filled slots and single-file inputs for remaining slots */}
//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//             {files.map((file, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   width: 180,
//                   minHeight: 80,
//                   border: "1px solid #ccc",
//                   padding: 8,
//                   borderRadius: 6,
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 {file ? (
//                   <>
//                     <div style={{ fontSize: 13, marginBottom: 8, wordBreak: "break-word" }}>
//                       <strong>{file.name}</strong>
//                       <div style={{ fontSize: 12, color: "#666" }}>
//                         {(file.type || "").startsWith("image/") ? "Image" : "Video"}
//                       </div>
//                     </div>
//                     <div style={{ display: "flex", gap: 8 }}>
//                       <button type="button" onClick={() => handleRemove(idx)}>
//                         Cancel
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <input
//                       type="file"
//                       accept="image/*,video/*"
//                       onChange={(e) => handleSingleSelect(idx, e)}
//                     />
//                     <div style={{ fontSize: 12, color: "#666" }}>Add file</div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* If there are still remaining slots, show a small multi-input to add multiple at once */}
//           {remaining > 0 && (
//             <div style={{ marginTop: 10 }}>
//               <input
//                 ref={multiInputRef}
//                 type="file"
//                 accept="image/*,video/*"
//                 multiple
//                 onChange={handleMultiSelect}
//               />
//               <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
//                 You can add up to {remaining} more file{remaining > 1 ? "s" : ""}.
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
import React, { useRef } from "react";

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

  return (
    <div className="media-uploader">
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <strong>{filledCount}</strong> / {maxFiles} media
        <button
          type="button"
          onClick={handleRemoveAll}
          disabled={filledCount === 0}
          style={{ marginLeft: "auto" }}
        >
          Remove all
        </button>
      </div>

      {filledCount === 0 ? (
        <div style={{ border: "1px dashed #ccc", padding: 12, borderRadius: 6 }}>
          <input
            ref={multiInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMultiSelect}
            style={{ display: "block" }}
          />
          <small style={{ color: "#666" }}>You can select up to {maxFiles} files at once.</small>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {value.map((file, idx) => (
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
            ))}
          </div>

          {remaining > 0 && (
            <div style={{ marginTop: 10 }}>
              <input
                ref={multiInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMultiSelect}
              />
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                You can add up to {remaining} more file{remaining > 1 ? "s" : ""}.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
