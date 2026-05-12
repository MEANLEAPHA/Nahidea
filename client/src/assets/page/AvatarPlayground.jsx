

// import { useMemo, useRef, useState } from "react";
// import axios from "axios";

// import {
//   RefreshCcw,
//   Save,
//   Check,
//   Upload,
//   RotateCw,
// } from "lucide-react";

// import "./avatar.css";

// const AVATAR_STYLES = [
//   "adventurer",
//   "avataaars",
//   "big-smile",
//   "bottts",
//   "croodles",
//   "fun-emoji",
//   "icons",
//   "identicon",
//   "initials",
//   "lorelei",
//   "micah",
//   "miniavs",
//   "notionists",
//   "open-peeps",
//   "personas",
//   "pixel-art",
//   "rings",
//   "shapes",
//   "thumbs",
// ];

// const COLORS = [
//   "c0aede",
//   "ffd5dc",
//   "b6e3f4",
//   "d1d4f9",
//   "fef08a",
//   "86efac",
//   "fca5a5",
//   "fdba74",
//   "67e8f9",
//   "a7f3d0",
//   "f9a8d4",
//   "ddd6fe",
//   "fecaca",
//   "fcd34d",
//   "93c5fd",
//   "4ade80",
//   "fb7185",
//   "818cf8",
// ];

// const randomSeed = () =>
//   Math.random().toString(36).slice(2, 10);

// export default function AvatarPlayground() {
//   const fileInputRef = useRef(null);

//   const [saved, setSaved] = useState(false);

//   const [style, setStyle] =
//     useState("adventurer");

//   const [seed, setSeed] = useState(
//     randomSeed()
//   );

//   const [flip, setFlip] = useState(false);

//   const [rotate, setRotate] = useState(0);

//   const [backgroundColor, setBackgroundColor] =
//     useState("c0aede");

//   const [uploadedImage, setUploadedImage] =
//     useState(null);

//   // DICEBEAR URL
//   const avatarUrl = useMemo(() => {
//     const params = new URLSearchParams();

//     params.set("seed", seed);

//     params.set(
//       "backgroundColor",
//       backgroundColor
//     );

//     params.set("flip", flip);

//     params.set("rotate", rotate);

//     return `https://api.dicebear.com/9.x/${style}/svg?${params.toString()}`;
//   }, [
//     style,
//     seed,
//     backgroundColor,
//     flip,
//     rotate,
//   ]);

//   const saveAvatar = async () => {
//     try {
//       const finalAvatar =
//         uploadedImage || avatarUrl;

//       await axios.post(
//         "http://localhost:5000/api/avatar/save",
//         {
//           userId: 1,
//           avatarUrl: finalAvatar,
//         }
//       );

//       setSaved(true);

//       setTimeout(() => {
//         setSaved(false);
//       }, 2000);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const randomize = () => {
//     setSeed(randomSeed());

//     setRotate(
//       Math.floor(Math.random() * 360)
//     );

//     const randomColor =
//       COLORS[
//         Math.floor(
//           Math.random() * COLORS.length
//         )
//       ];

//     setBackgroundColor(randomColor);
//   };

//   const uploadImage = (e) => {
//     const file = e.target.files[0];

//     if (!file) return;

//     const imageUrl =
//       URL.createObjectURL(file);

//     setUploadedImage(imageUrl);
//   };

//   return (
//     <div className="avatar-page">

//       {/* STYLE SIDEBAR */}
//       <div className="style-sidebar">

//         <h2>Styles</h2>

//         <div className="style-grid">

//           {AVATAR_STYLES.map((s) => (
//             <div
//               key={s}
//               className={`style-card ${
//                 style === s
//                   ? "active"
//                   : ""
//               }`}
//               onClick={() => {
//                 setStyle(s);

//                 setUploadedImage(null);
//               }}
//             >
//               <img
//                 src={`https://api.dicebear.com/9.x/${s}/svg?seed=preview`}
//                 alt=""
//               />

//               <span>{s}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* PREVIEW */}
//       <div className="preview-section">

