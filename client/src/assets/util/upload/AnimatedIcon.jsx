import React, { useEffect } from "react";
export default function AnimatedIcon({src}) {
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