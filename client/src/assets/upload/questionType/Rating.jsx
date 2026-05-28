// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { iconOptions } from "../../data/post_type_data";
// export default function Rating ({ value, onChange}) {
//   return (
//     <div>
//       <p>{Array.from({length:5}).map((_,i)=>(
//         <FontAwesomeIcon 
//           key={i}
//           icon={iconOptions.find((opt) => opt.id === value)?.icon}
//           style={{ fontSize: "24px", color: "#ff3434" }}
//         />
//       ))}</p>
    
//       <button
//         type="button"
//         onClick={() => {
//           const selector = document.getElementById("icon-selector");
//           selector.style.display =
//             selector.style.display === "none" ? "block" : "none";
//         }}
//       >
//         Change icon type
//       </button>

//       <div id="icon-selector" style={{ display: "none", marginTop: "10px" }}>
//         {iconOptions.map((opt) => (
//           <label key={opt.id} style={{ marginRight: "15px", cursor: "pointer" }}>
//             <input
//               type="radio"
//               name="iconType"
//               value={opt.id}
//               checked={value === opt.id}
//               onChange={() => onChange(opt.id)}
//               style={{ display: "none" }}
//             />
//             <FontAwesomeIcon
//               icon={opt.icon}
//               style={{
//                 fontSize: "28px",
//                 color: value === opt.id ? "#ff9800" : "#555",
//               }}
//             />
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { iconOptions } from "../../data/post_type_data";

import "../../style/upload/questionType/rating.css";

export default function Rating({ value, onChange }) {

  const [openSelector, setOpenSelector] = useState(false);

  const selectedIcon = iconOptions.find(
    (opt) => opt.id === value
  );

  return (
    <div className="question-type-wrapper">
    <div className="rating-wrapper">

      {/* PREVIEW */}
      <div className="rating-preview">

        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rating-preview-icon"
          >
            <FontAwesomeIcon
              icon={selectedIcon?.icon}
            />
          </div>
        ))}

      </div>

      {/* TOGGLE */}
      <button
        type="button"
        className="btn-rating-toggle"
        onClick={() => setOpenSelector(!openSelector)}
      >
        {openSelector
          ? "Close icon selector"
          : "Change icon type"}
      </button>

      {/* SELECTOR */}
      {openSelector && (
        <div className="rating-selector">

          {iconOptions.map((opt) => (

            <label
              key={opt.id}
              className={`rating-option ${
                value === opt.id
                  ? "rating-option-active"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="iconType"
                value={opt.id}
                checked={value === opt.id}
                onChange={() => onChange(opt.id)}
                className="rating-radio"
              />

              <FontAwesomeIcon
                icon={opt.icon}
              />

            </label>

          ))}

        </div>
      )}

    </div>
    </div>
  );
}