//         <div className="avatar-preview-card">

//           <img
//             src={
//               uploadedImage
//                 ? uploadedImage
//                 : avatarUrl
//             }
//             alt=""
//             className="main-avatar"
//           />

//           <div className="preview-actions">

//             {/* RANDOM */}
//             <button
//               className="random-btn"
//               onClick={randomize}
//             >
//               <RefreshCcw size={18} />
//               Random
//             </button>

//             {/* UPLOAD */}
//             <button
//               className="upload-btn"
//               onClick={() =>
//                 fileInputRef.current.click()
//               }
//             >
//               <Upload size={18} />
//               Upload
//             </button>

//             <input
//               type="file"
//               hidden
//               ref={fileInputRef}
//               accept="image/*"
//               onChange={uploadImage}
//             />
//           </div>
//         </div>
//       </div>

//       {/* CONTROLS */}
//       <div className="control-sidebar">

//         <h2>Customize</h2>

//         {/* FLIP */}
//         <div className="control-group">

//           <div className="switch-row">

//             <label>Flip Avatar</label>

//             <input
//               type="checkbox"
//               checked={flip}
//               onChange={(e) =>
//                 setFlip(e.target.checked)
//               }
//             />
//           </div>
//         </div>

//         {/* ROTATE */}
//         <div className="control-group">

//           <div className="rotate-header">

//             <label>Rotate</label>

//             <span>{rotate}°</span>
//           </div>

//           <input
//             type="range"
//             min="0"
//             max="360"
//             value={rotate}
//             onChange={(e) =>
//               setRotate(
//                 Number(e.target.value)
//               )
//             }
//             className="rotate-slider"
//           />

//           <button
//             className="rotate-btn"
//             onClick={() =>
//               setRotate((prev) =>
//                 prev >= 360
//                   ? 0
//                   : prev + 45
//               )
//             }
//           >
//             <RotateCw size={16} />
//             Rotate +45°
//           </button>
//         </div>

//         {/* COLORS */}
//         <div className="control-group">

//           <label>Background Colors</label>

//           <div className="color-list">

//             {COLORS.map((color) => (
//               <button
//                 key={color}
//                 className={`color-btn ${
//                   backgroundColor === color
//                     ? "active"
//                     : ""
//                 }`}
//                 style={{
//                   background: `#${color}`,
//                 }}
//                 onClick={() =>
//                   setBackgroundColor(
//                     color
//                   )
//                 }
//               />
//             ))}
//           </div>
//         </div>

//         {/* SAVE */}
//         <button
//           className="save-btn"
//           onClick={saveAvatar}
//         >
//           {saved ? (
//             <>
//               <Check size={18} />
//               Saved
//             </>
//           ) : (
//             <>
//               <Save size={18} />
//               Select Avatar
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import axios from "axios";

import {
  Save,
  Check,
  RotateCw,
} from "lucide-react";

import "./avatar.css";

const AVATAR_STYLES = [
  "adventurer",
  "avataaars",
  "big-smile",
  "bottts",
  "croodles",
  "fun-emoji",
  "icons",
  "identicon",
  "initials",
  "lorelei",
  "micah",
  "miniavs",
  "notionists",
  "open-peeps",
  "personas",
  "pixel-art",
  "rings",
  "shapes",
  "thumbs",
];

const COLORS = [
  "c0aede",
  "ffd5dc",
  "b6e3f4",
  "d1d4f9",
  "fef08a",
  "86efac",
  "fca5a5",
  "fdba74",
  "67e8f9",
  "a7f3d0",
  "f9a8d4",
  "ddd6fe",
  "fecaca",
  "fcd34d",
  "93c5fd",
  "4ade80",
  "fb7185",
  "818cf8",
];

const PRESET_SEEDS = [
  "Alex",
  "Luna",
  "Milo",
  "Nova",
  "Leo",
  "Zara",
  "Kai",
  "Jade",
  "Ace",
  "Ruby",
  "Ghost",
  "Pixel",
  "Shadow",
  "Cosmo",
  "Rex",
  "Violet",
  "Coco",
  "Blaze",
  "Storm",
  "Echo",
];

