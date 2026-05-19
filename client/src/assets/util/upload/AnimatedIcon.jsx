// import React, { useEffect } from "react";
// export default function AnimatedIcon({src}) {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://cdn.lordicon.com/lordicon.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   return (

//       <lord-icon
//         src={src}
//         trigger="loop"
//         delay="3000"
//         style={{ width: "20px", height: "20px" }}
//       ></lord-icon>
      
//   );
// }

import React, { useEffect, useState } from "react";
import { AppstoreOutlined } from "@ant-design/icons";

let lordIconLoaded = false;

export function AnimatedIcon({ src }) {
  const [isValid, setIsValid] = useState(true);

  // Load lordicon script only once
  useEffect(() => {
    if (!lordIconLoaded) {
      const script = document.createElement("script");
      script.src = "https://cdn.lordicon.com/lordicon.js";
      script.async = true;

      document.body.appendChild(script);

      lordIconLoaded = true;
    }
  }, []);

  // Validate icon URL
  useEffect(() => {
    if (!src) {
      setIsValid(false);
      return;
    }

    fetch(src, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) {
          setIsValid(false);
        }
      })
      .catch(() => {
        setIsValid(false);
      });
  }, [src]);

  // Fallback icon
  if (!isValid) {
    return <AppstoreOutlined style={{ fontSize: 18 }} />;
  }

  return (
    <lord-icon
      src={src}
      trigger="loop"
      delay="3000"
      style={{ width: "20px", height: "20px" }}
    ></lord-icon>
  );
}

export function DisplayAnimatedIcon({ src }) {

  useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://cdn.lordicon.com/lordicon.js";
      script.async = true;

      document.body.appendChild(script);
  }, []);
  return (
    <lord-icon
      src={src}
      trigger="loop"
      delay="3000"
      style={{ width: "20px", height: "20px" }}
    ></lord-icon>
  );
}