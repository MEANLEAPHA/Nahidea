import { AppstoreOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";

export function AnimatedIcon({ src }) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!src) return;

    // Load Lordicon script once
    const script = document.createElement("script");
    script.src = "https://cdn.lordicon.com/lordicon.js";
    script.async = true;
    document.body.appendChild(script);

    // Validate JSON file
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid JSON");
        return res.json();
      })
      .then(() => setIsValid(true))
      .catch(() => setIsValid(false));
  }, [src]);

  if (!src || !isValid) return null;

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
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!src) return;

    // ✅ Check if script already exists before adding
    const existingScript = document.querySelector('script[src="https://cdn.lordicon.com/lordicon.js"]');
    
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.lordicon.com/lordicon.js";
      script.async = true;
      document.body.appendChild(script);
    }

    let isMounted = true;

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid JSON");
        return res.json();
      })
      .then(() => {
        if (isMounted) setIsValid(true);
      })
      .catch(() => {
        if (isMounted) setIsValid(false);
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (!src || !isValid) return null;

  return (
    <lord-icon
      src={src}
      trigger="loop"
      delay="3000"
      style={{ width: "20px", height: "20px" }}
    ></lord-icon>
  );
}