export default function AvatarPlayground() {
  const [saved, setSaved] = useState(false);

  const [style, setStyle] =
    useState("adventurer");

  const [seed, setSeed] =
    useState("Alex");

  const [flip, setFlip] =
    useState(false);

  const [rotate, setRotate] =
    useState(0);

  const [backgroundColor, setBackgroundColor] =
    useState("c0aede");

  // FINAL DICEBEAR URL
  const avatarUrl = useMemo(() => {
    const params = new URLSearchParams();

    params.set("seed", seed);

    params.set(
      "backgroundColor",
      backgroundColor
    );

    params.set("flip", flip);

    params.set("rotate", rotate);

    return `https://api.dicebear.com/9.x/${style}/svg?${params.toString()}`;
  }, [
    style,
    seed,
    backgroundColor,
    flip,
    rotate,
  ]);

  // SAVE URL ONLY
  const saveAvatar = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/avatar/save",
        {
          userId: 1,
          avatarUrl,
        }
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="avatar-page">

      {/* LEFT SIDEBAR */}
      <div className="style-sidebar">

        <h2>Avatar Styles</h2>

        <div className="style-grid">

          {AVATAR_STYLES.map((s) => (
            <div
              key={s}
              className={`style-card ${
                style === s
                  ? "active"
                  : ""
              }`}
              onClick={() => setStyle(s)}
            >
              <img
                src={`https://api.dicebear.com/9.x/${s}/svg?seed=preview`}
                alt=""
              />

              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER */}
      <div className="preview-section">

        <div className="avatar-preview-card">

          {/* MAIN AVATAR */}
          <img
            src={avatarUrl}
            alt=""
            className="main-avatar"
          />

          {/* PRESETS */}
          <div className="preset-section">

            <h3>Choose Avatar</h3>

            <div className="preset-grid">

              {PRESET_SEEDS.map(
                (preset) => (
                  <div
                    key={preset}
                    className={`preset-card ${
                      seed === preset
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSeed(preset)
                    }
                  >
                    <img
                      src={`https://api.dicebear.com/9.x/${style}/svg?seed=${preset}&backgroundColor=${backgroundColor}`}
                      alt=""
                    />

                    <span>{preset}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="control-sidebar">

        <h2>Customize</h2>

        {/* FLIP */}
        <div className="control-group">

          <div className="switch-row">

            <label>
              Flip Avatar
            </label>

            <input
              type="checkbox"
              checked={flip}
              onChange={(e) =>
                setFlip(
                  e.target.checked
                )
              }
            />
          </div>
        </div>

        {/* ROTATE */}
        <div className="control-group">

          <div className="rotate-header">

            <label>Rotate</label>

            <span>{rotate}°</span>
          </div>

          <input
            type="range"
            min="0"
            max="360"
            value={rotate}
            onChange={(e) =>
              setRotate(
                Number(
                  e.target.value
                )
              )
            }
            className="rotate-slider"
          />

          <button
            className="rotate-btn"
            onClick={() =>
              setRotate((prev) =>
                prev >= 360
                  ? 0
                  : prev + 45
              )
            }
          >
            <RotateCw size={16} />
            Rotate +45°
          </button>
        </div>

        {/* COLORS */}
        <div className="control-group">

          <label>
            Background Colors
          </label>

          <div className="color-list">

            {COLORS.map((color) => (
              <button
                key={color}
                className={`color-btn ${
                  backgroundColor ===
                  color
                    ? "active"
                    : ""
                }`}
                style={{
                  background: `#${color}`,
                }}
                onClick={() =>
                  setBackgroundColor(
                    color
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* SAVE */}
        <button
          className="save-btn"
          onClick={saveAvatar}
        >
          {saved ? (
            <>
              <Check size={18} />
              Saved
            </>
          ) : (
            <>
              <Save size={18} />
              Select Avatar
            </>
          )}
        </button>
      </div>
    </div>
  );
}